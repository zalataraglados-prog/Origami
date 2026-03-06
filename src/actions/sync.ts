"use server";

import { db } from "@/lib/db";
import { accounts, emails, attachments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { decrypt, encrypt } from "@/lib/crypto";
import { uploadAttachment, buildObjectKey } from "@/lib/r2";
import { QQProvider } from "@/lib/providers/qq";
import { GmailProvider } from "@/lib/providers/gmail";
import { OutlookProvider } from "@/lib/providers/outlook";
import { updateAccountSyncState } from "./account";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";
import type { EmailProvider, SyncedEmail, SyncedAttachment } from "@/lib/providers/types";
import type { Account } from "@/lib/db/schema";

function createProvider(account: Account, creds: Record<string, string>): EmailProvider {
  switch (account.provider) {
    case "qq":
      return new QQProvider({ email: creds.email, authCode: creds.authCode });
    case "gmail":
      return new GmailProvider({
        accessToken: creds.accessToken,
        refreshToken: creds.refreshToken,
      });
    case "outlook":
      return new OutlookProvider({
        accessToken: creds.accessToken,
        refreshToken: creds.refreshToken,
      });
    default:
      throw new Error(`Unknown provider: ${account.provider}`);
  }
}

async function persistEmails(
  accountId: string,
  synced: SyncedEmail[]
): Promise<number> {
  let count = 0;

  for (const mail of synced) {
    const emailId = nanoid();
    try {
      await db.insert(emails).values({
        id: emailId,
        accountId,
        messageId: mail.messageId,
        subject: mail.subject,
        sender: mail.sender,
        recipients: JSON.stringify(mail.recipients),
        snippet: mail.snippet,
        bodyText: mail.bodyText,
        bodyHtml: mail.bodyHtml,
        isRead: 0,
        isStarred: 0,
        receivedAt: mail.receivedAt,
        folder: mail.folder,
      });
      count++;

      for (const att of mail.attachments) {
        await persistAttachment(accountId, emailId, att);
      }
    } catch (err: unknown) {
      const error = err as { message?: string };
      if (error.message?.includes("UNIQUE constraint")) {
        continue;
      }
      throw err;
    }
  }

  return count;
}

async function persistAttachment(
  accountId: string,
  emailId: string,
  att: SyncedAttachment
) {
  const attId = nanoid();
  const key = buildObjectKey(accountId, emailId, att.filename);

  await uploadAttachment(key, att.content, att.contentType);
  await db.insert(attachments).values({
    id: attId,
    emailId,
    filename: att.filename,
    contentType: att.contentType,
    size: att.size,
    r2ObjectKey: key,
  });
}

export async function syncAccount(accountId: string): Promise<{ synced: number; error?: string }> {
  const rows = await db.select().from(accounts).where(eq(accounts.id, accountId));
  const account = rows[0];
  if (!account) return { synced: 0, error: "Account not found" };

  try {
    const creds = JSON.parse(decrypt(account.credentials));
    const provider = createProvider(account, creds);
    const result = await provider.sync(account.syncCursor);
    const synced = await persistEmails(account.id, result.emails);

    let updatedCreds: string | undefined;
    if (account.provider === "gmail") {
      const updated = (provider as GmailProvider).getUpdatedTokens();
      updatedCreds = encrypt(JSON.stringify(updated));
    } else if (account.provider === "outlook") {
      const updated = (provider as OutlookProvider).getUpdatedTokens();
      updatedCreds = encrypt(JSON.stringify(updated));
    }

    await updateAccountSyncState(account.id, result.newCursor, updatedCreds);
    revalidatePath("/");
    return { synced };
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`Sync error for ${account.email}:`, error.message);
    return { synced: 0, error: error.message };
  }
}

export async function syncAll(): Promise<{ results: Array<{ email: string; synced: number; error?: string }> }> {
  const allAccounts = await db.select().from(accounts);
  const results: Array<{ email: string; synced: number; error?: string }> = [];

  for (const account of allAccounts) {
    try {
      const creds = JSON.parse(decrypt(account.credentials));
      const provider = createProvider(account, creds);
      const result = await provider.sync(account.syncCursor);
      const synced = await persistEmails(account.id, result.emails);

      let updatedCreds: string | undefined;
      if (account.provider === "gmail") {
        const updated = (provider as GmailProvider).getUpdatedTokens();
        updatedCreds = encrypt(JSON.stringify(updated));
      } else if (account.provider === "outlook") {
        const updated = (provider as OutlookProvider).getUpdatedTokens();
        updatedCreds = encrypt(JSON.stringify(updated));
      }

      await updateAccountSyncState(account.id, result.newCursor, updatedCreds);
      results.push({ email: account.email, synced });
    } catch (err: unknown) {
      const error = err as Error;
      console.error(`Sync error for ${account.email}:`, error.message);
      results.push({ email: account.email, synced: 0, error: error.message });
    }
  }

  revalidatePath("/");
  return { results };
}

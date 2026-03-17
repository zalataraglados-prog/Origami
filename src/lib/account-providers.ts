import { db } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { accounts, type Account } from "@/lib/db/schema";
import { getAccountRecordById, listAccounts } from "@/lib/queries/accounts";
import { createEmailProvider, getUpdatedProviderCredentials } from "@/lib/providers/factory";
import { hasGmailSendScope } from "@/lib/providers/gmail";
import { hasOutlookSendScope } from "@/lib/providers/outlook";
import type { EmailProvider } from "@/lib/providers/types";
import { eq } from "drizzle-orm";

export interface SendCapableAccountSummary {
  id: string;
  provider: string;
  email: string;
  displayName: string;
  fromAddress: string;
}

export function parseAccountCredentials(account: Account) {
  return JSON.parse(decrypt(account.credentials)) as Record<string, unknown>;
}

export function canAccountSendFromCredentials(
  provider: Account["provider"],
  credentials: Record<string, unknown>
): boolean {
  switch (provider) {
    case "gmail":
      return hasGmailSendScope(credentials.scopes as string[] | undefined);
    case "outlook":
      return hasOutlookSendScope(credentials.scopes as string[] | undefined);
    case "qq":
    case "imap_smtp":
      return true;
    default:
      return false;
  }
}

export function canAccountSend(account: Account): boolean {
  try {
    return canAccountSendFromCredentials(account.provider, parseAccountCredentials(account));
  } catch (error) {
    console.warn("Failed to inspect provider capabilities:", account.email, error);
    return false;
  }
}

function toSendCapableAccountSummary(account: Account): SendCapableAccountSummary {
  return {
    id: account.id,
    provider: account.provider,
    email: account.email,
    displayName: account.displayName ?? account.email,
    fromAddress: account.displayName
      ? `${account.displayName} <${account.email}>`
      : account.email,
  };
}

export async function createProviderForAccount(account: Account): Promise<EmailProvider> {
  return createEmailProvider(account, parseAccountCredentials(account));
}

export async function getAccountWithProvider(accountId: string): Promise<{
  account: Account;
  provider: EmailProvider;
} | null> {
  const account = await getAccountRecordById(accountId);
  if (!account) return null;

  return {
    account,
    provider: await createProviderForAccount(account),
  };
}

export async function persistProviderCredentialsIfNeeded(account: Account, provider: EmailProvider) {
  const updatedCredentials = getUpdatedProviderCredentials(account, provider);
  if (!updatedCredentials) return;

  await db.update(accounts).set({ credentials: updatedCredentials }).where(eq(accounts.id, account.id));
}

export async function listSendCapableAccounts(): Promise<SendCapableAccountSummary[]> {
  const rows = await listAccounts();
  return rows.filter(canAccountSend).map(toSendCapableAccountSummary);
}

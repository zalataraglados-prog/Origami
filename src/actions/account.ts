"use server";

import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { encrypt, decrypt } from "@/lib/crypto";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export async function getAccounts() {
  return db.select().from(accounts).orderBy(accounts.createdAt);
}

export async function getAccountById(id: string) {
  const rows = await db.select().from(accounts).where(eq(accounts.id, id));
  return rows[0] ?? null;
}

export async function addQQAccount(email: string, authCode: string, displayName?: string) {
  const id = nanoid();
  const creds = encrypt(JSON.stringify({ email, authCode }));

  await db.insert(accounts).values({
    id,
    provider: "qq",
    email,
    displayName: displayName ?? email,
    credentials: creds,
  });

  revalidatePath("/");
  return id;
}

export async function addOAuthAccount(
  provider: "gmail" | "outlook",
  email: string,
  displayName: string,
  accessToken: string,
  refreshToken: string
) {
  const id = nanoid();
  const creds = encrypt(JSON.stringify({ accessToken, refreshToken }));

  await db
    .insert(accounts)
    .values({
      id,
      provider,
      email,
      displayName: displayName ?? email,
      credentials: creds,
    })
    .onConflictDoUpdate({
      target: accounts.email,
      set: { credentials: creds, displayName },
    });

  revalidatePath("/");
  return id;
}

export async function removeAccount(id: string) {
  await db.delete(accounts).where(eq(accounts.id, id));
  revalidatePath("/");
}

export async function getDecryptedCredentials(id: string) {
  const account = await getAccountById(id);
  if (!account) throw new Error("Account not found");
  return JSON.parse(decrypt(account.credentials));
}

export async function updateAccountSyncState(
  id: string,
  syncCursor: string | null,
  credentials?: string
) {
  const updates: Record<string, unknown> = {
    syncCursor,
    lastSyncedAt: Math.floor(Date.now() / 1000),
  };
  if (credentials) {
    updates.credentials = credentials;
  }
  await db.update(accounts).set(updates).where(eq(accounts.id, id));
}

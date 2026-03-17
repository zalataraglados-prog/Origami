import { cache } from "react";
import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const listAccounts = cache(async function listAccounts() {
  return db.select().from(accounts).orderBy(accounts.createdAt);
});

export const getAccountRecordById = cache(async function getAccountRecordById(id: string) {
  const rows = await db.select().from(accounts).where(eq(accounts.id, id));
  return rows[0] ?? null;
});

export const getAccountRecordByEmail = cache(async function getAccountRecordByEmail(email: string) {
  const rows = await db.select().from(accounts).where(eq(accounts.email, email));
  return rows[0] ?? null;
});

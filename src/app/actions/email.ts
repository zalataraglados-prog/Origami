"use server";

import { eq, inArray, sql } from "drizzle-orm";
import { runLoggedAction } from "@/lib/actions";
import { db } from "@/lib/db";
import { accounts, emails } from "@/lib/db/schema";
import {
  countUnreadEmails,
  getEmailRecordById,
  listEmailAttachments,
  listEmails,
} from "@/lib/queries/emails";
import { writeBackRead, writeBackStar } from "@/lib/providers/writeBack";
import { getHydratedEmailDetail, hydrateEmailIfNeeded } from "@/lib/services/email-service";

async function getWriteBackTargets(emailIds: string[]) {
  if (emailIds.length === 0) return [];

  const rows = await db
    .select({ email: emails, account: accounts })
    .from(emails)
    .innerJoin(accounts, eq(accounts.id, emails.accountId))
    .where(inArray(emails.id, emailIds));

  return rows;
}

function triggerReadWriteBack(emailId: string) {
  void getWriteBackTargets([emailId])
    .then(async (rows) => {
      const row = rows[0];
      if (!row?.email.remoteId) return;
      await writeBackRead(row.account, row.email.remoteId);
    })
    .catch((error) => {
      console.warn(`[writeback:read] failed to schedule for ${emailId}:`, error);
    });
}

function triggerStarWriteBack(emailIds: string[], starred: boolean) {
  void getWriteBackTargets(emailIds)
    .then(async (rows) => {
      await Promise.allSettled(
        rows
          .filter((row) => Boolean(row.email.remoteId))
          .map((row) => writeBackStar(row.account, row.email.remoteId!, starred))
      );
    })
    .catch((error) => {
      console.warn(`[writeback:star] failed to schedule for ${emailIds.join(",")}:`, error);
    });
}

export async function getEmails(opts?: {
  accountId?: string;
  folder?: string;
  search?: string;
  starred?: boolean;
  limit?: number;
  offset?: number;
}) {
  return listEmails(opts);
}

export async function getEmailById(id: string) {
  const email = await getEmailRecordById(id);
  if (!email) return null;
  return hydrateEmailIfNeeded(email);
}

export async function getEmailAttachments(emailId: string) {
  return listEmailAttachments(emailId);
}

export async function getEmailDetail(emailId: string) {
  return getHydratedEmailDetail(emailId);
}

export async function markRead(emailId: string) {
  return runLoggedAction("markRead", async () => {
    await db
      .update(emails)
      .set({ isRead: 1 })
      .where(eq(emails.id, emailId));

    triggerReadWriteBack(emailId);
  });
}

export async function toggleStar(emailId: string) {
  return runLoggedAction("toggleStar", async () => {
    await db.run(
      sql`UPDATE emails SET is_starred = CASE WHEN is_starred = 1 THEN 0 ELSE 1 END WHERE id = ${emailId}`
    );

    const row = await db
      .select({ isStarred: emails.isStarred })
      .from(emails)
      .where(eq(emails.id, emailId));

    triggerStarWriteBack([emailId], row[0]?.isStarred === 1);
  });
}

export async function setStarred(emailIds: string[], starred = true) {
  return runLoggedAction("setStarred", async () => {
    if (emailIds.length === 0) return;
    await db
      .update(emails)
      .set({ isStarred: starred ? 1 : 0 })
      .where(inArray(emails.id, emailIds));

    triggerStarWriteBack(emailIds, starred);
  });
}

export async function markDone(emailIds: string[], done = true) {
  return runLoggedAction("markDone", async () => {
    if (emailIds.length === 0) return;
    await db
      .update(emails)
      .set({ localDone: done ? 1 : 0 })
      .where(inArray(emails.id, emailIds));
  });
}

export async function markArchived(emailIds: string[], archived = true) {
  return runLoggedAction("markArchived", async () => {
    if (emailIds.length === 0) return;
    await db
      .update(emails)
      .set({ localArchived: archived ? 1 : 0 })
      .where(inArray(emails.id, emailIds));
  });
}

export async function snooze(emailIds: string[], snoozeUntil: Date | string) {
  return runLoggedAction("snooze", async () => {
    if (emailIds.length === 0) return;
    const unix = Math.floor(new Date(snoozeUntil).getTime() / 1000);
    await db
      .update(emails)
      .set({ localSnoozeUntil: unix })
      .where(inArray(emails.id, emailIds));
  });
}

export async function clearSnooze(emailIds: string[]) {
  return runLoggedAction("clearSnooze", async () => {
    if (emailIds.length === 0) return;
    await db
      .update(emails)
      .set({ localSnoozeUntil: null })
      .where(inArray(emails.id, emailIds));
  });
}

export async function getUnreadCount(accountId?: string) {
  return countUnreadEmails(accountId);
}

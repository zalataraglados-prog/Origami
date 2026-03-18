import { inArray, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { composeUploads } from "@/lib/db/schema";
import { deleteAttachment } from "@/lib/r2";

export const COMPOSE_UPLOAD_TTL_SECONDS = 60 * 60 * 24;

function nowUnix() {
  return Math.floor(Date.now() / 1000);
}

export function isComposeUploadExpired(createdAt: number | null | undefined, now = nowUnix()) {
  if (typeof createdAt !== "number") return true;
  return createdAt <= now - COMPOSE_UPLOAD_TTL_SECONDS;
}

export async function cleanupComposeUploadRows(
  rows: Array<{ id: string; r2ObjectKey: string }>
): Promise<number> {
  if (rows.length === 0) return 0;

  const uniqueRows = Array.from(new Map(rows.map((row) => [row.id, row])).values());
  const deletionResults = await Promise.allSettled(
    uniqueRows.map((row) => deleteAttachment(row.r2ObjectKey))
  );

  for (const [index, result] of deletionResults.entries()) {
    if (result.status === "rejected") {
      console.warn("Failed to delete expired compose upload object:", uniqueRows[index]?.r2ObjectKey, result.reason);
    }
  }

  await db.delete(composeUploads).where(inArray(composeUploads.id, uniqueRows.map((row) => row.id)));
  return uniqueRows.length;
}

export async function cleanupExpiredComposeUploads(now = nowUnix()): Promise<number> {
  const cutoff = now - COMPOSE_UPLOAD_TTL_SECONDS;
  const rows = await db
    .select({ id: composeUploads.id, r2ObjectKey: composeUploads.r2ObjectKey })
    .from(composeUploads)
    .where(lte(composeUploads.createdAt, cutoff));

  return cleanupComposeUploadRows(rows);
}

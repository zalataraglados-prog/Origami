import { sqliteTable, text, integer, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  provider: text("provider").notNull(), // 'gmail' | 'outlook' | 'qq'
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  credentials: text("credentials").notNull(), // AES-encrypted JSON
  syncCursor: text("sync_cursor"),
  lastSyncedAt: integer("last_synced_at"),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
});

export const emails = sqliteTable(
  "emails",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id")
      .notNull()
      .references(() => accounts.id, { onDelete: "cascade" }),
    messageId: text("message_id"),
    subject: text("subject"),
    sender: text("sender"),
    recipients: text("recipients"), // JSON array
    snippet: text("snippet"),
    bodyText: text("body_text"),
    bodyHtml: text("body_html"),
    isRead: integer("is_read").default(0),
    isStarred: integer("is_starred").default(0),
    receivedAt: integer("received_at"),
    folder: text("folder").default("INBOX"),
    rawHeaders: text("raw_headers"),
    createdAt: integer("created_at").default(sql`(unixepoch())`),
  },
  (t) => [uniqueIndex("account_message_idx").on(t.accountId, t.messageId)]
);

export const attachments = sqliteTable("attachments", {
  id: text("id").primaryKey(),
  emailId: text("email_id")
    .notNull()
    .references(() => emails.id, { onDelete: "cascade" }),
  filename: text("filename"),
  contentType: text("content_type"),
  size: integer("size"),
  r2ObjectKey: text("r2_object_key").notNull(),
  createdAt: integer("created_at").default(sql`(unixepoch())`),
});

export type Account = typeof accounts.$inferSelect;
export type NewAccount = typeof accounts.$inferInsert;
export type Email = typeof emails.$inferSelect;
export type NewEmail = typeof emails.$inferInsert;
export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;

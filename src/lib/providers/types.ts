export interface SyncedEmail {
  messageId: string;
  subject: string;
  sender: string;
  recipients: string[];
  snippet: string;
  bodyText: string;
  bodyHtml: string;
  receivedAt: number; // unix timestamp
  folder: string;
  attachments: SyncedAttachment[];
}

export interface SyncedAttachment {
  filename: string;
  contentType: string;
  size: number;
  content: Buffer;
}

export interface SyncResult {
  emails: SyncedEmail[];
  newCursor: string | null;
}

export interface EmailProvider {
  sync(cursor: string | null): Promise<SyncResult>;
}

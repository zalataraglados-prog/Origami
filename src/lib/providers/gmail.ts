import { google, type gmail_v1 } from "googleapis";
import type { EmailProvider, SyncResult, SyncedEmail, SyncedAttachment } from "./types";

interface GmailCredentials {
  accessToken: string;
  refreshToken: string;
}

function getOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_APP_URL}/api/oauth/gmail`
  );
}

export function getGmailAuthUrl(): string {
  const oauth2 = getOAuth2Client();
  return oauth2.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: [
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  });
}

export async function exchangeGmailCode(code: string) {
  const oauth2 = getOAuth2Client();
  const { tokens } = await oauth2.getToken(code);
  oauth2.setCredentials(tokens);

  const gmail = google.gmail({ version: "v1", auth: oauth2 });
  const profile = await gmail.users.getProfile({ userId: "me" });

  return {
    email: profile.data.emailAddress!,
    accessToken: tokens.access_token!,
    refreshToken: tokens.refresh_token!,
  };
}

export class GmailProvider implements EmailProvider {
  private gmail: gmail_v1.Gmail;
  private oauth2: InstanceType<typeof google.auth.OAuth2>;

  constructor(creds: GmailCredentials) {
    this.oauth2 = getOAuth2Client();
    this.oauth2.setCredentials({
      access_token: creds.accessToken,
      refresh_token: creds.refreshToken,
    });
    this.oauth2.on("tokens", () => {
      // Token refresh is handled transparently by the library
    });
    this.gmail = google.gmail({ version: "v1", auth: this.oauth2 });
  }

  getUpdatedTokens(): { accessToken: string; refreshToken: string } {
    const creds = this.oauth2.credentials;
    return {
      accessToken: creds.access_token ?? "",
      refreshToken: creds.refresh_token ?? "",
    };
  }

  async sync(cursor: string | null): Promise<SyncResult> {
    if (cursor) {
      return this.incrementalSync(cursor);
    }
    return this.fullSync();
  }

  private async fullSync(): Promise<SyncResult> {
    const listRes = await this.gmail.users.messages.list({
      userId: "me",
      maxResults: 50,
      labelIds: ["INBOX"],
    });

    const messageIds = listRes.data.messages ?? [];
    const emails = await this.fetchMessages(messageIds.map((m) => m.id!));

    const profile = await this.gmail.users.getProfile({ userId: "me" });
    const historyId = profile.data.historyId ?? null;

    return { emails, newCursor: historyId };
  }

  private async incrementalSync(historyId: string): Promise<SyncResult> {
    try {
      const historyRes = await this.gmail.users.history.list({
        userId: "me",
        startHistoryId: historyId,
        historyTypes: ["messageAdded"],
        labelId: "INBOX",
      });

      const newHistoryId = historyRes.data.historyId ?? historyId;
      const history = historyRes.data.history ?? [];
      const addedIds = new Set<string>();

      for (const h of history) {
        for (const added of h.messagesAdded ?? []) {
          if (added.message?.id) addedIds.add(added.message.id);
        }
      }

      if (addedIds.size === 0) {
        return { emails: [], newCursor: newHistoryId };
      }

      const emails = await this.fetchMessages([...addedIds]);
      return { emails, newCursor: newHistoryId };
    } catch (err: unknown) {
      const error = err as { code?: number };
      if (error.code === 404) {
        return this.fullSync();
      }
      throw err;
    }
  }

  private async fetchMessages(ids: string[]): Promise<SyncedEmail[]> {
    const results: SyncedEmail[] = [];

    for (const id of ids) {
      const msg = await this.gmail.users.messages.get({
        userId: "me",
        id,
        format: "full",
      });

      const headers = msg.data.payload?.headers ?? [];
      const getHeader = (name: string) =>
        headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";

      const attachments: SyncedAttachment[] = [];
      const bodyHtml = this.extractBody(msg.data.payload, "text/html");
      const bodyText = this.extractBody(msg.data.payload, "text/plain");

      if (msg.data.payload?.parts) {
        for (const part of this.flattenParts(msg.data.payload.parts)) {
          if (part.filename && part.body?.attachmentId) {
            const att = await this.gmail.users.messages.attachments.get({
              userId: "me",
              messageId: id,
              id: part.body.attachmentId,
            });
            if (att.data.data) {
              attachments.push({
                filename: part.filename,
                contentType: part.mimeType ?? "application/octet-stream",
                size: att.data.size ?? 0,
                content: Buffer.from(att.data.data, "base64url"),
              });
            }
          }
        }
      }

      const receivedDate = msg.data.internalDate
        ? Math.floor(parseInt(msg.data.internalDate) / 1000)
        : Math.floor(Date.now() / 1000);

      results.push({
        messageId: getHeader("Message-ID") || `gmail-${id}`,
        subject: getHeader("Subject") || "(无主题)",
        sender: getHeader("From"),
        recipients: getHeader("To")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        snippet: msg.data.snippet ?? "",
        bodyText,
        bodyHtml,
        receivedAt: receivedDate,
        folder: "INBOX",
        attachments,
      });
    }

    return results;
  }

  private extractBody(
    payload: gmail_v1.Schema$MessagePart | undefined,
    mimeType: string
  ): string {
    if (!payload) return "";
    if (payload.mimeType === mimeType && payload.body?.data) {
      return Buffer.from(payload.body.data, "base64url").toString("utf-8");
    }
    for (const part of payload.parts ?? []) {
      const result = this.extractBody(part, mimeType);
      if (result) return result;
    }
    return "";
  }

  private flattenParts(
    parts: gmail_v1.Schema$MessagePart[]
  ): gmail_v1.Schema$MessagePart[] {
    const result: gmail_v1.Schema$MessagePart[] = [];
    for (const part of parts) {
      result.push(part);
      if (part.parts) result.push(...this.flattenParts(part.parts));
    }
    return result;
  }
}

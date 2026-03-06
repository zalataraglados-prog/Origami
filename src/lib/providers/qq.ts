import { ImapFlow } from "imapflow";
import { simpleParser } from "mailparser";
import type { EmailProvider, SyncResult, SyncedEmail, SyncedAttachment } from "./types";

interface QQCredentials {
  email: string;
  authCode: string; // QQ 邮箱授权码
}

export class QQProvider implements EmailProvider {
  private creds: QQCredentials;

  constructor(creds: QQCredentials) {
    this.creds = creds;
  }

  async sync(cursor: string | null): Promise<SyncResult> {
    const client = new ImapFlow({
      host: "imap.qq.com",
      port: 993,
      secure: true,
      auth: {
        user: this.creds.email,
        pass: this.creds.authCode,
      },
      logger: false,
    });

    const emails: SyncedEmail[] = [];
    const lastUid = cursor ? parseInt(cursor, 10) : 0;

    try {
      await client.connect();
      const lock = await client.getMailboxLock("INBOX");

      try {
        const uidRange = lastUid > 0 ? `${lastUid + 1}:*` : "1:*";
        const messages = client.fetch(uidRange, {
          uid: true,
          envelope: true,
          source: true,
        });

        let maxUid = lastUid;
        let count = 0;
        const MAX_EMAILS = 50;

        for await (const msg of messages) {
          if (msg.uid <= lastUid) continue;
          if (count >= MAX_EMAILS) break;

          if (!msg.source) continue;
          const parsed = await simpleParser(msg.source);
          const attachments: SyncedAttachment[] = (parsed.attachments ?? []).map(
            (att) => ({
              filename: att.filename ?? "untitled",
              contentType: att.contentType ?? "application/octet-stream",
              size: att.size,
              content: att.content,
            })
          );

          emails.push({
            messageId: parsed.messageId ?? `qq-${msg.uid}`,
            subject: parsed.subject ?? "(无主题)",
            sender: parsed.from?.text ?? "",
            recipients: (parsed.to
              ? Array.isArray(parsed.to)
                ? parsed.to.map((a) => a.text)
                : [parsed.to.text]
              : []),
            snippet: (parsed.text ?? "").slice(0, 200),
            bodyText: parsed.text ?? "",
            bodyHtml: parsed.html || parsed.textAsHtml || "",
            receivedAt: parsed.date
              ? Math.floor(parsed.date.getTime() / 1000)
              : Math.floor(Date.now() / 1000),
            folder: "INBOX",
            attachments,
          });

          if (msg.uid > maxUid) maxUid = msg.uid;
          count++;
        }

        return {
          emails,
          newCursor: maxUid > lastUid ? String(maxUid) : cursor,
        };
      } finally {
        lock.release();
      }
    } finally {
      await client.logout();
    }
  }
}

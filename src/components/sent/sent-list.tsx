import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/format";
import { buildSentDetailHref } from "@/lib/inbox-route";
import { parseStoredStringList } from "@/lib/string-list";
import type { SentMessage } from "@/lib/db/schema";
import type { AppLocale } from "@/i18n/locale";
import { getMessages } from "@/i18n/messages";

export function SentList({
  messages,
  accountId,
  locale,
}: {
  messages: SentMessage[];
  accountId?: string;
  locale: AppLocale;
}) {
  const t = getMessages(locale);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-muted-foreground">
        {t.sent.empty}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 p-6">
      <div className="rounded-[2rem] border border-border/80 bg-background/72 p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">{t.sent.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t.sent.description}
          {accountId ? ` ${t.sent.filteredDescription}` : ""}
        </p>
      </div>

      <div className="space-y-3">
        {messages.map((message) => {
          const toRecipients = parseStoredStringList(message.toRecipients);
          return (
            <Link
              key={message.id}
              href={buildSentDetailHref(message.id, accountId)}
              className="block rounded-[1.5rem] border border-border/80 bg-background/72 p-5 transition-colors hover:bg-accent/45"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium">{message.subject || t.common.untitled}</span>
                    <Badge variant="secondary">{t.sent.badge}</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">
                    {t.sent.to}: {toRecipients.join(", ") || "-"}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {message.snippet || message.bodyText || t.common.noSummary}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatRelativeTime(message.sentAt, locale)}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

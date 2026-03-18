import { listSentMessages } from "@/lib/queries/sent-messages";
import { SentList } from "@/components/sent/sent-list";
import { getRequestLocale } from "@/i18n/locale.server";

interface PageProps {
  searchParams: Promise<{ account?: string }>;
}

export default async function SentPage({ searchParams }: PageProps) {
  const [params, locale] = await Promise.all([searchParams, getRequestLocale()]);
  const accountId = params.account;
  const messages = await listSentMessages(accountId);

  return <SentList messages={messages} accountId={accountId} locale={locale} />;
}

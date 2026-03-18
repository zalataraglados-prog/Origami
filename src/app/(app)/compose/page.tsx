import { listSendCapableAccounts } from "@/lib/account-providers";
import { ComposeForm } from "@/components/compose/compose-form";
import { getRequestLocale } from "@/i18n/locale.server";
import { getMessages } from "@/i18n/messages";

interface PageProps {
  searchParams: Promise<{ account?: string }>;
}

export default async function ComposePage({ searchParams }: PageProps) {
  const [params, locale] = await Promise.all([searchParams, getRequestLocale()]);
  const messages = getMessages(locale);
  const accounts = await listSendCapableAccounts();

  if (accounts.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="max-w-md rounded-[2rem] border border-border/80 bg-background/72 p-8 text-center shadow-sm">
          <h1 className="text-2xl font-semibold">{messages.compose.noAccountsTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {messages.compose.noAccountsDescription}
          </p>
        </div>
      </div>
    );
  }

  return <ComposeForm accounts={accounts} initialAccountId={params.account} />;
}

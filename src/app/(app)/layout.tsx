import { Sidebar } from "@/components/layout/sidebar";
import { canAccountSend } from "@/lib/account-providers";
import { listAccounts } from "@/lib/queries/accounts";
import { countUnreadEmails } from "@/lib/queries/emails";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [accounts, unreadCount] = await Promise.all([
    listAccounts(),
    countUnreadEmails(),
  ]);

  const hasSendAccounts = accounts.some(canAccountSend);

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.10),transparent_28%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.10),transparent_26%),linear-gradient(180deg,#fbfaf8_0%,#f6f1ea_100%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(244,114,182,0.08),transparent_28%),radial-gradient(circle_at_top_right,rgba(56,189,248,0.08),transparent_26%),linear-gradient(180deg,#111114_0%,#0b0b0d_100%)]">
      <Sidebar accounts={accounts} unreadCount={unreadCount} hasSendAccounts={hasSendAccounts} />
      <main className="flex flex-1 overflow-hidden p-4 pl-0">
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-[2rem] border border-border/70 bg-background/82 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:shadow-none">
          {children}
        </div>
      </main>
    </div>
  );
}

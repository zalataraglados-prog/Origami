import { Sidebar } from "@/components/sidebar";
import { getAccounts } from "@/actions/account";
import { getUnreadCount } from "@/actions/email";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const accounts = await getAccounts();
  const unreadCount = await getUnreadCount();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar accounts={accounts} unreadCount={unreadCount} />
      <main className="flex flex-1 overflow-hidden">{children}</main>
    </div>
  );
}

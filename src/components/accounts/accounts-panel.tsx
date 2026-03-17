"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateAllAccountsWriteBackSettings } from "@/app/actions/account";
import { AccountCard } from "@/components/accounts/account-card";
import type { AccountSettingsView } from "@/components/accounts/types";
import { Card, CardContent } from "@/components/ui/card";

export function AccountsPanel({ accounts }: { accounts: AccountSettingsView[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const allReadEnabled = accounts.every((account) => account.syncReadBack === 1);
  const allStarEnabled = accounts.every((account) => account.syncStarBack === 1);

  function toggleAll(key: "syncReadBack" | "syncStarBack", checked: boolean) {
    startTransition(async () => {
      await updateAllAccountsWriteBackSettings(
        key === "syncReadBack"
          ? { syncReadBack: checked }
          : { syncStarBack: checked }
      );
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardContent className="space-y-4 p-4">
          <div>
            <h2 className="text-sm font-semibold">全局写回开关</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              这里的“全局”是批量设置：切换后会直接更新所有账号的对应开关。默认全部关闭；写回失败会静默降级，不影响本地 triage。
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-start gap-3 rounded-md border bg-background p-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={allReadEnabled}
                disabled={isPending}
                onChange={(event) => toggleAll("syncReadBack", event.target.checked)}
              />
              <div>
                <p className="text-sm font-medium">全局开启“已读写回”</p>
                <p className="text-xs text-muted-foreground">
                  当你在 Origami 标记已读时，尝试同步把远端邮件也标为已读。
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-md border bg-background p-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={allStarEnabled}
                disabled={isPending}
                onChange={(event) => toggleAll("syncStarBack", event.target.checked)}
              />
              <div>
                <p className="text-sm font-medium">全局开启“星标写回”</p>
                <p className="text-xs text-muted-foreground">
                  当你在 Origami 加星标/去星标时，尝试同步远端的星标状态。
                </p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {accounts.map((account) => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
}

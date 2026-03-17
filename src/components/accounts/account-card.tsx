"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import {
  removeAccount,
  updateAccountInitialFetchLimit,
  updateAccountWriteBackSettings,
} from "@/app/actions/account";
import type { AccountSettingsView } from "@/components/accounts/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProviderMeta } from "@/config/providers";
import { formatRelativeTime } from "@/lib/format";
import { SyncAccountButton } from "@/components/sync/sync-button";

export function AccountCard({ account }: { account: AccountSettingsView }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [fetchLimit, setFetchLimit] = useState(String(account.initialFetchLimit ?? 200));
  const provider = getProviderMeta(account.provider);

  function handleRemove() {
    if (!confirm(`确定要删除 ${account.email} 吗？关联的邮件数据也会被删除。`)) return;
    startTransition(async () => {
      await removeAccount(account.id);
      router.refresh();
    });
  }

  function handleFetchLimitChange(value: string) {
    setFetchLimit(value);
    startTransition(async () => {
      await updateAccountInitialFetchLimit(account.id, Number(value));
      router.refresh();
    });
  }

  function handleWriteBackToggle(key: "syncReadBack" | "syncStarBack", checked: boolean) {
    startTransition(async () => {
      await updateAccountWriteBackSettings(
        account.id,
        key === "syncReadBack"
          ? { syncReadBack: checked }
          : { syncStarBack: checked }
      );
      router.refresh();
    });
  }

  const shouldShowReadNotice = account.syncReadBack === 1 && account.readBackNotice;
  const shouldShowStarNotice = account.syncStarBack === 1 && account.starBackNotice;

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate font-medium">{account.displayName ?? account.email}</span>
              <Badge variant="secondary" className={provider.badgeClass}>
                {provider.label}
              </Badge>
            </div>
            <p className="truncate text-sm text-muted-foreground">{account.email}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {account.lastSyncedAt
                ? `上次同步: ${formatRelativeTime(account.lastSyncedAt)}`
                : "尚未同步"}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <SyncAccountButton accountId={account.id} />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              disabled={isPending}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">首次同步抓取范围</p>
            <p className="text-xs text-muted-foreground">
              仅影响首次同步的最近邮件数量，默认只拉标题与摘要，正文按需点击时再获取。
            </p>
          </div>
          <select
            className="rounded-md border bg-background px-3 py-2 text-sm"
            value={fetchLimit}
            onChange={(event) => handleFetchLimitChange(event.target.value)}
            disabled={isPending}
          >
            <option value="50">50 封</option>
            <option value="200">200 封</option>
            <option value="1000">1000 封</option>
          </select>
        </div>

        <div className="space-y-3 rounded-md border p-3">
          <div>
            <p className="text-sm font-medium">远端写回</p>
            <p className="text-xs text-muted-foreground">
              默认关闭。开启后，本地操作完成后会尝试把“已读 / 星标”同步写回原邮箱；失败时会静默降级，不阻塞本地操作。
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="flex items-start gap-3 rounded-md border bg-background p-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={account.syncReadBack === 1}
                disabled={isPending}
                onChange={(event) => handleWriteBackToggle("syncReadBack", event.target.checked)}
              />
              <div>
                <p className="text-sm font-medium">已读写回</p>
                <p className="text-xs text-muted-foreground">
                  在 Origami 标记已读时，尝试把远端邮件也标为已读。
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  当前状态：{account.syncReadBack === 1 ? "已开启" : "已关闭"}
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 rounded-md border bg-background p-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4"
                checked={account.syncStarBack === 1}
                disabled={isPending}
                onChange={(event) => handleWriteBackToggle("syncStarBack", event.target.checked)}
              />
              <div>
                <p className="text-sm font-medium">星标写回</p>
                <p className="text-xs text-muted-foreground">
                  在 Origami 加星标 / 去星标时，尝试同步远端星标状态。
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  当前状态：{account.syncStarBack === 1 ? "已开启" : "已关闭"}
                </p>
              </div>
            </label>
          </div>

          {(shouldShowReadNotice || shouldShowStarNotice) && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <p className="font-medium">当前账号已开启写回，但授权仍需补齐</p>
              {shouldShowReadNotice && <p className="mt-1">- 已读写回：{account.readBackNotice}</p>}
              {shouldShowStarNotice && <p className="mt-1">- 星标写回：{account.starBackNotice}</p>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

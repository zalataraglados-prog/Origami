"use client";

import { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { removeAccount } from "@/actions/account";
import { SyncAccountButton } from "./sync-button";
import { formatRelativeTime } from "@/lib/format";
import type { Account } from "@/lib/db/schema";

const PROVIDER_STYLES: Record<string, { label: string; color: string }> = {
  gmail: { label: "Gmail", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  outlook: { label: "Outlook", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  qq: { label: "QQ 邮箱", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

export function AccountCard({ account }: { account: Account }) {
  const [isPending, startTransition] = useTransition();
  const style = PROVIDER_STYLES[account.provider] ?? { label: account.provider, color: "bg-gray-100" };

  function handleRemove() {
    if (!confirm(`确定要删除 ${account.email} 吗？关联的邮件数据也会被删除。`)) return;
    startTransition(async () => {
      await removeAccount(account.id);
    });
  }

  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{account.displayName ?? account.email}</span>
            <Badge variant="secondary" className={style.color}>
              {style.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground truncate">{account.email}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {account.lastSyncedAt
              ? `上次同步: ${formatRelativeTime(account.lastSyncedAt)}`
              : "尚未同步"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
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
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildComposeHref } from "@/lib/inbox-route";

export function ComposeLink({ hasAccounts }: { hasAccounts: boolean }) {
  const searchParams = useSearchParams();
  const accountId = searchParams.get("account") ?? undefined;

  if (!hasAccounts) return null;

  return (
    <Button className="w-full justify-start" asChild>
      <Link href={buildComposeHref(accountId)}>
        <PenSquare className="mr-2 h-4 w-4" />
        写邮件
      </Link>
    </Button>
  );
}

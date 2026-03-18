"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/i18n-provider";
import { resolveComposeLinkHref } from "./compose-link-state";

export function ComposeLink({ hasAccounts }: { hasAccounts: boolean }) {
  const searchParams = useSearchParams();
  const { messages } = useI18n();
  const accountId = searchParams.get("account") ?? undefined;
  const href = resolveComposeLinkHref(hasAccounts, accountId);

  if (!href) return null;

  return (
    <Button className="w-full justify-start rounded-2xl shadow-sm" asChild>
      <Link href={href}>
        <PenSquare className="mr-2 h-4 w-4" />
        {messages.composeLink.writeMail}
      </Link>
    </Button>
  );
}

import { redirect } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSetupStatus } from "@/lib/setup";
import { readSessionFromCookies } from "@/lib/session";
import { getRequestLocale } from "@/i18n/locale.server";
import { getMessages } from "@/i18n/messages";

function StatusItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {ok ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
      <span>{label}</span>
    </li>
  );
}

export default async function SetupPage() {
  const session = await readSessionFromCookies();
  if (!session) redirect("/login");

  const [status, locale] = await Promise.all([getSetupStatus(), getRequestLocale()]);
  if (status.isSetupComplete) {
    redirect("/");
  }

  const messages = getMessages(locale);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl rounded-[2rem] border-border/80 bg-background/80 shadow-lg">
        <CardHeader>
          <CardTitle>{messages.setup.title}</CardTitle>
          <CardDescription>
            {messages.setup.description(session.githubLogin)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-[1.5rem] border p-4">
            <h2 className="mb-3 text-sm font-medium">{messages.setup.checks}</h2>
            <ul className="space-y-2">
              <StatusItem ok={status.checks.githubOAuthConfigured} label={messages.setup.githubOAuth} />
              <StatusItem ok={status.checks.databaseConfigured} label={messages.setup.database} />
              <StatusItem ok={status.checks.encryptionConfigured} label={messages.setup.encryption} />
              <StatusItem ok={status.checks.r2Configured} label={messages.setup.r2} />
            </ul>
          </div>

          <div className="rounded-[1.5rem] border p-4 text-sm text-muted-foreground">
            {messages.setup.nextStep}
          </div>

          <form action="/api/auth/setup/complete" method="post">
            <Button type="submit">{messages.setup.finish}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

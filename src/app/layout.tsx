import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/providers/toast-provider";
import { I18nProvider } from "@/components/providers/i18n-provider";
import { getRequestLocale } from "@/i18n/locale.server";
import { getMessages } from "@/i18n/messages";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getRequestLocale();
  const messages = getMessages(locale);

  return {
    title: "Origami",
    description: messages.metadata.description,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale}>
      <body className="antialiased">
        <I18nProvider locale={locale}>
          <TooltipProvider delayDuration={0}>
            <ToastProvider>{children}</ToastProvider>
          </TooltipProvider>
        </I18nProvider>
      </body>
    </html>
  );
}

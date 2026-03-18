import type { AppLocale } from "@/i18n/locale";

export const PROVIDER_META: Record<
  string,
  {
    labels: Record<AppLocale, string>;
    dotClass: string;
    badgeClass: string;
  }
> = {
  gmail: {
    labels: {
      "zh-CN": "Gmail",
      "zh-TW": "Gmail",
      en: "Gmail",
      ja: "Gmail",
    },
    dotClass: "bg-red-500",
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  outlook: {
    labels: {
      "zh-CN": "Outlook",
      "zh-TW": "Outlook",
      en: "Outlook",
      ja: "Outlook",
    },
    dotClass: "bg-blue-500",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  qq: {
    labels: {
      "zh-CN": "QQ 邮箱",
      "zh-TW": "QQ 郵箱",
      en: "QQ Mail",
      ja: "QQ メール",
    },
    dotClass: "bg-green-500",
    badgeClass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  },
  imap_smtp: {
    labels: {
      "zh-CN": "IMAP / SMTP",
      "zh-TW": "IMAP / SMTP",
      en: "IMAP / SMTP",
      ja: "IMAP / SMTP",
    },
    dotClass: "bg-emerald-500",
    badgeClass: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
};

export function getProviderMeta(provider: string, locale: AppLocale = "zh-CN") {
  const meta = PROVIDER_META[provider];
  if (!meta) {
    return {
      label: provider,
      dotClass: "bg-gray-500",
      badgeClass: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
    };
  }

  return {
    label: meta.labels[locale] ?? meta.labels["zh-CN"],
    dotClass: meta.dotClass,
    badgeClass: meta.badgeClass,
  };
}

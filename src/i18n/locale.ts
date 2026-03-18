export const APP_LOCALES = ["zh-CN", "zh-TW", "en", "ja"] as const;
export type AppLocale = (typeof APP_LOCALES)[number];

export const DEFAULT_APP_LOCALE: AppLocale = "zh-CN";
export const APP_LOCALE_COOKIE = "origami_locale";

const localeAliases: Record<string, AppLocale> = {
  zh: "zh-CN",
  "zh-cn": "zh-CN",
  "zh-hans": "zh-CN",
  "zh-sg": "zh-CN",
  "zh-tw": "zh-TW",
  "zh-hk": "zh-TW",
  "zh-mo": "zh-TW",
  "zh-hant": "zh-TW",
  en: "en",
  "en-us": "en",
  "en-gb": "en",
  ja: "ja",
  "ja-jp": "ja",
};

export function normalizeAppLocale(input?: string | null): AppLocale {
  if (!input) return DEFAULT_APP_LOCALE;
  const normalized = input.trim().toLowerCase();
  return localeAliases[normalized] ?? DEFAULT_APP_LOCALE;
}

export function getLocaleDisplayName(locale: AppLocale) {
  switch (locale) {
    case "zh-CN":
      return "简体中文";
    case "zh-TW":
      return "繁體中文";
    case "en":
      return "English";
    case "ja":
      return "日本語";
  }
}

export function getDocsLocaleHref(locale: AppLocale) {
  switch (locale) {
    case "zh-CN":
      return "https://l7cp.de/Origami/";
    case "zh-TW":
      return "https://l7cp.de/Origami/zh-tw/";
    case "en":
      return "https://l7cp.de/Origami/en/";
    case "ja":
      return "https://l7cp.de/Origami/ja/";
  }
}

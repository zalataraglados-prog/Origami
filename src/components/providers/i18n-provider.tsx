"use client";

import { createContext, useContext, useMemo } from "react";
import { getMessages, type AppMessages } from "@/i18n/messages";
import type { AppLocale } from "@/i18n/locale";

interface I18nContextValue {
  locale: AppLocale;
  messages: AppMessages;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: AppLocale;
  children: React.ReactNode;
}) {
  const value = useMemo(() => ({ locale, messages: getMessages(locale) }), [locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}

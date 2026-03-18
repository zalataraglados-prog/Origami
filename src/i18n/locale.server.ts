import { cookies } from "next/headers";
import { APP_LOCALE_COOKIE, normalizeAppLocale, type AppLocale } from "./locale";

export async function getRequestLocale(): Promise<AppLocale> {
  const cookieStore = await cookies();
  return normalizeAppLocale(cookieStore.get(APP_LOCALE_COOKIE)?.value);
}

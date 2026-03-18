import type { NextRequest } from "next/server";

export type CookieOptions = {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "lax" | "strict" | "none";
  path?: string;
  maxAge?: number;
  expires?: Date;
  domain?: string;
};

function isHttpsPreview(request: Request | NextRequest): boolean {
  const headers = request.headers;

  // Prefer forwarded proto in proxy environments (Codespaces/Vercel/etc.)
  const proto = headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  return process.env.NODE_ENV !== "production" && proto === "https";
}

/**
 * In preview/proxy environments (e.g. Codespaces), cookies can behave like cross-site.
 * SameSite=Lax may be dropped in OAuth/server-action flows.
 *
 * This helper centralizes the compat tweak: on HTTPS preview + non-production,
 * force SameSite=None and Secure.
 */
export function withHttpsPreviewCookieCompat<T extends CookieOptions>(
  request: Request | NextRequest,
  opts: T
): T {
  if (!isHttpsPreview(request)) return opts;
  return { ...opts, secure: true, sameSite: "none" };
}

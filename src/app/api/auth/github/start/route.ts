import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getGitHubAuthUrl } from "@/lib/github-auth";
import {
  createOAuthStateCookieValue,
  getOAuthStateCookieName,
  getOAuthStateCookieOptions,
} from "@/lib/session";

function withHttpsPreviewCookieCompat(request: Request, opts: ReturnType<typeof getOAuthStateCookieOptions>) {
  // Preview/proxy environments (e.g. Codespaces) can behave like cross-site contexts.
  // SameSite=Lax cookies may be dropped on POST/XHR requests, which can break OAuth state validation.
  const proto = request.headers.get("x-forwarded-proto") ?? new URL(request.url).protocol.replace(":", "");
  const isHttps = proto === "https";
  if (process.env.NODE_ENV !== "production" && isHttps) {
    return { ...opts, secure: true, sameSite: "none" as const };
  }
  return opts;
}

export async function GET(request: Request) {
  const state = randomUUID();
  const response = NextResponse.redirect(getGitHubAuthUrl(state));
  response.cookies.set(
    getOAuthStateCookieName(),
    await createOAuthStateCookieValue(state),
    withHttpsPreviewCookieCompat(request, getOAuthStateCookieOptions())
  );
  return response;
}

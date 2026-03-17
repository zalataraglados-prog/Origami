import { describe, expect, it, vi } from "vitest";

describe("oauth app resolver", () => {
  it("resolves default Gmail and Outlook apps from env", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.GMAIL_CLIENT_ID = "gmail-client";
    process.env.GMAIL_CLIENT_SECRET = "gmail-secret";
    process.env.OUTLOOK_CLIENT_ID = "outlook-client";
    process.env.OUTLOOK_CLIENT_SECRET = "outlook-secret";

    const { DEFAULT_OAUTH_APP_ID, resolveGmailOAuthApp, resolveOutlookOAuthApp } =
      await import("./oauth-apps");

    expect(resolveGmailOAuthApp()).toEqual({
      appId: DEFAULT_OAUTH_APP_ID,
      source: "env",
      clientId: "gmail-client",
      clientSecret: "gmail-secret",
      redirectUrl: "http://localhost:3000/api/oauth/gmail",
      sendScopes: expect.arrayContaining([
        "https://www.googleapis.com/auth/gmail.modify",
        "https://www.googleapis.com/auth/gmail.send",
      ]),
    });

    expect(resolveOutlookOAuthApp()).toEqual({
      appId: DEFAULT_OAUTH_APP_ID,
      source: "env",
      tenant: "common",
      tokenUrl: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      clientId: "outlook-client",
      clientSecret: "outlook-secret",
      redirectUrl: "http://localhost:3000/api/oauth/outlook",
      requiredSendScope: "mail.send",
    });
  });

  it("rejects non-default app ids until db-backed app config is added", async () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
    process.env.GMAIL_CLIENT_ID = "gmail-client";
    process.env.GMAIL_CLIENT_SECRET = "gmail-secret";

    vi.resetModules();
    const { resolveGmailOAuthApp } = await import("./oauth-apps");

    expect(() => resolveGmailOAuthApp("team-app")).toThrow(/not configured yet/i);
  });
});

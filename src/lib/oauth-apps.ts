import { requireEnv } from "@/config/env";

export const DEFAULT_OAUTH_APP_ID = "default";

export interface ResolvedGmailOAuthApp {
  appId: string;
  source: "env";
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  sendScopes: string[];
}

export interface ResolvedOutlookOAuthApp {
  appId: string;
  source: "env";
  tenant: string;
  tokenUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUrl: string;
  requiredSendScope: string;
}

export const GMAIL_SEND_SCOPES = [
  "https://mail.google.com/",
  "https://www.googleapis.com/auth/gmail.modify",
  "https://www.googleapis.com/auth/gmail.compose",
  "https://www.googleapis.com/auth/gmail.send",
];

function normalizeAppId(appId?: string | null): string {
  const normalized = appId?.trim();
  return normalized || DEFAULT_OAUTH_APP_ID;
}

function assertEnvBackedDefaultApp(appId?: string | null) {
  const normalized = normalizeAppId(appId);
  if (normalized !== DEFAULT_OAUTH_APP_ID) {
    throw new Error(
      `OAuth app \"${normalized}\" is not configured yet. This build currently supports env-backed default apps only.`
    );
  }
  return normalized;
}

export function resolveGmailOAuthApp(appId?: string | null): ResolvedGmailOAuthApp {
  const resolvedAppId = assertEnvBackedDefaultApp(appId);
  const appUrl = requireEnv("NEXT_PUBLIC_APP_URL");

  return {
    appId: resolvedAppId,
    source: "env",
    clientId: requireEnv("GMAIL_CLIENT_ID"),
    clientSecret: requireEnv("GMAIL_CLIENT_SECRET"),
    redirectUrl: `${appUrl}/api/oauth/gmail`,
    sendScopes: GMAIL_SEND_SCOPES,
  };
}

export function resolveOutlookOAuthApp(appId?: string | null): ResolvedOutlookOAuthApp {
  const resolvedAppId = assertEnvBackedDefaultApp(appId);
  const tenant = "common";
  const appUrl = requireEnv("NEXT_PUBLIC_APP_URL");

  return {
    appId: resolvedAppId,
    source: "env",
    tenant,
    tokenUrl: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    clientId: requireEnv("OUTLOOK_CLIENT_ID"),
    clientSecret: requireEnv("OUTLOOK_CLIENT_SECRET"),
    redirectUrl: `${appUrl}/api/oauth/outlook`,
    requiredSendScope: "mail.send",
  };
}

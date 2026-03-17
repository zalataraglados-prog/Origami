import {
  GMAIL_SEND_SCOPES,
  resolveGmailOAuthApp,
  resolveOutlookOAuthApp,
} from "@/lib/oauth-apps";

export { GMAIL_SEND_SCOPES };

export function getGmailProviderConfig(appId?: string | null) {
  return resolveGmailOAuthApp(appId);
}

export function getOutlookProviderConfig(appId?: string | null) {
  return resolveOutlookOAuthApp(appId);
}

export function getQqProviderConfig() {
  return {
    imap: {
      host: "imap.qq.com",
      port: 993,
      secure: true,
    },
    smtp: {
      host: "smtp.qq.com",
      port: 465,
      secure: true,
    },
  };
}

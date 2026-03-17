import { describe, expect, it } from "vitest";
import { canAccountSendFromCredentials } from "@/lib/account-providers";

describe("account provider send capability", () => {
  it("detects Gmail send scope from stored OAuth scopes", () => {
    expect(
      canAccountSendFromCredentials("gmail", {
        scopes: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/gmail.send",
        ],
      })
    ).toBe(true);

    expect(
      canAccountSendFromCredentials("gmail", {
        scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
      })
    ).toBe(false);
  });

  it("detects Outlook send scope from stored OAuth scopes", () => {
    expect(
      canAccountSendFromCredentials("outlook", {
        scopes: ["openid", "Mail.Send", "offline_access"],
      })
    ).toBe(true);

    expect(
      canAccountSendFromCredentials("outlook", {
        scopes: ["Mail.Read", "offline_access"],
      })
    ).toBe(false);
  });

  it("treats mailbox-style providers as send-capable", () => {
    expect(canAccountSendFromCredentials("qq", {})).toBe(true);
    expect(canAccountSendFromCredentials("imap_smtp", {})).toBe(true);
  });
});

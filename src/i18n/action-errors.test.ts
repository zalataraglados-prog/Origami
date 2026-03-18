import { describe, expect, it } from "vitest";
import { getLocalizedActionErrorFallback, getLocalizedActionErrorMessage } from "./action-errors";

describe("localized action errors", () => {
  it("localizes known action error codes", () => {
    expect(getLocalizedActionErrorMessage("UNAUTHORIZED", "en")).toBe(
      "Your sign-in session has expired. Please sign in again and retry."
    );
    expect(getLocalizedActionErrorMessage("ACCOUNT_EMAIL_REQUIRED", "ja")).toBe(
      "メールアドレスは必須です。"
    );
  });

  it("formats dynamic usage counts", () => {
    expect(getLocalizedActionErrorMessage("OAUTH_APP_IN_USE", "zh-CN", "2")).toBe(
      "仍有 2 个账号在使用这个 OAuth 应用，请先重新授权或移除这些账号。"
    );
    expect(getLocalizedActionErrorMessage("OAUTH_APP_IN_USE", "en", "5")).toBe(
      "5 account(s) are still using this OAuth app. Reauthorize or remove those accounts first."
    );
  });

  it("falls back for unknown codes", () => {
    expect(getLocalizedActionErrorMessage("UNKNOWN_CODE", "zh-TW")).toBe(
      getLocalizedActionErrorFallback("zh-TW")
    );
  });
});

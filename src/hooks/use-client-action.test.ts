import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

vi.mock("@/components/providers/i18n-provider", () => ({
  useI18n: () => ({
    locale: "en",
    messages: { common: { actionFailed: "Action failed" } },
  }),
}));

describe("getClientActionErrorMessage", () => {
  it("localizes serialized action errors", async () => {
    const { getClientActionErrorMessage } = await import("./use-client-action");
    const { ActionError, serializeActionError } = await import("@/lib/actions");

    const error = new Error(
      serializeActionError(new ActionError("ACCOUNT_NOT_FOUND", "Account not found"))
    );

    expect(getClientActionErrorMessage(error, undefined, "en")).toBe(
      "The account could not be found."
    );
  });

  it("returns raw messages for non-serialized errors", async () => {
    const { getClientActionErrorMessage } = await import("./use-client-action");
    expect(getClientActionErrorMessage(new Error("plain error"), undefined, "en")).toBe(
      "plain error"
    );
  });
});

import { describe, expect, it } from "vitest";
import { ActionError, parseSerializedActionError, serializeActionError } from "./actions";

describe("action error serialization", () => {
  it("round-trips action errors with code and details", () => {
    const serialized = serializeActionError(
      new ActionError("OAUTH_APP_IN_USE", "OAuth app is still in use", "3")
    );

    expect(parseSerializedActionError(serialized)).toEqual({
      code: "OAUTH_APP_IN_USE",
      message: "OAuth app is still in use",
      details: "3",
    });
  });

  it("returns null for non-serialized strings", () => {
    expect(parseSerializedActionError("plain error")).toBeNull();
  });
});

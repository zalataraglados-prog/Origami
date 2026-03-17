import { describe, expect, it } from "vitest";
import { getTokenCookieName } from "./auth";

describe("auth", () => {
  it("uses the Origami cookie name", () => {
    expect(getTokenCookieName()).toBe("origami_token");
  });
});

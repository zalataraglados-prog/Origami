import { describe, expect, it } from "vitest";
import { toPublicUrl } from "@/lib/request-origin";

describe("request-origin", () => {
  it("builds public URLs from forwarded headers and strips explicit :port", () => {
    const req = new Request("https://sturdy-fiesta-xyz-3000.app.github.dev:3000/api/auth/github/callback", {
      headers: {
        "x-forwarded-proto": "https",
        "x-forwarded-host": "sturdy-fiesta-xyz-3000.app.github.dev",
      },
    });

    expect(toPublicUrl(req, "/login?error=github_callback").toString()).toBe(
      "https://sturdy-fiesta-xyz-3000.app.github.dev/login?error=github_callback"
    );
  });

  it("falls back to request.url host but still strips explicit :port", () => {
    const req = new Request("https://sturdy-fiesta-xyz-3000.app.github.dev:3000/api/auth/github/callback");

    expect(toPublicUrl(req, "/").toString()).toBe("https://sturdy-fiesta-xyz-3000.app.github.dev/");
  });
});

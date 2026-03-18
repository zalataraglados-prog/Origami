import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

// Mock getGitHubAuthUrl to avoid env requirements
vi.mock("@/lib/github-auth", () => ({
  getGitHubAuthUrl: (state: string) => `https://github.com/login/oauth/authorize?state=${state}`,
}));

// Mock cookie helper values so we can assert cookie attributes without needing secrets
vi.mock("@/lib/session", () => ({
  createOAuthStateCookieValue: async (state: string) => `${state}.sig`,
  getOAuthStateCookieName: () => "origami_github_state",
  getOAuthStateCookieOptions: () => ({
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 600,
  }),
}));

describe("GET /api/auth/github/start", () => {
  it("sets SameSite=None + Secure for HTTPS preview in non-production", async () => {
    vi.stubEnv("NODE_ENV", "development");

    const req = new Request("https://example.test/api/auth/github/start", {
      headers: {
        "x-forwarded-proto": "https",
      },
    });

    const res = await GET(req);
    const setCookie = res.headers.get("set-cookie") ?? "";

    expect(res.status).toBeGreaterThanOrEqual(300);
    expect(res.status).toBeLessThan(400);
    expect(setCookie).toMatch(/origami_github_state=/);
    expect(setCookie.toLowerCase()).toContain("samesite=none");
    expect(setCookie.toLowerCase()).toContain("secure");

    vi.unstubAllEnvs();
  });
});

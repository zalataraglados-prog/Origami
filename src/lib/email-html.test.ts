import { describe, expect, it } from "vitest";
import { sanitizeEmailHtml } from "./email-html";

describe("sanitizeEmailHtml", () => {
  it("removes scripts and inline event handlers", () => {
    const html = sanitizeEmailHtml(
      '<div onclick="alert(1)"><script>alert(1)</script><a href="javascript:alert(1)">Click</a><img src="cid:image-1" onerror="alert(1)" /></div>'
    );

    expect(html).not.toContain("<script");
    expect(html).not.toContain("onclick=");
    expect(html).not.toContain("onerror=");
    expect(html).not.toContain("javascript:");
    expect(html).toContain(">Click</a>");
    expect(html).toContain('src="cid:image-1"');
  });

  it("preserves common email formatting markup", () => {
    const html = sanitizeEmailHtml(
      '<table><tr><td style="color:red"><strong>Hello</strong><br><img src="https://example.com/a.png" /></td></tr></table>'
    );

    expect(html).toContain("<table>");
    expect(html).toContain("style=\"color:red\"");
    expect(html).toContain("<strong>Hello</strong>");
    expect(html).toContain('src="https://example.com/a.png"');
  });
});

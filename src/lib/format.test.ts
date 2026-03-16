import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { formatFileSize, formatRelativeTime } from "./format";

describe("format", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-16T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("formats recent timestamps relatively", () => {
    const now = Math.floor(Date.now() / 1000);

    expect(formatRelativeTime(now - 30)).toBe("刚刚");
    expect(formatRelativeTime(now - 5 * 60)).toBe("5 分钟前");
    expect(formatRelativeTime(now - 2 * 3600)).toBe("2 小时前");
    expect(formatRelativeTime(now - 3 * 86400)).toBe("3 天前");
  });

  it("formats file sizes", () => {
    expect(formatFileSize(512)).toBe("512 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(3 * 1024 * 1024)).toBe("3.0 MB");
  });
});

import { describe, expect, it } from "vitest";
import { buildComposeUploadKey, buildObjectKey } from "./r2";

describe("r2", () => {
  it("builds predictable object keys with attachment ids", () => {
    expect(buildObjectKey("acc_1", "mail_2", "att_3", "invoice.pdf")).toBe(
      "acc_1/mail_2/att_3-invoice.pdf"
    );
  });

  it("sanitizes filenames before using them as object keys", () => {
    expect(buildObjectKey("acc/1", "mail\\2", "att_3", "../folder/invoice.pdf")).toBe(
      "acc-1/mail-2/att_3-folder-invoice.pdf"
    );
    expect(buildComposeUploadKey("upload/1", "..\\evil.txt")).toBe(
      "compose/upload-1/evil.txt"
    );
  });
});

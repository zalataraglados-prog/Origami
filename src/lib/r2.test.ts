import { describe, expect, it } from "vitest";
import { buildObjectKey } from "./r2";

describe("r2", () => {
  it("builds predictable object keys", () => {
    expect(buildObjectKey("acc_1", "mail_2", "invoice.pdf")).toBe(
      "acc_1/mail_2/invoice.pdf"
    );
  });
});

import { beforeEach, describe, expect, it, vi } from "vitest";

const expiredRows = [
  { id: "upload-1", r2ObjectKey: "compose/upload-1/a.txt" },
  { id: "upload-2", r2ObjectKey: "compose/upload-2/b.txt" },
];

const deleteWhereMock = vi.fn();
const selectWhereMock = vi.fn(async () => expiredRows);
const deleteAttachmentMock = vi.fn(async () => undefined);

const schemaMock = {
  composeUploads: {
    id: "compose_uploads.id",
    r2ObjectKey: "compose_uploads.r2_object_key",
    createdAt: "compose_uploads.created_at",
  },
};

vi.mock("@/lib/db/schema", () => schemaMock);
vi.mock("@/lib/r2", () => ({
  deleteAttachment: deleteAttachmentMock,
}));
vi.mock("@/lib/db", () => ({
  db: {
    select: () => ({
      from: () => ({
        where: selectWhereMock,
      }),
    }),
    delete: () => ({
      where: deleteWhereMock,
    }),
  },
}));

describe("compose upload cleanup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    selectWhereMock.mockResolvedValue(expiredRows);
    deleteWhereMock.mockResolvedValue(undefined);
    deleteAttachmentMock.mockResolvedValue(undefined);
  });

  it("detects expired uploads using the TTL window", async () => {
    const { COMPOSE_UPLOAD_TTL_SECONDS, isComposeUploadExpired } = await import("./compose-uploads");

    expect(isComposeUploadExpired(1_000, 1_000 + COMPOSE_UPLOAD_TTL_SECONDS)).toBe(true);
    expect(isComposeUploadExpired(1_000, 1_000 + COMPOSE_UPLOAD_TTL_SECONDS - 1)).toBe(false);
    expect(isComposeUploadExpired(null, 1_000)).toBe(true);
  });

  it("deletes expired objects and then removes their rows", async () => {
    const { cleanupExpiredComposeUploads } = await import("./compose-uploads");

    await expect(cleanupExpiredComposeUploads(2_000_000)).resolves.toBe(2);
    expect(deleteAttachmentMock).toHaveBeenCalledTimes(2);
    expect(deleteWhereMock).toHaveBeenCalledTimes(1);
  });
});

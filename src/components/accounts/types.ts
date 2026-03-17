import type { Account } from "@/lib/db/schema";

export type AccountSettingsView = Account & {
  canWriteBackRead: boolean;
  canWriteBackStar: boolean;
  readBackNotice: string | null;
  starBackNotice: string | null;
};

"use server";

import { count, eq } from "drizzle-orm";
import { ActionError, runLoggedAction } from "@/lib/actions";
import { encrypt } from "@/lib/crypto";
import { db } from "@/lib/db";
import { accounts, oauthApps } from "@/lib/db/schema";
import { listOAuthAppOptions } from "@/lib/oauth-apps";
import { getOAuthAppRecordById } from "@/lib/queries/oauth-apps";

export interface OAuthAppFormInput {
  id: string;
  provider: "gmail" | "outlook";
  label: string;
  clientId: string;
  clientSecret?: string;
  tenant?: string;
}

function normalizeAppId(value: string) {
  const id = value.trim().toLowerCase();
  if (!id) throw new ActionError("OAUTH_APP_ID_REQUIRED", "OAuth App ID is required");
  if (id === "default") {
    throw new ActionError(
      "OAUTH_APP_ID_RESERVED",
      '"default" is reserved for environment-backed default apps'
    );
  }
  if (!/^[a-z0-9][a-z0-9_-]{1,62}$/.test(id)) {
    throw new ActionError("OAUTH_APP_ID_INVALID", "OAuth App ID format is invalid");
  }
  return id;
}

function normalizeLabel(value: string) {
  const label = value.trim();
  if (!label) throw new ActionError("OAUTH_APP_LABEL_REQUIRED", "OAuth app label is required");
  return label;
}

function normalizeClientId(value: string) {
  const clientId = value.trim();
  if (!clientId) throw new ActionError("OAUTH_APP_CLIENT_ID_REQUIRED", "Client ID is required");
  return clientId;
}

function normalizeTenant(provider: "gmail" | "outlook", tenant?: string) {
  if (provider !== "outlook") return null;
  const normalized = tenant?.trim();
  return normalized || "common";
}

export async function getOAuthAppOptions(provider?: "gmail" | "outlook") {
  return listOAuthAppOptions(provider);
}

export async function addOAuthApp(input: OAuthAppFormInput) {
  return runLoggedAction("addOAuthApp", async () => {
    const id = normalizeAppId(input.id);
    const label = normalizeLabel(input.label);
    const clientId = normalizeClientId(input.clientId);
    const clientSecret = input.clientSecret?.trim();
    if (!clientSecret) {
      throw new ActionError("OAUTH_APP_CLIENT_SECRET_REQUIRED", "Client Secret is required");
    }

    await db.insert(oauthApps).values({
      id,
      provider: input.provider,
      label,
      clientId,
      clientSecret: encrypt(clientSecret),
      tenant: normalizeTenant(input.provider, input.tenant),
    });

    return id;
  });
}

export async function updateOAuthApp(input: OAuthAppFormInput) {
  return runLoggedAction("updateOAuthApp", async () => {
    const existing = await getOAuthAppRecordById(input.id, input.provider);
    if (!existing) throw new ActionError("OAUTH_APP_NOT_FOUND", "OAuth app not found");

    const patch: Partial<typeof oauthApps.$inferInsert> = {
      label: normalizeLabel(input.label),
      clientId: normalizeClientId(input.clientId),
      tenant: normalizeTenant(input.provider, input.tenant),
    };

    const clientSecret = input.clientSecret?.trim();
    if (clientSecret) {
      patch.clientSecret = encrypt(clientSecret);
    }

    await db.update(oauthApps).set(patch).where(eq(oauthApps.id, existing.id));
    return existing.id;
  });
}

export async function removeOAuthApp(id: string) {
  return runLoggedAction("removeOAuthApp", async () => {
    const normalizedId = normalizeAppId(id);
    const usageRows = await db
      .select({ count: count() })
      .from(accounts)
      .where(eq(accounts.oauthAppId, normalizedId));

    const usageCount = usageRows[0]?.count ?? 0;
    if (usageCount > 0) {
      throw new ActionError("OAUTH_APP_IN_USE", "OAuth app is still in use", String(usageCount));
    }

    await db.delete(oauthApps).where(eq(oauthApps.id, normalizedId));
  });
}

import { supabaseAdmin } from "@/lib/db/client";

export type ProviderSetting = {
  id: string;
  provider: string;
  api_key_encrypted: string | null;
  is_active: boolean;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

// Simple obfuscation — in production use proper encryption/KMS
function encodeKey(key: string): string {
  return Buffer.from(key).toString("base64");
}

function decodeKey(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf-8");
}

export async function getProviderSetting(
  provider: string
): Promise<ProviderSetting | null> {
  const { data, error } = await supabaseAdmin
    .from("provider_settings")
    .select("*")
    .eq("provider", provider)
    .maybeSingle();

  if (error) throw error;
  return data as ProviderSetting | null;
}

export async function getProviderApiKey(provider: string): Promise<string | null> {
  // Env var takes precedence
  if (provider === "apollo" && process.env.APOLLO_API_KEY) {
    return process.env.APOLLO_API_KEY;
  }

  const setting = await getProviderSetting(provider);
  if (!setting?.is_active || !setting.api_key_encrypted) return null;
  return decodeKey(setting.api_key_encrypted);
}

export async function upsertProviderSetting(
  provider: string,
  apiKey: string,
  config?: Record<string, unknown>
): Promise<ProviderSetting> {
  const { data, error } = await supabaseAdmin
    .from("provider_settings")
    .upsert(
      {
        provider,
        api_key_encrypted: encodeKey(apiKey),
        is_active: true,
        config: config || {},
        updated_at: new Date().toISOString(),
      },
      { onConflict: "provider" }
    )
    .select()
    .single();

  if (error) throw error;
  return data as ProviderSetting;
}

export async function getAllProviderSettings(): Promise<
  (Omit<ProviderSetting, "api_key_encrypted"> & { has_key: boolean })[]
> {
  const { data, error } = await supabaseAdmin
    .from("provider_settings")
    .select("id, provider, is_active, config, created_at, updated_at, api_key_encrypted");

  if (error) throw error;

  const envApollo = !!process.env.APOLLO_API_KEY;

  return (data || []).map((row) => ({
    id: row.id,
    provider: row.provider,
    is_active: row.is_active,
    config: row.config,
    created_at: row.created_at,
    updated_at: row.updated_at,
    has_key: !!row.api_key_encrypted || (row.provider === "apollo" && envApollo),
  }));
}

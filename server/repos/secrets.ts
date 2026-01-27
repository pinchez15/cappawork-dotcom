import { supabaseAdmin } from "@/lib/db/client";
import { encryptSecret, decryptSecret } from "@/lib/services/secrets";

export interface Secret {
  id: string;
  project_id: string;
  name: string;
  value_encrypted: string;
  type: "api_key" | "password" | "token" | "url" | "other";
  created_at: string;
  updated_at: string;
}

export async function createSecret(
  projectId: string,
  data: {
    name: string;
    value: string;
    type?: Secret["type"];
  }
) {
  const encrypted = encryptSecret(data.value);

  const { data: secret, error } = await supabaseAdmin
    .from("project_secrets")
    .insert({
      project_id: projectId,
      name: data.name,
      value_encrypted: encrypted,
      type: data.type || "api_key",
    })
    .select()
    .single();

  if (error) throw error;
  return secret;
}

export async function getSecretsForProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_secrets")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getDecryptedSecret(secretId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_secrets")
    .select("*")
    .eq("id", secretId)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    value: decryptSecret(data.value_encrypted),
  };
}

export async function updateSecret(
  secretId: string,
  updates: Partial<{
    name: string;
    value: string;
    type: Secret["type"];
  }>
) {
  const updateData: any = { ...updates };
  if (updates.value) {
    updateData.value_encrypted = encryptSecret(updates.value);
    delete updateData.value;
  }

  const { data, error } = await supabaseAdmin
    .from("project_secrets")
    .update({
      ...updateData,
      updated_at: new Date().toISOString(),
    })
    .eq("id", secretId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSecret(secretId: string) {
  const { error } = await supabaseAdmin
    .from("project_secrets")
    .delete()
    .eq("id", secretId);

  if (error) throw error;
}


import { supabaseAdmin } from "@/lib/db/client";

export async function upsertRole(data: {
  clerkRoleId?: string;
  name: string;
  key: string;
  description?: string | null;
  permissions?: any;
}) {
  const { data: role, error } = await supabaseAdmin
    .from("roles")
    .upsert(
      {
        clerk_role_id: data.clerkRoleId || null,
        name: data.name,
        key: data.key,
        description: data.description || null,
        permissions: data.permissions || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "clerk_role_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return role;
}

export async function deleteRole(clerkRoleId: string) {
  const { error } = await supabaseAdmin
    .from("roles")
    .delete()
    .eq("clerk_role_id", clerkRoleId);

  if (error) throw error;
}


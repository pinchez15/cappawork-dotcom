import { supabaseAdmin } from "@/lib/db/client";

export async function upsertProfile(clerkUserData: {
  id: string;
  email_addresses: Array<{ email_address: string }>;
  first_name?: string | null;
  last_name?: string | null;
  public_metadata?: { role?: string; isAdmin?: boolean } | null;
  private_metadata?: { role?: string; isAdmin?: boolean } | null;
}) {
  const email = clerkUserData.email_addresses[0]?.email_address || "";
  const name = [clerkUserData.first_name, clerkUserData.last_name]
    .filter(Boolean)
    .join(" ");

  // Check for admin status in metadata
  const publicMeta = clerkUserData.public_metadata;
  const privateMeta = clerkUserData.private_metadata;
  const isAdmin =
    publicMeta?.role === "admin" ||
    publicMeta?.isAdmin === true ||
    privateMeta?.role === "admin" ||
    privateMeta?.isAdmin === true;

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .upsert(
      {
        clerk_user_id: clerkUserData.id,
        email,
        name: name || null,
        is_admin: isAdmin,
      },
      {
        onConflict: "clerk_user_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getProfileByClerkId(clerkUserId: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function setAdminStatus(clerkUserId: string, isAdmin: boolean) {
  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ is_admin: isAdmin })
    .eq("clerk_user_id", clerkUserId);

  if (error) throw error;
}


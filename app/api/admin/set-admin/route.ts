import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/db/client";
import { getProfileByClerkId } from "@/server/repos/profiles";

export const runtime = "nodejs";

/**
 * POST /api/admin/set-admin
 * Sets the current user as admin
 * 
 * Security: This endpoint requires a secret token from environment variable
 * Only works in development OR with the correct secret token
 */
export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Security: Require secret token in production
  const { secret } = await req.json().catch(() => ({}));
  const expectedSecret = process.env.ADMIN_SETUP_SECRET;

  // In production, require the secret
  if (process.env.NODE_ENV === "production" && secret !== expectedSecret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Get or create profile
  let profile = await getProfileByClerkId(userId);

  if (!profile) {
    // Create a basic profile if it doesn't exist
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .insert({
        clerk_user_id: userId,
        email: "admin@setup.local", // Will be updated on next Clerk sync
        is_admin: true,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    profile = data;
  } else {
    // Update existing profile to be admin
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ is_admin: true, updated_at: new Date().toISOString() })
      .eq("clerk_user_id", userId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ 
    success: true, 
    message: "Admin status granted",
    profile_id: profile?.id 
  });
}


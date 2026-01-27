"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/db/client";

export async function requireUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }
  return { userId };
}

export async function requireAdmin() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  // Check if user is admin
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("is_admin")
    .eq("clerk_user_id", userId)
    .single();

  if (!profile?.is_admin) {
    throw new Error("FORBIDDEN");
  }

  return { userId };
}

export async function requireProjectAccess(projectId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  // Get user profile
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id, is_admin")
    .eq("clerk_user_id", userId)
    .single();

  if (!profile) {
    throw new Error("UNAUTHORIZED");
  }

  // Admins can access all projects
  if (profile.is_admin) {
    return { userId, profileId: profile.id };
  }

  // Check if user is a member of this project
  const { data: membership } = await supabaseAdmin
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("profile_id", profile.id)
    .single();

  if (!membership) {
    throw new Error("FORBIDDEN");
  }

  return { userId, profileId: profile.id };
}

export async function getCurrentProfile() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .single();

  return profile;
}


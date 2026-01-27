"use server";

import { auth } from "@clerk/nextjs/server";
import { getProfileByClerkId } from "@/server/repos/profiles";

export type AuthenticatedUser = {
  userId: string;
  orgId: string | null;
  isAdmin: boolean;
  profileId: string | null;
};

/**
 * Requires an authenticated user. Throws if not signed in.
 */
export async function requireUser(): Promise<AuthenticatedUser> {
  const { userId, orgId } = await auth();
  
  if (!userId) {
    throw new Error("UNAUTHORIZED");
  }

  // Get profile from database to check admin status
  const profile = await getProfileByClerkId(userId);
  
  return {
    userId,
    orgId: orgId ?? null,
    isAdmin: profile?.is_admin ?? false,
    profileId: profile?.id ?? null,
  };
}

/**
 * Requires an authenticated admin user. Throws if not admin.
 */
export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireUser();
  
  if (!user.isAdmin) {
    throw new Error("FORBIDDEN: Admin access required");
  }
  
  return user;
}

/**
 * Gets current user info without throwing. Returns null if not authenticated.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const { userId, orgId } = await auth();
    
    if (!userId) {
      return null;
    }

    const profile = await getProfileByClerkId(userId);
    
    return {
      userId,
      orgId: orgId ?? null,
      isAdmin: profile?.is_admin ?? false,
      profileId: profile?.id ?? null,
    };
  } catch {
    return null;
  }
}

/**
 * Checks if a user has access to a specific project
 */
export async function requireProjectAccess(projectId: string): Promise<AuthenticatedUser> {
  const user = await requireUser();
  
  // Admins have access to all projects
  if (user.isAdmin) {
    return user;
  }
  
  // Check if user is a member of this project
  if (!user.profileId) {
    throw new Error("FORBIDDEN: No profile found");
  }
  
  const { supabaseAdmin } = await import("@/lib/db/client");
  
  const { data: membership } = await supabaseAdmin
    .from("project_members")
    .select("id")
    .eq("project_id", projectId)
    .eq("profile_id", user.profileId)
    .single();
  
  if (!membership) {
    throw new Error("FORBIDDEN: No access to this project");
  }
  
  return user;
}


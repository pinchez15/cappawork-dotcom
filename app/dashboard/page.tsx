import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProfileByClerkId } from "@/server/repos/profiles";

export const runtime = "nodejs";

/**
 * Dashboard redirect page
 * Routes users to the appropriate dashboard based on their role:
 * - Admins → /admin
 * - Clients → /projects
 * - Unauthenticated → sign-in
 */
export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get profile to check admin status
  const profile = await getProfileByClerkId(userId);

  if (profile?.is_admin) {
    redirect("/admin");
  }

  // Default: redirect to client portal
  redirect("/projects");
}


import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { getProjectById } from "@/server/repos/projects";

export const runtime = "nodejs";

export default async function AdminProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user is admin
  const profile = await getProfileByClerkId(userId);

  if (!profile?.is_admin) {
    redirect("/projects");
  }

  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) {
    redirect("/admin");
  }

  // Just pass through children - the parent admin layout handles the sidebar
  return <>{children}</>;
}

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProfileByClerkId } from "@/server/repos/profiles";

export const runtime = "nodejs";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Redirect admins to admin dashboard
  const profile = await getProfileByClerkId(userId);
  if (profile?.is_admin) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {children}
    </div>
  );
}

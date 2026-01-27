import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { getProfileByClerkId } from "@/server/repos/profiles";

export const runtime = "nodejs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Check if user is admin
  const profile = await getProfileByClerkId(userId);
  
  if (!profile?.is_admin) {
    // Non-admins get redirected to the client portal
    redirect("/projects");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-semibold text-stone-900">
                CappaWork Admin
              </Link>
              <div className="flex gap-4">
                <Link href="/admin">
                  <Button variant="ghost">Projects</Button>
                </Link>
                <Link href="/admin/blog">
                  <Button variant="ghost">Blog</Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  View Site
                </Button>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

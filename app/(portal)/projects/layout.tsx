import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth/guards";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export const dynamic = "force-dynamic";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireUser();
  } catch {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/projects" className="text-xl font-semibold text-stone-900">
              CappaWork Portal
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  View Site
                </Button>
              </Link>
              <UserButton />
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}


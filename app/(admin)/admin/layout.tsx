import Link from "next/link";
import { Button } from "@/components/ui/button";

// TODO: Re-add Clerk auth protection after reinstall
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
              {/* TODO: Re-add UserButton after Clerk reinstall */}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { getProjectById } from "@/server/repos/projects";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminProjectSidebar } from "@/components/admin/admin-project-sidebar";
import { Separator } from "@/components/ui/separator";

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

  return (
    <SidebarProvider defaultOpen={true}>
      <AdminProjectSidebar project={project} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{project.name}</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-stone-50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

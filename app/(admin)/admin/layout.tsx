import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { CommandPanelProvider } from "@/components/admin/command-panel/command-panel-provider";
import { CommandPanel } from "@/components/admin/command-panel/command-panel";
import { CommandPanelTrigger } from "@/components/admin/command-panel/command-panel-trigger";

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
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1" />
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </header>
        <CommandPanelProvider>
          <main className="flex-1 overflow-auto bg-background">{children}</main>
          <CommandPanel />
          <CommandPanelTrigger />
        </CommandPanelProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}

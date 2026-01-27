import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectById } from "@/server/repos/projects";
import { getPhasesForProject, getTasksForProject } from "@/server/repos/kanban";
import { getUrlsForProject } from "@/server/repos/urls";
import { getAttachmentsForProject } from "@/server/repos/attachments";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { supabaseAdmin } from "@/lib/db/client";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/client/client-sidebar";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";

export const runtime = "nodejs";

export default async function ProjectLayout({
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

  const { id } = await params;

  // Get profile to check access and fetch projects
  const profile = await getProfileByClerkId(userId);

  if (!profile) {
    redirect("/projects");
  }

  // Fetch project data for sidebar
  const [project, phases, tasks, urls, attachments] = await Promise.all([
    getProjectById(id),
    getPhasesForProject(id),
    getTasksForProject(id),
    getUrlsForProject(id),
    getAttachmentsForProject(id),
  ]);

  if (!project) {
    redirect("/projects");
  }

  // Check access for non-admins
  if (!profile.is_admin) {
    const { data: directMembership } = await supabaseAdmin
      .from("project_members")
      .select("id")
      .eq("project_id", id)
      .eq("profile_id", profile.id)
      .single();

    if (!directMembership) {
      if (project.organization_id) {
        const { data: orgMembership } = await supabaseAdmin
          .from("organization_members")
          .select("id")
          .eq("organization_id", project.organization_id)
          .eq("profile_id", profile.id)
          .single();

        if (!orgMembership) {
          redirect("/projects");
        }
      } else {
        redirect("/projects");
      }
    }
  }

  // Fetch all projects for the project switcher
  let userProjects: any[] = [];
  if (profile.is_admin) {
    // Admins see all projects
    const { data } = await supabaseAdmin
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    userProjects = data || [];
  } else {
    // Clients see their assigned projects
    const { data: directProjects } = await supabaseAdmin
      .from("project_members")
      .select("project:projects(*)")
      .eq("profile_id", profile.id);

    const { data: orgMemberships } = await supabaseAdmin
      .from("organization_members")
      .select("organization_id")
      .eq("profile_id", profile.id);

    if (orgMemberships && orgMemberships.length > 0) {
      const orgIds = orgMemberships.map((m) => m.organization_id);
      const { data: orgProjects } = await supabaseAdmin
        .from("projects")
        .select("*")
        .in("organization_id", orgIds);

      const directProjectList = (directProjects || []).map((p: any) => p.project);
      userProjects = [...directProjectList, ...(orgProjects || [])];

      // Dedupe
      const seen = new Set();
      userProjects = userProjects.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      });
    } else {
      userProjects = (directProjects || []).map((p: any) => p.project);
    }
  }

  // Check if handoff is ready
  const handoffPhase = phases.find((p) => p.name === "Handoff");
  const isHandoffReady = handoffPhase && tasks.some(
    (t) => t.phase_id === handoffPhase.id && t.is_completed
  );

  return (
    <SidebarProvider>
      <ClientSidebar
        project={project}
        projects={userProjects}
        attachmentsCount={attachments.length}
        urlsCount={urls.length}
        isHandoffReady={isHandoffReady}
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background px-6">
          <SidebarTrigger className="-ml-2" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1" />
          <UserButton afterSignOutUrl="/" />
        </header>
        <main className="flex-1 overflow-auto bg-stone-50">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}

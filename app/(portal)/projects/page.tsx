import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectsForProfile, getAllProjects } from "@/server/repos/projects";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { supabaseAdmin } from "@/lib/db/client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { getTierInfo } from "@/lib/animations";
import { FolderKanban, ArrowRight } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user's profile
  const profile = await getProfileByClerkId(userId);

  if (!profile) {
    // Profile not synced yet - should not happen, but handle gracefully
    return (
      <div className="min-h-screen bg-stone-50">
        <header className="border-b border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/projects" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">C</span>
                </div>
                <span className="text-xl font-semibold text-stone-900">
                  CappaWork
                </span>
              </Link>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-stone-600 mb-4">
                  Your account is being set up. Please try again in a moment.
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // Admins see all projects, clients see their assigned projects
  let projects: any[] = [];

  if (profile.is_admin) {
    projects = await getAllProjects();
  } else {
    // Get projects via direct membership
    const directProjects = await getProjectsForProfile(profile.id);

    // Get projects via organization membership
    const { data: orgMemberships } = await supabaseAdmin
      .from("organization_members")
      .select("organization_id")
      .eq("profile_id", profile.id);

    let orgProjects: any[] = [];
    if (orgMemberships && orgMemberships.length > 0) {
      const orgIds = orgMemberships.map((m) => m.organization_id);
      const { data: orgProjectsData } = await supabaseAdmin
        .from("projects")
        .select("*")
        .in("organization_id", orgIds)
        .order("created_at", { ascending: false });

      orgProjects = orgProjectsData || [];
    }

    // Merge and dedupe projects
    const projectMap = new Map<string, any>();
    [...directProjects, ...orgProjects].forEach((p) => {
      if (!projectMap.has(p.id)) {
        projectMap.set(p.id, p);
      }
    });

    projects = Array.from(projectMap.values()).sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/projects" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">C</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-stone-900">
                  CappaWork
                </span>
                <span className="text-xs text-muted-foreground -mt-1">Client Portal</span>
              </div>
            </Link>
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
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-stone-900">My Projects</h1>
          <p className="text-stone-600 mt-1">
            View progress and details for your active projects
          </p>
        </div>

        {projects.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4">
                  <FolderKanban className="h-8 w-8 text-stone-400" />
                </div>
                <p className="text-stone-600 mb-2">
                  You don&apos;t have access to any projects yet.
                </p>
                <p className="text-sm text-stone-500">
                  Contact your project manager to get access.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: any) => {
              const tierInfo = getTierInfo(project.service_tier);
              return (
                <Link key={project.id} href={`/projects/${project.id}`}>
                  <Card className="hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer h-full group">
                    <CardHeader>
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {project.name}
                        </CardTitle>
                        <Badge
                          className={
                            project.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {project.status}
                        </Badge>
                      </div>
                      {project.description && (
                        <CardDescription className="line-clamp-2">
                          {project.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          {project.service_tier && (
                            <Badge
                              variant="outline"
                              className={`${tierInfo.colors.text} border-current`}
                            >
                              {tierInfo.label}
                            </Badge>
                          )}
                          <div className="text-sm text-stone-500">
                            Created {new Date(project.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <ArrowRight className="h-5 w-5 text-stone-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

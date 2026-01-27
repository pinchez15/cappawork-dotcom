import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectsForProfile, getAllProjects } from "@/server/repos/projects";
import { getProfileByClerkId } from "@/server/repos/profiles";
import { supabaseAdmin } from "@/lib/db/client";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-stone-600 mb-4">
                Your account is being set up. Please try again in a moment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admins see all projects, clients see their assigned projects
  // Clients can access projects via:
  // 1. Direct project_members entry
  // 2. Organization membership via organization_members → projects.organization_id
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-stone-900">My Projects</h1>
        <p className="text-stone-600 mt-1">View progress on your projects</p>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-stone-600 mb-4">
                You don't have access to any projects yet.
              </p>
              <p className="text-sm text-stone-500">
                Contact your project manager to get access.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
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
                  <div className="text-sm text-stone-500">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

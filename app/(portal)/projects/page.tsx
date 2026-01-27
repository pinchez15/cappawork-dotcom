import { redirect } from "next/navigation";
import { requireUser, getCurrentProfile } from "@/lib/auth/guards";
import { getProjectsForProfile } from "@/server/repos/projects";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await requireUser();
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/");
  }

  const projects = await getProjectsForProfile(profile.id);

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


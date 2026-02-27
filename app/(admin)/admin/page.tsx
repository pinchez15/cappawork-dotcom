import { getProjectsGroupedByOrganization } from "@/server/repos/projects";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, AlertTriangle } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getStatusColor(status: string) {
  switch (status) {
    case "active":
      return "bg-gold/20 text-gold";
    case "completed":
      return "bg-green-100 text-green-800";
    case "on_hold":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-stone-100 text-stone-800";
  }
}

export default async function AdminDashboard() {
  const projects = await getProjectsGroupedByOrganization();

  const unassignedCount = projects.filter(
    (p: any) => !p.organization_id
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-navy">Projects</h1>
          <p className="text-stone-500 mt-1">Manage all client projects</p>
        </div>
        <Link href="/admin/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </Link>
      </div>

      {unassignedCount > 0 && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-medium">
                {unassignedCount} project{unassignedCount !== 1 ? "s" : ""}
              </span>{" "}
              not assigned to a client. Clients won&apos;t see these in their
              portal until assigned.
            </p>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-stone-600 mb-4">No projects yet</p>
              <Link href="/admin/projects/new">
                <Button>Create Your First Project</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any) => (
            <Link key={project.id} href={`/admin/projects/${project.id}`}>
              <Card
                className={`hover:shadow-md transition-shadow cursor-pointer h-full ${
                  !project.organization_id
                    ? "border-amber-200 bg-amber-50/30"
                    : ""
                }`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
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
                    <div className="text-sm text-stone-500">
                      Created{" "}
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    {project.organization ? (
                      <div className="flex items-center gap-1.5 text-xs text-stone-600">
                        <Building2 className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {project.organization.name}
                        </span>
                      </div>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-amber-700 border-amber-300 bg-amber-50 text-xs"
                      >
                        Unassigned
                      </Badge>
                    )}
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

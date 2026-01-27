import { getOrganizationsWithStats } from "@/server/repos/organizations";
import { getUnassignedProjects } from "@/server/repos/projects";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Building2, Users, FolderKanban } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const [organizations, unassignedProjects] = await Promise.all([
    getOrganizationsWithStats(),
    getUnassignedProjects(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-stone-900">Clients</h1>
          <p className="text-stone-600 mt-1">
            Manage client organizations and project access
          </p>
        </div>
        <Link href="/admin/clients/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Client
          </Button>
        </Link>
      </div>

      {unassignedProjects.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium text-stone-900 mb-4">
            Unassigned Projects
          </h2>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 mb-3">
              {unassignedProjects.length} project
              {unassignedProjects.length !== 1 ? "s" : ""} not assigned to any
              client:
            </p>
            <div className="flex flex-wrap gap-2">
              {unassignedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/admin/projects/${project.id}`}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-white border border-yellow-300 text-yellow-900 hover:bg-yellow-100"
                >
                  {project.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {organizations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-stone-400 mb-4" />
              <p className="text-stone-600 mb-4">No clients yet</p>
              <Link href="/admin/clients/new">
                <Button>Add Your First Client</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org) => (
            <Link key={org.id} href={`/admin/clients/${org.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {org.image_url ? (
                      <img
                        src={org.image_url}
                        alt={org.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-stone-200 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-stone-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-xl truncate">
                        {org.name}
                      </CardTitle>
                      {org.slug && (
                        <CardDescription className="text-sm">
                          @{org.slug}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-stone-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>
                        {org.member_count} member
                        {org.member_count !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FolderKanban className="h-4 w-4" />
                      <span>
                        {org.project_count} project
                        {org.project_count !== 1 ? "s" : ""}
                      </span>
                    </div>
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

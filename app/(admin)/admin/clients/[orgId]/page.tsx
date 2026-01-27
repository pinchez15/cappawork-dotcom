import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getOrganizationById,
  getOrganizationMembers,
} from "@/server/repos/organizations";
import {
  getProjectsForOrganization,
  getAllProjects,
} from "@/server/repos/projects";
import { getInvitesForOrganization } from "@/server/repos/organization-invites";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2 } from "lucide-react";
import { ProjectAssignment } from "@/components/admin/project-assignment";
import { InviteList } from "@/components/admin/invite-list";
import { InviteForm } from "@/components/admin/invite-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ orgId: string }>;
}

export default async function ClientDetailPage({ params }: Props) {
  const { orgId } = await params;

  const [organization, members, projects, invites, allProjects] =
    await Promise.all([
      getOrganizationById(orgId),
      getOrganizationMembers(orgId),
      getProjectsForOrganization(orgId),
      getInvitesForOrganization(orgId),
      getAllProjects(),
    ]);

  if (!organization) {
    notFound();
  }

  // Get projects not assigned to this org (for assignment dropdown)
  const availableProjects = allProjects.filter(
    (p: { organization_id: string | null }) =>
      p.organization_id === null || p.organization_id === orgId
  );

  const pendingInvites = invites.filter(
    (i: { status: string }) => i.status === "pending"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/admin/clients"
          className="inline-flex items-center text-sm text-stone-600 hover:text-stone-900 mb-4"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Clients
        </Link>

        <div className="flex items-start gap-4">
          {organization.image_url ? (
            <img
              src={organization.image_url}
              alt={organization.name}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-stone-200 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-stone-500" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-semibold text-stone-900">
              {organization.name}
            </h1>
            {organization.slug && (
              <p className="text-stone-600 mt-1">@{organization.slug}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column: Members & Invites */}
        <div className="space-y-6">
          {/* Members */}
          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>
                Users with access to this organization's projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <p className="text-sm text-stone-500">
                  No members yet. Send an invite below.
                </p>
              ) : (
                <div className="space-y-3">
                  {members.map(
                    (member: {
                      id: string;
                      role: string;
                      profile: { id: string; name: string; email: string };
                    }) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium text-stone-900">
                            {member.profile?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-stone-500">
                            {member.profile?.email}
                          </p>
                        </div>
                        <Badge variant="secondary">{member.role}</Badge>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Invites */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Invites</CardTitle>
              <CardDescription>
                Invitations waiting to be accepted
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteList
                invites={pendingInvites}
                organizationId={organization.id}
              />
              <div className="mt-4 pt-4 border-t">
                <InviteForm organizationId={organization.id} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Projects */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Assigned Projects</CardTitle>
              <CardDescription>
                Projects this client has access to
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectAssignment
                organizationId={organization.id}
                assignedProjects={projects}
                availableProjects={availableProjects}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

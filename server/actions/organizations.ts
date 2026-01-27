"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { requireAdmin } from "@/lib/auth/guards";
import { upsertOrganization } from "@/server/repos/organizations";
import {
  createInviteRecord,
  updateInviteStatus,
} from "@/server/repos/organization-invites";
import { assignProjectToOrganization } from "@/server/repos/projects";
import { revalidatePath } from "next/cache";

export async function createClientOrganization(formData: FormData) {
  const user = await requireAdmin();

  const companyName = formData.get("companyName") as string;
  const clientEmail = formData.get("clientEmail") as string;

  if (!companyName || !clientEmail) {
    throw new Error("Company name and client email are required");
  }

  const clerk = await clerkClient();

  // 1. Create organization in Clerk
  const organization = await clerk.organizations.createOrganization({
    name: companyName,
    createdBy: user.userId,
  });

  // 2. Sync organization to local database
  const localOrg = await upsertOrganization({
    id: organization.id,
    name: organization.name,
    slug: organization.slug,
    image_url: organization.imageUrl,
  });

  // 3. Send invite to client via Clerk
  const invitation =
    await clerk.organizations.createOrganizationInvitation({
      organizationId: organization.id,
      emailAddress: clientEmail,
      role: "org:member",
      inviterUserId: user.userId,
    });

  // 4. Store invite record locally
  await createInviteRecord({
    organizationId: localOrg.id,
    email: clientEmail,
    clerkInvitationId: invitation.id,
    invitedBy: user.profileId ?? undefined,
  });

  revalidatePath("/admin/clients");

  return { organizationId: localOrg.id };
}

export async function sendClientInvite(
  organizationId: string,
  email: string
) {
  const user = await requireAdmin();

  const clerk = await clerkClient();

  // Get the organization to find Clerk org ID
  const { supabaseAdmin } = await import("@/lib/db/client");
  const { data: org, error } = await supabaseAdmin
    .from("organizations")
    .select("clerk_org_id")
    .eq("id", organizationId)
    .single();

  if (error || !org) {
    throw new Error("Organization not found");
  }

  // Send invite via Clerk
  const invitation =
    await clerk.organizations.createOrganizationInvitation({
      organizationId: org.clerk_org_id,
      emailAddress: email,
      role: "org:member",
      inviterUserId: user.userId,
    });

  // Store invite record locally
  await createInviteRecord({
    organizationId,
    email,
    clerkInvitationId: invitation.id,
    invitedBy: user.profileId ?? undefined,
  });

  revalidatePath(`/admin/clients/${organizationId}`);

  return { inviteId: invitation.id };
}

export async function assignProjectToOrg(
  projectId: string,
  organizationId: string | null
) {
  await requireAdmin();

  await assignProjectToOrganization(projectId, organizationId);

  revalidatePath("/admin/clients");
  revalidatePath("/admin");
  if (organizationId) {
    revalidatePath(`/admin/clients/${organizationId}`);
  }
}

export async function revokeInvite(inviteId: string, clerkInvitationId: string | null) {
  await requireAdmin();

  // Revoke in Clerk if we have the Clerk ID
  if (clerkInvitationId) {
    try {
      const clerk = await clerkClient();
      // Get the invite to find the org
      const { supabaseAdmin } = await import("@/lib/db/client");
      const { data: invite } = await supabaseAdmin
        .from("organization_invites")
        .select("organization_id, organizations(clerk_org_id)")
        .eq("id", inviteId)
        .single();

      if (invite?.organizations) {
        // Handle both single object and array cases from Supabase join
        const orgData = invite.organizations as unknown;
        const org = Array.isArray(orgData) ? orgData[0] : orgData;
        if (org && typeof org === "object" && "clerk_org_id" in org) {
          await clerk.organizations.revokeOrganizationInvitation({
            organizationId: (org as { clerk_org_id: string }).clerk_org_id,
            invitationId: clerkInvitationId,
            requestingUserId: (await requireAdmin()).userId,
          });
        }
      }
    } catch (e) {
      // Invitation might already be revoked or expired in Clerk
      console.error("Failed to revoke in Clerk:", e);
    }
  }

  // Update local status
  await updateInviteStatus(inviteId, "revoked");

  revalidatePath("/admin/clients");
}

export async function resendInvite(
  organizationId: string,
  email: string,
  oldInviteId: string
) {
  // Revoke the old invite
  const { supabaseAdmin } = await import("@/lib/db/client");
  const { data: oldInvite } = await supabaseAdmin
    .from("organization_invites")
    .select("clerk_invitation_id")
    .eq("id", oldInviteId)
    .single();

  if (oldInvite?.clerk_invitation_id) {
    await revokeInvite(oldInviteId, oldInvite.clerk_invitation_id);
  } else {
    await updateInviteStatus(oldInviteId, "revoked");
  }

  // Send a new invite
  return await sendClientInvite(organizationId, email);
}

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { upsertProfile } from "@/server/repos/profiles";
import { upsertOrganization } from "@/server/repos/organizations";
import {
  upsertOrganizationMember,
  deleteOrganizationMember,
} from "@/server/repos/organization-members";
import { updateInviteStatusByClerkId } from "@/server/repos/organization-invites";

export const runtime = "nodejs";

async function getRawBody(req: Request): Promise<string> {
  return await req.text();
}

export async function POST(req: Request) {
  // Get the Svix headers for verification
  const headerPayload = await headers();
  const svixId = headerPayload.get("svix-id");
  const svixTimestamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");

  // If there are no headers, error out
  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  // Get the webhook secret
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new NextResponse("Error: CLERK_WEBHOOK_SECRET not set", {
      status: 500,
    });
  }

  // Get the body
  const payload = await getRawBody(req);

  // Create a new Svix instance with your secret
  const wh = new Webhook(webhookSecret);

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as any;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error occurred", {
      status: 400,
    });
  }

  // Handle the webhook
  const eventType = evt.type;

  try {
    switch (eventType) {
      case "user.created":
      case "user.updated": {
        const { id, email_addresses, first_name, last_name, public_metadata, private_metadata } = evt.data;
        await upsertProfile({
          id,
          email_addresses,
          first_name,
          last_name,
          public_metadata,
          private_metadata,
        });
        break;
      }
      case "organization.created":
      case "organization.updated": {
        const { id, name, slug, image_url } = evt.data;
        await upsertOrganization({
          id,
          name,
          slug,
          image_url,
        });
        break;
      }
      case "organizationMembership.created":
      case "organizationMembership.updated": {
        const { id, organization, public_user_data, role } = evt.data;
        // Ensure organization exists before adding membership
        await upsertOrganization({
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          image_url: organization.image_url,
        });
        await upsertOrganizationMember({
          clerkMembershipId: id,
          clerkOrgId: organization.id,
          clerkUserId: public_user_data.user_id,
          role: role,
        });
        // If user has org:admin role, set them as site admin
        if (role === "org:admin") {
          const { setAdminStatus } = await import("@/server/repos/profiles");
          await setAdminStatus(public_user_data.user_id, true);
        }
        break;
      }
      case "organizationMembership.deleted": {
        const { id } = evt.data;
        await deleteOrganizationMember(id);
        break;
      }
      case "organizationInvitation.accepted": {
        const { id } = evt.data;
        await updateInviteStatusByClerkId(id, "accepted");
        break;
      }
      case "organizationInvitation.revoked": {
        const { id } = evt.data;
        await updateInviteStatusByClerkId(id, "revoked");
        break;
      }
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new NextResponse("Error processing webhook", {
      status: 500,
    });
  }
}


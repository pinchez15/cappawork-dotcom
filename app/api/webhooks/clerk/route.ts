import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";
import { upsertProfile } from "@/server/repos/profiles";
import { upsertOrganization, deleteOrganization } from "@/server/repos/organizations";
import {
  upsertOrganizationMember,
  deleteOrganizationMember,
} from "@/server/repos/organization-members";
import { upsertSubscription } from "@/server/repos/subscriptions";
import { upsertPaymentAttempt } from "@/server/repos/payment-attempts";
import { upsertWaitlistEntry } from "@/server/repos/waitlist";
import { upsertRole, deleteRole } from "@/server/repos/roles";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = await headers();
  const svixHeaders = {
    "svix-id": headersList.get("svix-id")!,
    "svix-timestamp": headersList.get("svix-timestamp")!,
    "svix-signature": headersList.get("svix-signature")!,
  };

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt: any;

  try {
    evt = wh.verify(payload, svixHeaders);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { type, data } = evt;

  try {
    switch (type) {
      // User events
      case "user.created":
      case "user.updated":
        await upsertProfile(data);
        break;
      case "user.deleted":
        // Optionally handle user deletion (soft delete or cascade)
        console.log(`User deleted: ${data.id}`);
        break;

      // Organization events
      case "organization.created":
      case "organization.updated":
        await upsertOrganization(data);
        break;
      case "organization.deleted":
        await deleteOrganization(data.id);
        break;

      // Organization invitation events
      case "organizationInvitation.created":
      case "organizationInvitation.accepted":
      case "organizationInvitation.revoked":
        // These are handled by organizationMembership events
        console.log(`Organization invitation ${type}: ${data.id}`);
        break;

      // Organization membership events
      case "organizationMembership.created":
      case "organizationMembership.updated":
        await upsertOrganizationMember({
          clerkMembershipId: data.id,
          clerkOrgId: data.organization.id,
          clerkUserId: data.public_user_data.user_id,
          role: data.role,
        });
        break;
      case "organizationMembership.deleted":
        await deleteOrganizationMember(data.id);
        break;

      // Subscription events
      case "subscription.created":
      case "subscription.updated":
      case "subscription.active":
      case "subscription.pastDue":
        await upsertSubscription({
          clerkSubscriptionId: data.id,
          clerkOrgId: data.organization_id,
          status: data.status,
          planId: data.plan_id,
          planName: data.plan_name,
          currentPeriodStart: data.current_period_start,
          currentPeriodEnd: data.current_period_end,
          cancelAtPeriodEnd: data.cancel_at_period_end,
        });
        break;

      // Payment attempt events
      case "paymentAttempt.created":
      case "paymentAttempt.updated":
        await upsertPaymentAttempt({
          clerkPaymentAttemptId: data.id,
          clerkSubscriptionId: data.subscription_id,
          clerkOrgId: data.organization_id,
          amount: data.amount,
          currency: data.currency,
          status: data.status,
          paymentMethod: data.payment_method,
        });
        break;

      // Waitlist events
      case "waitlistEntry.created":
      case "waitlistEntry.updated":
        await upsertWaitlistEntry({
          clerkWaitlistEntryId: data.id,
          email: data.email_address,
          clerkUserId: data.user_id || null,
          clerkOrgId: data.organization_id || null,
          status: data.status,
          metadata: data.metadata || null,
        });
        break;

      // Role events
      case "role.created":
      case "role.updated":
        await upsertRole({
          clerkRoleId: data.id,
          name: data.name,
          key: data.key,
          description: data.description || null,
          permissions: data.permissions || null,
        });
        break;
      case "role.deleted":
        await deleteRole(data.id);
        break;

      default:
        console.log(`Unhandled webhook type: ${type}`);
    }
  } catch (error) {
    console.error(`Webhook handler error for ${type}:`, error);
    // Don't return 500 - Clerk will retry. Log and continue
    return NextResponse.json(
      { error: "Processing failed", type },
      { status: 200 }
    );
  }

  return NextResponse.json({ received: true, type });
}


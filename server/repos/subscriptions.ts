import { supabaseAdmin } from "@/lib/db/client";

export async function upsertSubscription(data: {
  clerkSubscriptionId: string;
  clerkOrgId: string;
  status: string;
  planId?: string | null;
  planName?: string | null;
  currentPeriodStart?: string | null;
  currentPeriodEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
}) {
  // Get organization ID
  const { data: org, error: orgError } = await supabaseAdmin
    .from("organizations")
    .select("id")
    .eq("clerk_org_id", data.clerkOrgId)
    .single();

  if (orgError || !org) throw new Error("Organization not found");

  const { data: subscription, error } = await supabaseAdmin
    .from("subscriptions")
    .upsert(
      {
        clerk_subscription_id: data.clerkSubscriptionId,
        organization_id: org.id,
        status: data.status,
        plan_id: data.planId || null,
        plan_name: data.planName || null,
        current_period_start: data.currentPeriodStart
          ? new Date(data.currentPeriodStart).toISOString()
          : null,
        current_period_end: data.currentPeriodEnd
          ? new Date(data.currentPeriodEnd).toISOString()
          : null,
        cancel_at_period_end: data.cancelAtPeriodEnd || false,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "clerk_subscription_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return subscription;
}


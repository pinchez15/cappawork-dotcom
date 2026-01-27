import { supabaseAdmin } from "@/lib/db/client";

export async function upsertPaymentAttempt(data: {
  clerkPaymentAttemptId: string;
  clerkSubscriptionId?: string | null;
  clerkOrgId: string;
  amount: number;
  currency?: string;
  status: string;
  paymentMethod?: string | null;
}) {
  // Get organization ID
  const { data: org, error: orgError } = await supabaseAdmin
    .from("organizations")
    .select("id")
    .eq("clerk_org_id", data.clerkOrgId)
    .single();

  if (orgError || !org) throw new Error("Organization not found");

  // Get subscription ID if provided
  let subscriptionId = null;
  if (data.clerkSubscriptionId) {
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("id")
      .eq("clerk_subscription_id", data.clerkSubscriptionId)
      .single();
    subscriptionId = sub?.id || null;
  }

  const { data: paymentAttempt, error } = await supabaseAdmin
    .from("payment_attempts")
    .upsert(
      {
        clerk_payment_attempt_id: data.clerkPaymentAttemptId,
        subscription_id: subscriptionId,
        organization_id: org.id,
        amount: data.amount,
        currency: data.currency || "usd",
        status: data.status,
        payment_method: data.paymentMethod || null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "clerk_payment_attempt_id",
      }
    )
    .select()
    .single();

  if (error) throw error;
  return paymentAttempt;
}


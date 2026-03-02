import { supabaseAdmin } from "@/lib/db/client";

export async function getBillingLinksForOrganization(orgId: string) {
  const { data, error } = await supabaseAdmin
    .from("billing_links")
    .select(
      `
      *,
      project:projects!project_id(id, name)
    `
    )
    .eq("organization_id", orgId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createBillingLink(data: {
  organization_id: string;
  project_id?: string | null;
  url: string;
  label: string;
  type: "one_time" | "subscription";
  amount_display?: string | null;
  notes?: string | null;
}) {
  const { data: link, error } = await supabaseAdmin
    .from("billing_links")
    .insert({
      organization_id: data.organization_id,
      project_id: data.project_id || null,
      url: data.url,
      label: data.label,
      type: data.type,
      amount_display: data.amount_display || null,
      notes: data.notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return link;
}

export async function updateBillingLinkStatus(
  linkId: string,
  status: "active" | "paid" | "archived"
) {
  const { error } = await supabaseAdmin
    .from("billing_links")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", linkId);

  if (error) throw error;
}

export async function deleteBillingLink(linkId: string) {
  const { error } = await supabaseAdmin
    .from("billing_links")
    .delete()
    .eq("id", linkId);

  if (error) throw error;
}

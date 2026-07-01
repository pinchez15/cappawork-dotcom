import { supabaseAdmin } from "@/lib/db/client";

export type GtmHypothesis = {
  id: string;
  account_id: string;
  list_id: string | null;
  likely_pain: string | null;
  relevant_workflow: string | null;
  relevant_proof: string | null;
  recommended_offer: string | null;
  outreach_angle: string | null;
  suggested_first_question: string | null;
  suggested_email_draft: string | null;
  suggested_linkedin_message: string | null;
  confidence_score: number;
  approval_status: string;
  approved_at: string | null;
  is_ai_generated: boolean;
  created_at: string;
  updated_at: string;
};

export async function createGtmHypothesis(
  hypothesis: Omit<GtmHypothesis, "id" | "approved_at" | "created_at" | "updated_at">
): Promise<GtmHypothesis> {
  const { data, error } = await supabaseAdmin
    .from("gtm_hypotheses")
    .insert(hypothesis)
    .select()
    .single();

  if (error) throw error;
  return data as GtmHypothesis;
}

export async function getHypothesisForAccount(
  accountId: string
): Promise<GtmHypothesis | null> {
  const { data, error } = await supabaseAdmin
    .from("gtm_hypotheses")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as GtmHypothesis | null;
}

export async function approveGtmHypothesis(
  id: string,
  approvalStatus: "approved" | "edited" | "discarded",
  edits?: Partial<
    Pick<
      GtmHypothesis,
      | "likely_pain"
      | "relevant_workflow"
      | "relevant_proof"
      | "recommended_offer"
      | "outreach_angle"
      | "suggested_first_question"
      | "suggested_email_draft"
      | "suggested_linkedin_message"
    >
  >
): Promise<GtmHypothesis> {
  const { data, error } = await supabaseAdmin
    .from("gtm_hypotheses")
    .update({
      ...edits,
      approval_status: approvalStatus,
      approved_at:
        approvalStatus === "approved" || approvalStatus === "edited"
          ? new Date().toISOString()
          : null,
      is_ai_generated: approvalStatus === "edited" ? false : undefined,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as GtmHypothesis;
}

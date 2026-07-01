import {
  updateGtmAccount,
  getGtmAccountDetail,
} from "@/server/repos/gtm-accounts";
import {
  bulkUpdateMemberships,
  recordAccountSource,
} from "@/server/repos/list-memberships";
import { getHypothesisForAccount } from "@/server/repos/gtm-hypotheses";
import { getList } from "@/server/repos/lists";

export type PromoteResult = {
  accountId: string;
  gtmStage: string;
};

export async function promoteAccountToPipeline(
  accountId: string,
  listId?: string
): Promise<PromoteResult> {
  const detail = await getGtmAccountDetail(accountId);
  if (!detail) throw new Error("Account not found");

  const hypothesis = detail.hypothesis as {
    approval_status: string;
  } | null;

  const gtmStage =
    hypothesis?.approval_status === "approved"
      ? "outreach_ready"
      : hypothesis?.approval_status === "draft"
        ? "hypothesis_ready"
        : "enriched";

  await updateGtmAccount(accountId, {
    gtm_stage: gtmStage,
    next_action:
      gtmStage === "outreach_ready"
        ? "Begin outreach sequence"
        : "Review and approve hypothesis",
  });

  if (listId) {
    const list = await getList(listId);
    await bulkUpdateMemberships(listId, [accountId], {
      review_status: "accepted",
      next_action: "Promoted to pipeline",
    });
    await recordAccountSource(
      accountId,
      listId,
      "list",
      list?.name || null
    );
  }

  return { accountId, gtmStage };
}

export async function promoteAccounts(
  accountIds: string[],
  listId?: string
): Promise<PromoteResult[]> {
  const results: PromoteResult[] = [];
  for (const id of accountIds) {
    try {
      results.push(await promoteAccountToPipeline(id, listId));
    } catch (err) {
      console.error(`Failed to promote account ${id}:`, err);
    }
  }
  return results;
}

export async function advanceGtmStage(
  accountId: string,
  stage: string,
  nextAction?: string
): Promise<void> {
  await updateGtmAccount(accountId, {
    gtm_stage: stage,
    next_action: nextAction || null,
  });
}

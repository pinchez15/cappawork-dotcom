import { createList } from "@/server/repos/lists";
import { createListRun } from "@/server/repos/list-runs";
import {
  importCsvAccounts,
  runListEnrichment,
  runListScoring,
} from "@/server/services/list-builder/runner";
import { generateHypothesis } from "@/server/services/list-builder/hypothesis";
import { promoteAccountToPipeline } from "@/server/services/list-builder/promote";
import { getAccountsForList } from "@/server/repos/list-memberships";
import { supabaseAdmin } from "@/lib/db/client";

export async function processInboundLead(input: {
  source: "calculator" | "scorecard" | "service_inquiry" | "cohort";
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_title?: string;
  linkedin_url?: string;
  industry?: string;
  location?: string;
  created_by: string;
  metadata?: Record<string, unknown>;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const listName = `Inbound — ${input.source} — ${today}`;

  const { data: existingList } = await supabaseAdmin
    .from("lists")
    .select("id")
    .eq("source_provider", "inbound")
    .ilike("name", `Inbound — ${input.source}%`)
    .gte("created_at", today)
    .limit(1)
    .maybeSingle();

  let listId: string;

  if (existingList) {
    listId = existingList.id;
  } else {
    const list = await createList(
      {
        name: listName,
        vertical_id: null,
        description: `Auto-created from ${input.source} inbound`,
        icp_template: null,
        source_provider: "inbound",
        status: "review",
        notes: JSON.stringify(input.metadata || {}),
        created_by: input.created_by,
      },
      {
        industries: input.industry ? [input.industry] : [],
        geographies: input.location ? [input.location] : [],
        company_keywords: [],
        excluded_keywords: [],
        technologies: [],
        job_titles: ["founder", "ceo", "owner"],
        seniority_levels: ["owner", "c_suite"],
        departments: ["executive"],
        website_keywords: [],
        signals_required: [],
        signals_excluded: [],
        max_records: 50,
        enrichment_depth: "deep",
      }
    );
    listId = list.id;
  }

  const run = await createListRun({
    list_id: listId,
    run_type: "import",
    provider: "inbound",
    inngest_run_id: null,
    status: "running",
    input_criteria: input,
    records_total: 1,
  });

  await importCsvAccounts(listId, run.id, [
    {
      company_name: input.company_name,
      industry: input.industry,
      location: input.location,
      contact_name: input.contact_name,
      contact_email: input.contact_email,
      contact_title: input.contact_title,
      linkedin_url: input.linkedin_url,
    },
  ]);

  const accounts = await getAccountsForList(listId);
  const account = accounts.find(
    (a) => a.company_name.toLowerCase() === input.company_name.toLowerCase()
  );

  if (account) {
    await runListEnrichment(listId, run.id, [account.id]);
    await runListScoring(listId, run.id, [account.id]);

    try {
      await generateHypothesis(account.id, listId);
    } catch {
      // optional
    }

    const updated = (await getAccountsForList(listId)).find((a) => a.id === account.id);
    if (updated && updated.fit_score >= 40) {
      await promoteAccountToPipeline(account.id, listId);
    }
  }

  return { listId, accountId: account?.id };
}

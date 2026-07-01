import {
  searchOrganizations,
  searchPeople,
  enrichOrganization,
  normalizeApolloOrg,
  normalizeApolloPerson,
} from "@/lib/providers/apollo";
import { getList, updateList, refreshListCounts } from "@/server/repos/lists";
import {
  upsertGtmAccount,
  updateGtmAccount,
  findExistingDomains,
  normalizeDomain,
} from "@/server/repos/gtm-accounts";
import {
  upsertGtmContact,
  setPrimaryContact,
  getContactsForAccount,
} from "@/server/repos/gtm-contacts";
import {
  addAccountToList,
  getAccountsForList,
  recordAccountSource,
} from "@/server/repos/list-memberships";
import {
  createListRun,
  updateListRun,
  logEnrichmentEvent,
} from "@/server/repos/list-runs";
import {
  calculateFitScore,
  calculatePainScore,
  calculateContactRelevance,
  estimateFounderLedScore,
} from "@/server/services/list-builder/scoring";
import { createGtmSignal } from "@/server/repos/gtm-signals";
import { getVertical } from "@/server/repos/verticals";
import { generateHypothesis } from "@/server/services/list-builder/hypothesis";
import { promoteAccounts } from "@/server/services/list-builder/promote";
import { getGtmAccountDetail } from "@/server/repos/gtm-accounts";

export async function runListGeneration(listId: string, runId: string) {
  const list = await getList(listId);
  if (!list || !list.criteria) throw new Error("List or criteria not found");

  await updateList(listId, { status: "generating" });
  await updateListRun(runId, { status: "running" });

  try {
    const { organizations, credits } = await searchOrganizations(list.criteria);

    const domains = organizations
      .map((o) => normalizeDomain(o.website_url))
      .filter(Boolean) as string[];
    const existingDomains = await findExistingDomains(domains);

    let processed = 0;
    let skipped = 0;

    for (const org of organizations) {
      const normalized = normalizeApolloOrg(org);
      const domain = normalizeDomain(normalized.domain);

      const account = await upsertGtmAccount({
        vertical_id: list.vertical_id,
        company_name: normalized.company_name,
        domain: domain,
        linkedin_url: normalized.linkedin_url,
        industry: normalized.industry,
        sub_industry: null,
        location: normalized.location,
        employee_count: normalized.employee_count,
        revenue_estimate: normalized.revenue_estimate,
        description: normalized.description,
        first_source: list.source_provider,
        apollo_id: normalized.apollo_id,
        provider_data: normalized.provider_data,
        notes: null,
        founder_led_score: estimateFounderLedScore({
          employee_count: normalized.employee_count ?? undefined,
          description: normalized.description ?? undefined,
        }),
        gtm_stage: "list_built",
      });

      const isNewToList = domain ? !existingDomains.has(domain) : true;

      await addAccountToList(listId, account.id, list.source_provider);
      await recordAccountSource(account.id, listId, "list", list.name);

      if (domain) existingDomains.add(domain);
      if (isNewToList) processed++;
      else skipped++;
    }

    await updateListRun(runId, {
      status: "completed",
      records_processed: processed,
      records_total: organizations.length,
      credits_consumed: credits,
      completed_at: new Date().toISOString(),
    });

    await updateList(listId, {
      status: "review",
      last_run_at: new Date().toISOString(),
    });
    await refreshListCounts(listId);

    await logEnrichmentEvent({
      list_run_id: runId,
      provider: "apollo",
      event_type: "org_search",
      credits_consumed: credits,
      success: true,
    });

    return { processed, skipped, total: organizations.length };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await updateListRun(runId, {
      status: "failed",
      error_message: message,
      completed_at: new Date().toISOString(),
    });
    await updateList(listId, { status: "draft" });
    throw err;
  }
}

export async function runListEnrichment(
  listId: string,
  runId: string,
  accountIds?: string[]
) {
  const list = await getList(listId);
  if (!list || !list.criteria) throw new Error("List or criteria not found");

  await updateList(listId, { status: "enriching", enrichment_status: "partial" });
  await updateListRun(runId, { status: "running" });

  const allAccounts = await getAccountsForList(listId);
  const accounts = accountIds?.length
    ? allAccounts.filter((a) => accountIds.includes(a.id))
    : allAccounts;

  let processed = 0;
  let credits = 0;

  try {
    for (const account of accounts) {
      if (account.domain && account.enrichment_status !== "enriched") {
        const { organization, credits: enrichCredits } =
          await enrichOrganization(account.domain);
        credits += enrichCredits;

        if (organization) {
          const normalized = normalizeApolloOrg(organization);
          await updateGtmAccount(account.id, {
            ...normalized,
            sub_industry: account.sub_industry,
            enrichment_status: "enriched",
            last_enriched_at: new Date().toISOString(),
            gtm_stage: "enriched",
          });
        }
      }

      const refreshed = await getGtmAccountDetail(account.id);
      const apolloId = refreshed?.apollo_id || account.apollo_id;

      if (list.criteria.enrichment_depth !== "minimal" && apolloId) {
        const { people, credits: peopleCredits } = await searchPeople(
          apolloId,
          list.criteria
        );
        credits += peopleCredits;

        for (const person of people.slice(0, 3)) {
          const normalized = normalizeApolloPerson(person);
          const relevance = calculateContactRelevance(
            normalized.title,
            list.criteria
          );

          const contact = await upsertGtmContact(account.id, {
            ...normalized,
            relevance_score: relevance,
            enrichment_confidence: normalized.email ? 80 : 40,
            role_hypothesis: relevance >= 70 ? "Primary decision maker" : "Influencer",
          });

          if (relevance >= 70 && !refreshed?.primary_contact_id) {
            await setPrimaryContact(account.id, contact.id);
          }
        }
      }

      await detectSignalsFromAccount(account.id, listId, account);
      processed++;
      await updateListRun(runId, { records_processed: processed });
    }

    await updateListRun(runId, {
      status: "completed",
      records_processed: processed,
      records_total: accounts.length,
      credits_consumed: credits,
      completed_at: new Date().toISOString(),
    });

    await updateList(listId, { enrichment_status: "complete" });
    await refreshListCounts(listId);

    return { processed, credits };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await updateListRun(runId, {
      status: "failed",
      error_message: message,
      completed_at: new Date().toISOString(),
    });
    throw err;
  }
}

export async function runListScoring(
  listId: string,
  runId: string,
  accountIds?: string[]
) {
  const list = await getList(listId);
  if (!list) throw new Error("List not found");

  const vertical = list.vertical_id ? await getVertical(list.vertical_id) : null;

  await updateList(listId, { status: "scoring" });
  await updateListRun(runId, { status: "running" });

  const allAccounts = await getAccountsForList(listId);
  const accounts = accountIds?.length
    ? allAccounts.filter((a) => accountIds.includes(a.id))
    : allAccounts;

  let processed = 0;

  for (const account of accounts) {
    const fit = calculateFitScore(account, list.criteria, vertical?.tier ?? null);
    const pain = calculatePainScore(account, list.criteria);

    await updateGtmAccount(account.id, {
      fit_score: fit.score,
      fit_score_breakdown: fit.breakdown,
      pain_score: pain.score,
      pain_score_breakdown: pain.breakdown,
      case_study_match: fit.caseStudyMatch,
      next_action: fit.nextAction,
      founder_led_score:
        account.founder_led_score || estimateFounderLedScore(account),
    });

    processed++;
    await updateListRun(runId, { records_processed: processed });
  }

  await updateListRun(runId, {
    status: "completed",
    records_processed: processed,
    records_total: accounts.length,
    completed_at: new Date().toISOString(),
  });

  await updateList(listId, { status: "ready" });
  await refreshListCounts(listId);

  return { processed };
}

export async function runHypothesisGeneration(
  listId: string,
  runId: string,
  accountIds: string[]
) {
  await updateListRun(runId, { status: "running" });
  let processed = 0;

  for (const accountId of accountIds) {
    try {
      await generateHypothesis(accountId, listId);
      await updateGtmAccount(accountId, { gtm_stage: "hypothesis_ready" });
      processed++;
      await updateListRun(runId, { records_processed: processed });
    } catch (err) {
      console.error(`Hypothesis failed for ${accountId}:`, err);
    }
  }

  await updateListRun(runId, {
    status: "completed",
    records_processed: processed,
    records_total: accountIds.length,
    completed_at: new Date().toISOString(),
  });

  return { processed };
}

export async function runPromote(
  listId: string,
  runId: string,
  accountIds: string[]
) {
  await updateListRun(runId, { status: "running" });
  const results = await promoteAccounts(accountIds, listId);

  await updateListRun(runId, {
    status: "completed",
    records_processed: results.length,
    records_total: accountIds.length,
    completed_at: new Date().toISOString(),
  });

  return { promoted: results.length, results };
}

async function detectSignalsFromAccount(
  accountId: string,
  listId: string,
  account: {
    description: string | null;
    industry: string | null;
    employee_count: number | null;
  }
) {
  const desc = (account.description || "").toLowerCase();
  const signals: { type: string; summary: string; confidence: number }[] = [];

  if (desc.includes("hiring") || desc.includes("growing")) {
    signals.push({ type: "hiring_ops", summary: "Growth/hiring activity suggested", confidence: 60 });
  }
  if (desc.includes("location") || desc.includes("expansion")) {
    signals.push({ type: "new_location", summary: "Possible expansion activity", confidence: 55 });
  }
  if (desc.includes("manual") || desc.includes("spreadsheet")) {
    signals.push({ type: "manual_intake", summary: "Manual workflow signals detected", confidence: 70 });
  }
  if (desc.includes("compliance") || desc.includes("reporting")) {
    signals.push({ type: "compliance_burden", summary: "Compliance/reporting burden indicated", confidence: 65 });
  }
  if (account.employee_count && account.employee_count > 50) {
    signals.push({ type: "job_posting_ops", summary: "Scale suggests ops complexity", confidence: 50 });
  }

  for (const s of signals) {
    try {
      await createGtmSignal({
        account_id: accountId,
        list_id: listId,
        signal_type: s.type,
        signal_source: "ai_detected",
        evidence_summary: s.summary,
        confidence_score: s.confidence,
        why_now_summary: "Detected during enrichment",
        action_recommendation: "Review in Signal Inbox",
        review_status: "pending",
      });
    } catch {
      // skip duplicates
    }
  }
}

export async function importCsvAccounts(
  listId: string,
  runId: string,
  rows: {
    company_name: string;
    domain?: string;
    website?: string;
    industry?: string;
    location?: string;
    employee_count?: number | string;
    revenue_estimate?: string;
    contact_name?: string;
    contact_title?: string;
    contact_email?: string;
    linkedin_url?: string;
  }[]
) {
  const list = await getList(listId);
  await updateListRun(runId, { status: "running" });
  let processed = 0;

  for (const row of rows) {
    const domain = normalizeDomain(row.domain || row.website);
    const employeeCount =
      typeof row.employee_count === "string"
        ? parseInt(row.employee_count) || null
        : row.employee_count || null;

    const account = await upsertGtmAccount({
      vertical_id: list?.vertical_id ?? null,
      company_name: row.company_name,
      domain,
      linkedin_url: row.linkedin_url || null,
      industry: row.industry || null,
      sub_industry: null,
      location: row.location || null,
      employee_count: employeeCount,
      revenue_estimate: row.revenue_estimate || null,
      description: null,
      first_source: "csv",
      apollo_id: null,
      provider_data: {},
      notes: null,
      gtm_stage: "list_built",
    });

    await addAccountToList(listId, account.id, "csv");
    await recordAccountSource(account.id, listId, "csv", list?.name || null);

    if (row.contact_name) {
      const contact = await upsertGtmContact(account.id, {
        name: row.contact_name,
        title: row.contact_title,
        email: row.contact_email,
        linkedin_url: row.linkedin_url,
        source: "csv",
      });
      await setPrimaryContact(account.id, contact.id);
    }

    processed++;
  }

  await updateListRun(runId, {
    status: "completed",
    records_processed: processed,
    records_total: rows.length,
    completed_at: new Date().toISOString(),
  });

  await updateList(listId, { status: "review", last_run_at: new Date().toISOString() });
  await refreshListCounts(listId);

  return { processed };
}

export async function startListRun(
  listId: string,
  runType: string,
  provider?: string,
  accountIds?: string[]
) {
  const list = await getList(listId);
  return createListRun({
    list_id: listId,
    run_type: runType,
    provider: provider || list?.source_provider || "apollo",
    inngest_run_id: null,
    status: "pending",
    input_criteria: { account_ids: accountIds },
    records_total: accountIds?.length || null,
  });
}

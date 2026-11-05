import {
  classifySignalType,
  parseSeedStatus,
  liStatusToOutreachStage,
  type SignalSource,
} from "@/lib/validators/li-signals";
import {
  findAccountByDomain,
  normalizeDomain,
  upsertGtmAccount,
  updateGtmAccount,
} from "@/server/repos/gtm-accounts";
import {
  createGtmContact,
  setPrimaryContact,
  updateGtmContact,
  getContactsForAccount,
} from "@/server/repos/gtm-contacts";
import {
  createGtmSignal,
  deleteSignalsForAccount,
} from "@/server/repos/gtm-signals";
import { createGtmOutreachActivity } from "@/server/repos/gtm-outreach-activities";

export type SeedSignalRow = {
  domain: string;
  company: string;
  website?: string | null;
  score: number;
  rank?: number;
  status?: string;
  signal: string;
  sources: SignalSource[];
  best: string;
  best_title?: string | null;
  best_li?: string | null;
  emailed?: string | null;
  emailed_title?: string | null;
  emailed_li?: string | null;
  signal_type?: string;
};

export type ImportResult = {
  imported: number;
  updated: number;
  no_signal: number;
  errors: string[];
};

function websiteFromRow(row: SeedSignalRow): string | null {
  if (row.website) {
    return row.website.startsWith("http") ? row.website : `https://${row.website}`;
  }
  if (row.domain) {
    return `https://${row.domain}`;
  }
  return null;
}

async function upsertBestContact(
  accountId: string,
  name: string,
  title: string | null | undefined,
  linkedinUrl: string | null | undefined,
  outreachStage: string
) {
  const existing = await getContactsForAccount(accountId);
  const match = existing.find(
    (c) => c.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  if (match) {
    const updated = await updateGtmContact(match.id, {
      title: title ?? match.title,
      linkedin_url: linkedinUrl || match.linkedin_url,
      outreach_stage: outreachStage,
      relevance_score: Math.max(match.relevance_score, 90),
      is_primary: true,
    });
    await setPrimaryContact(accountId, updated.id);
    return updated;
  }

  const created = await createGtmContact({
    account_id: accountId,
    name,
    title: title ?? null,
    email: null,
    linkedin_url: linkedinUrl || null,
    phone: null,
    seniority: null,
    department: null,
    role_hypothesis: "Best person to message (seeded)",
    source: "manual",
    apollo_id: null,
    provider_data: {},
    relevance_score: 90,
    is_primary: true,
    outreach_stage: outreachStage,
  });
  await setPrimaryContact(accountId, created.id);
  return created;
}

export async function importLiSignals(input: {
  signals: SeedSignalRow[];
  no_signal?: string[];
}): Promise<ImportResult> {
  const result: ImportResult = {
    imported: 0,
    updated: 0,
    no_signal: 0,
    errors: [],
  };

  for (const row of input.signals) {
    try {
      const domain = normalizeDomain(row.domain || row.website);
      if (!domain) {
        result.errors.push(`Skip ${row.company}: missing domain`);
        continue;
      }

      const existing = await findAccountByDomain(domain);
      const liStatus = parseSeedStatus(row.status);
      const outreachStage = liStatusToOutreachStage(liStatus);
      const signalType = row.signal_type || classifySignalType(row.signal);

      const account = await upsertGtmAccount({
        company_name: row.company,
        domain,
        linkedin_url: null,
        industry: "Building Products",
        sub_industry: null,
        location: null,
        employee_count: null,
        revenue_estimate: null,
        description: null,
        vertical_id: null,
        case_study_match: null,
        first_source: "manual",
        apollo_id: null,
        provider_data: {
          website: websiteFromRow(row),
          li_signal_seed: true,
          seed_rank: row.rank ?? null,
        },
        notes: null,
        gtm_stage: existing?.gtm_stage || "signal_found",
      });

      await updateGtmAccount(account.id, {
        signal_score: row.score,
        signal_research_status: "has_signal",
        signal_researched_at: new Date().toISOString(),
        gtm_stage:
          liStatus === "booked"
            ? "audit_booked"
            : liStatus === "replied"
              ? "replied"
              : liStatus === "messaged"
                ? "contacted"
                : "signal_found",
        next_action:
          liStatus === "to_message"
            ? "Message on LinkedIn"
            : null,
      });

      // Replace prior seeded signals for a clean re-import
      await deleteSignalsForAccount(account.id);

      await createGtmSignal({
        account_id: account.id,
        list_id: null,
        signal_type: signalType,
        signal_source: "manual",
        evidence_summary: row.signal,
        sources: row.sources,
        evidence_url: row.sources[0]?.url || null,
        signal_date: row.sources[0]?.date || new Date().toISOString(),
        confidence_score: Math.min(100, row.score * 20),
        why_now_summary: row.signal,
        pain_hypothesis: null,
        action_recommendation: "Message the best contact on LinkedIn",
        review_status: "accepted",
      });

      const { supabaseAdmin } = await import("@/lib/db/client");
      await supabaseAdmin
        .from("gtm_accounts")
        .update({ signal_count: 1 })
        .eq("id", account.id);

      const contact = await upsertBestContact(
        account.id,
        row.best,
        row.best_title,
        row.best_li,
        outreachStage
      );

      // Optional emailed contact (secondary)
      if (row.emailed && row.emailed.trim().toLowerCase() !== row.best.trim().toLowerCase()) {
        const contacts = await getContactsForAccount(account.id);
        const emailedMatch = contacts.find(
          (c) => c.name.trim().toLowerCase() === row.emailed!.trim().toLowerCase()
        );
        if (!emailedMatch) {
          await createGtmContact({
            account_id: account.id,
            name: row.emailed,
            title: row.emailed_title ?? null,
            email: null,
            linkedin_url: row.emailed_li || null,
            phone: null,
            seniority: null,
            department: null,
            role_hypothesis: "Previously emailed",
            source: "manual",
            apollo_id: null,
            provider_data: {},
            relevance_score: 40,
            is_primary: false,
          });
        }
      }

      if (liStatus === "messaged" || liStatus === "replied" || liStatus === "booked") {
        await createGtmOutreachActivity({
          contact_id: contact.id,
          account_id: account.id,
          channel: "linkedin_dm",
          action_type: "seed_import",
          content: `Imported status: ${liStatus}`,
          status:
            liStatus === "replied" || liStatus === "booked" ? "replied" : "sent",
          responded_at:
            liStatus === "replied" || liStatus === "booked"
              ? new Date().toISOString()
              : null,
        });
      }

      if (existing) result.updated += 1;
      else result.imported += 1;
    } catch (err) {
      result.errors.push(
        `${row.company}: ${err instanceof Error ? err.message : "unknown error"}`
      );
    }
  }

  for (const name of input.no_signal || []) {
    try {
      const companyName = name.trim();
      if (!companyName) continue;

      // No domain for many no-signal names; store under synthetic domain key
      const slug = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const domain = `nosignal.local/${slug}`;

      const { data: byName } = await (
        await import("@/lib/db/client")
      ).supabaseAdmin
        .from("gtm_accounts")
        .select("*")
        .ilike("company_name", companyName)
        .limit(1)
        .maybeSingle();

      let accountId: string;
      if (byName) {
        await updateGtmAccount(byName.id, {
          signal_score: 0,
          signal_research_status: "no_signal",
          signal_researched_at: new Date().toISOString(),
        });
        accountId = byName.id;
      } else {
        const account = await upsertGtmAccount({
          company_name: companyName,
          domain: null,
          linkedin_url: null,
          industry: "Building Products",
          sub_industry: null,
          location: null,
          employee_count: null,
          revenue_estimate: null,
          description: null,
          vertical_id: null,
          case_study_match: null,
          first_source: "manual",
          apollo_id: null,
          provider_data: { no_signal_key: domain, li_signal_seed: true },
          notes: "Researched; no buying signal found",
          gtm_stage: "enriched",
        });
        await updateGtmAccount(account.id, {
          signal_score: 0,
          signal_research_status: "no_signal",
          signal_researched_at: new Date().toISOString(),
        });
        accountId = account.id;
      }
      void accountId;
      result.no_signal += 1;
    } catch (err) {
      result.errors.push(
        `no_signal ${name}: ${err instanceof Error ? err.message : "unknown error"}`
      );
    }
  }

  return result;
}

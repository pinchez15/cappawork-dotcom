import Anthropic from "@anthropic-ai/sdk";
import {
  classifySignalType,
  type LiSignalType,
  type SignalSource,
} from "@/lib/validators/li-signals";
import { enrichOrganization } from "@/lib/providers/apollo";
import {
  getGtmAccount,
  updateGtmAccount,
} from "@/server/repos/gtm-accounts";
import {
  createGtmContact,
  getContactsForAccount,
  setPrimaryContact,
  updateGtmContact,
} from "@/server/repos/gtm-contacts";
import {
  createGtmSignal,
  deleteSignalsForAccount,
} from "@/server/repos/gtm-signals";
import { getAccountsForList } from "@/server/repos/list-memberships";
import { logEnrichmentEvent } from "@/server/repos/list-runs";

const SYSTEM_PROMPT = `You are a buying-signal researcher for CappaWork LinkedIn outreach.

Find REAL, recent buying signals for the company. Do not invent anything.
Every signal MUST include at least one source with a real URL and a date (ISO date or "fetched YYYY-MM-DD").
If you cannot find a real signal with a source URL, return has_signal: false.

Allowed signal_type values:
- hiring_estimating: hiring for estimating, quoting, or preconstruction
- hiring_ai: hiring for AI, automation, or digital roles (highest value)
- growth: expansion, acquisition, or PE investment
- new_leader: new ops or tech leader
- leader_posting: leaders posting publicly about AI or efficiency

Score the company from 1 to 5 based on how strong and recent the signals are.
Boost toward 5 when hiring_ai is present.

Also suggest the best person to message (ops / preconstruction / president / COO preferred).
Include their LinkedIn profile URL only if you found a real /in/ URL. Otherwise leave linkedin_url null.

Return ONLY JSON:
{
  "has_signal": true,
  "score": 4,
  "signals": [
    {
      "signal_type": "hiring_estimating",
      "summary": "Plain English description of the signal.",
      "sources": [{ "label": "Careers page", "url": "https://...", "date": "2026-11-05" }]
    }
  ],
  "best_contact": {
    "name": "Full Name",
    "title": "Title",
    "linkedin_url": null
  },
  "notes": "Optional short note"
}

Rules:
- Never fabricate job posts, news, or LinkedIn URLs.
- Never write outreach scripts or message drafts.
- Prefer primary sources (careers pages, company news, LinkedIn posts, press).
- If nothing real is found, return { "has_signal": false, "score": 0, "signals": [], "best_contact": null, "notes": "No signal found" }.`;

type ResearchSignal = {
  signal_type: string;
  summary: string;
  sources: SignalSource[];
};

type ResearchResult = {
  has_signal: boolean;
  score: number;
  signals: ResearchSignal[];
  best_contact: {
    name: string;
    title: string | null;
    linkedin_url: string | null;
  } | null;
  notes: string | null;
};

function extractJson(text: string): ResearchResult | null {
  const matches = text.match(/\{[\s\S]*\}/g);
  if (!matches) return null;
  for (let i = matches.length - 1; i >= 0; i--) {
    try {
      const parsed = JSON.parse(matches[i]);
      if (typeof parsed.has_signal === "boolean") {
        return {
          has_signal: Boolean(parsed.has_signal),
          score: Number(parsed.score) || 0,
          signals: Array.isArray(parsed.signals) ? parsed.signals : [],
          best_contact: parsed.best_contact || null,
          notes: parsed.notes || null,
        };
      }
    } catch {
      // continue
    }
  }
  return null;
}

function sanitizeResearch(raw: ResearchResult): ResearchResult {
  const signals: ResearchSignal[] = [];
  for (const s of raw.signals || []) {
    const sources = (s.sources || []).filter(
      (src) =>
        src &&
        typeof src.url === "string" &&
        /^https?:\/\//i.test(src.url) &&
        typeof src.label === "string" &&
        src.label.trim() &&
        typeof src.date === "string" &&
        src.date.trim()
    );
    if (!sources.length || !s.summary?.trim()) continue;
    const type = (
      [
        "hiring_estimating",
        "hiring_ai",
        "growth",
        "new_leader",
        "leader_posting",
      ].includes(s.signal_type)
        ? s.signal_type
        : classifySignalType(s.summary)
    ) as LiSignalType;
    signals.push({
      signal_type: type,
      summary: s.summary.trim(),
      sources,
    });
  }

  let score = Math.max(0, Math.min(5, Math.round(raw.score || 0)));
  if (signals.some((s) => s.signal_type === "hiring_ai") && score < 5) {
    score = Math.min(5, score + 1);
  }

  return {
    has_signal: signals.length > 0,
    score: signals.length ? score || 1 : 0,
    signals,
    best_contact: raw.best_contact?.name
      ? {
          name: raw.best_contact.name,
          title: raw.best_contact.title || null,
          linkedin_url:
            raw.best_contact.linkedin_url &&
            /linkedin\.com\/in\//i.test(raw.best_contact.linkedin_url)
              ? raw.best_contact.linkedin_url
              : null,
        }
      : null,
    notes: raw.notes,
  };
}

async function gatherApolloHints(domain: string | null): Promise<string> {
  if (!domain) return "";
  try {
    const { organization } = await enrichOrganization(domain);
    if (!organization) return "";
    const parts = [
      organization.short_description
        ? `Description: ${organization.short_description}`
        : null,
      organization.estimated_num_employees
        ? `Employees: ${organization.estimated_num_employees}`
        : null,
      organization.industry ? `Industry: ${organization.industry}` : null,
      organization.keywords?.length
        ? `Keywords: ${organization.keywords.slice(0, 12).join(", ")}`
        : null,
    ].filter(Boolean);
    return parts.length
      ? `\nApollo org data (free enrich, no email reveal):\n${parts.join("\n")}`
      : "";
  } catch {
    return "";
  }
}

export async function researchAccountSignals(
  accountId: string,
  options?: { listId?: string; runId?: string }
): Promise<{
  account_id: string;
  result: ResearchResult;
}> {
  const account = await getGtmAccount(accountId);
  if (!account) throw new Error("Account not found");

  const apolloHints = await gatherApolloHints(account.domain);
  const client = new Anthropic();

  const userMessage = `Research buying signals for LinkedIn outreach.

Company: ${account.company_name}
Website / domain: ${account.domain ? `https://${account.domain}` : "Unknown"}
Industry: ${account.industry || "Unknown"}
Location: ${account.location || "Unknown"}
${apolloHints}

Search the company site careers page, LinkedIn company posts, recent news, expansions, PE deals, and hiring for estimating, preconstruction, AI, or digital roles.
Only return signals with real source URLs and dates.`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    tools: [
      {
        type: "web_search_20250305",
        name: "web_search",
        max_uses: 6,
      },
    ],
    messages: [{ role: "user", content: userMessage }],
  });

  const textBlocks = response.content.filter((b) => b.type === "text");
  const allText = textBlocks
    .map((b) => (b as { type: "text"; text: string }).text)
    .join("\n");
  const parsed = extractJson(allText);
  const result = sanitizeResearch(
    parsed || {
      has_signal: false,
      score: 0,
      signals: [],
      best_contact: null,
      notes: "Could not parse research response",
    }
  );

  await deleteSignalsForAccount(accountId);

  if (!result.has_signal) {
    await updateGtmAccount(accountId, {
      signal_score: 0,
      signal_research_status: "no_signal",
      signal_researched_at: new Date().toISOString(),
      signal_count: 0,
      notes: result.notes || account.notes,
    });
  } else {
    for (const signal of result.signals) {
      await createGtmSignal({
        account_id: accountId,
        list_id: options?.listId || null,
        signal_type: signal.signal_type,
        signal_source: "web_search",
        evidence_summary: signal.summary,
        sources: signal.sources,
        evidence_url: signal.sources[0]?.url || null,
        signal_date: signal.sources[0]?.date || new Date().toISOString(),
        confidence_score: Math.min(100, result.score * 20),
        why_now_summary: signal.summary,
        pain_hypothesis: null,
        action_recommendation: "Message the best contact on LinkedIn",
        review_status: "accepted",
      });
    }

    await updateGtmAccount(accountId, {
      signal_score: result.score,
      signal_research_status: "has_signal",
      signal_researched_at: new Date().toISOString(),
      signal_count: result.signals.length,
      gtm_stage:
        account.gtm_stage === "discovered" || account.gtm_stage === "list_built"
          ? "signal_found"
          : account.gtm_stage,
      next_action: "Message on LinkedIn",
      notes: result.notes || account.notes,
    });

    if (result.best_contact) {
      const contacts = await getContactsForAccount(accountId);
      const match = contacts.find(
        (c) =>
          c.name.trim().toLowerCase() ===
          result.best_contact!.name.trim().toLowerCase()
      );
      if (match) {
        const updated = await updateGtmContact(match.id, {
          title: result.best_contact.title ?? match.title,
          linkedin_url:
            result.best_contact.linkedin_url || match.linkedin_url,
          relevance_score: Math.max(match.relevance_score, 90),
        });
        await setPrimaryContact(accountId, updated.id);
      } else {
        const created = await createGtmContact({
          account_id: accountId,
          name: result.best_contact.name,
          title: result.best_contact.title,
          email: null,
          linkedin_url: result.best_contact.linkedin_url,
          phone: null,
          seniority: null,
          department: null,
          role_hypothesis: "Best person to message",
          source: "web_search",
          apollo_id: null,
          provider_data: {},
          relevance_score: 90,
          is_primary: true,
        });
        await setPrimaryContact(accountId, created.id);
      }
    }
  }

  if (options?.runId) {
    await logEnrichmentEvent({
      list_run_id: options.runId,
      account_id: accountId,
      provider: "anthropic",
      event_type: "ai_enrich",
      fields_updated: ["signals", "signal_score", "best_contact"],
      credits_consumed: 0,
      success: true,
      raw_response: result as unknown as Record<string, unknown>,
    });
  }

  return { account_id: accountId, result };
}

export async function researchListSignals(
  listId: string,
  accountIds?: string[]
): Promise<{ researched: number; with_signal: number; no_signal: number }> {
  let ids = accountIds;
  if (!ids?.length) {
    const memberships = await getAccountsForList(listId);
    ids = memberships.map((m) => m.id);
  }

  let withSignal = 0;
  let noSignal = 0;
  for (const id of ids) {
    const { result } = await researchAccountSignals(id, { listId });
    if (result.has_signal) withSignal += 1;
    else noSignal += 1;
  }

  return { researched: ids.length, with_signal: withSignal, no_signal: noSignal };
}

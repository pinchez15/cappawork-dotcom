import { z } from "zod";

export const LI_SIGNAL_TYPES = [
  {
    value: "hiring_estimating",
    label: "Hiring for estimating",
    description: "Hiring for estimating, quoting, or preconstruction",
    highlight: false,
    color: "bg-blue-100 text-blue-700",
  },
  {
    value: "hiring_ai",
    label: "Hiring for AI / digital",
    description: "Hiring for AI, automation, or digital roles",
    highlight: true,
    color: "bg-green-100 text-green-700",
  },
  {
    value: "growth",
    label: "Growth",
    description: "Expansion, acquisition, or PE investment",
    highlight: false,
    color: "bg-amber-100 text-amber-700",
  },
  {
    value: "new_leader",
    label: "New ops / tech leader",
    description: "New operations or technology leader",
    highlight: false,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    value: "leader_posting",
    label: "Leader posting on AI",
    description: "Leaders posting publicly about AI or efficiency",
    highlight: false,
    color: "bg-teal-100 text-teal-700",
  },
] as const;

export type LiSignalType = (typeof LI_SIGNAL_TYPES)[number]["value"];

/** UI status labels Nate uses; mapped to gtm_contacts.outreach_stage */
export const LI_OUTREACH_STATUSES = [
  {
    value: "to_message",
    label: "To message",
    outreach_stage: "not_started",
    color: "bg-stone-100 text-stone-600",
  },
  {
    value: "messaged",
    label: "Messaged",
    outreach_stage: "dm_sent",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    value: "replied",
    label: "Replied",
    outreach_stage: "replied",
    color: "bg-green-200 text-green-800",
  },
  {
    value: "booked",
    label: "Booked",
    outreach_stage: "call_booked",
    color: "bg-green-100 text-green-700",
  },
] as const;

export type LiOutreachStatus = (typeof LI_OUTREACH_STATUSES)[number]["value"];

export const signalSourceSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1).refine((u) => /^https?:\/\//i.test(u), {
    message: "Source URL must start with http(s)",
  }),
  date: z.string().min(1),
});

export type SignalSource = z.infer<typeof signalSourceSchema>;

export const updateSignalStatusSchema = z.object({
  status: z.enum(["to_message", "messaged", "replied", "booked"]),
  contact_id: z.string().uuid().optional(),
});

export const researchSignalsSchema = z.object({
  account_id: z.string().uuid().optional(),
  list_id: z.string().uuid().optional(),
  account_ids: z.array(z.string().uuid()).optional(),
});

export const importSignalRowSchema = z
  .object({
    domain: z.string().optional().nullable(),
    company: z.string().min(1),
    website: z.string().optional().nullable(),
    score: z.number().int().min(0).max(5),
    rank: z.number().int().optional(),
    status: z.string().optional(),
    signal: z.string().min(1),
    sources: z.array(signalSourceSchema).min(1),
    best: z.string().min(1),
    best_title: z.string().optional().nullable(),
    best_li: z.string().optional().nullable(),
    emailed: z.string().optional().nullable(),
    emailed_title: z.string().optional().nullable(),
    emailed_li: z.string().optional().nullable(),
    signal_type: z.string().optional(),
  })
  .transform((row) => {
    let domain = (row.domain || "").trim();
    if (!domain && row.website) {
      try {
        const withProtocol = row.website.startsWith("http")
          ? row.website
          : `https://${row.website}`;
        domain = new URL(withProtocol).hostname.replace(/^www\./, "");
      } catch {
        domain = row.website
          .replace(/^(https?:\/\/)?(www\.)?/i, "")
          .split("/")[0];
      }
    }
    return { ...row, domain };
  })
  .refine((row) => Boolean(row.domain), {
    message: "domain or website is required",
    path: ["domain"],
  });

export const importSignalsSchema = z.object({
  signals: z.array(importSignalRowSchema).default([]),
  no_signal: z.array(z.string()).default([]),
});

export function outreachStageToLiStatus(stage: string | null | undefined): LiOutreachStatus {
  switch (stage) {
    case "dm_sent":
    case "email_sent":
    case "follow_up_sent":
    case "breakup_sent":
    case "warming_up":
    case "connected":
      return "messaged";
    case "replied":
      return "replied";
    case "call_booked":
      return "booked";
    default:
      return "to_message";
  }
}

export function liStatusToOutreachStage(status: LiOutreachStatus): string {
  const row = LI_OUTREACH_STATUSES.find((s) => s.value === status);
  return row?.outreach_stage ?? "not_started";
}

/** Map UI/seed status labels to internal status keys */
export function parseSeedStatus(raw: string | null | undefined): LiOutreachStatus {
  const s = (raw || "").trim().toLowerCase();
  if (s === "messaged" || s === "dm sent" || s === "dm_sent") return "messaged";
  if (s === "replied") return "replied";
  if (s === "booked" || s === "call booked" || s === "call_booked") return "booked";
  return "to_message";
}

export function classifySignalType(summary: string): LiSignalType {
  const t = summary.toLowerCase();
  if (
    /\b(ai implementation|ai agent|ai lead|machine learning|digital transformation|automation engineer|data engineer)\b/.test(
      t
    ) ||
    (/\bhiring\b/.test(t) && /\b(ai|digital|automation)\b/.test(t))
  ) {
    return "hiring_ai";
  }
  if (
    /\b(estimator|estimating|takeoff|preconstruction|quoting|quote|shop drawing)\b/.test(t)
  ) {
    return "hiring_estimating";
  }
  if (
    /\b(pe |private equity|acquisition|acquired|expansion|expanded|grand opening|plant addition|new location|majority stake)\b/.test(
      t
    )
  ) {
    return "growth";
  }
  if (
    /\b(appointed|named|hired as|elevated to|new (coo|cto|vp|president|ceo)|joined as)\b/.test(
      t
    )
  ) {
    return "new_leader";
  }
  if (/\b(posted|posting|linkedin post|wrote about|talking about)\b/.test(t) && /\b(ai|efficien)/.test(t)) {
    return "leader_posting";
  }
  if (/\b(ai|efficien)/.test(t) && /\b(post|linkedin)\b/.test(t)) {
    return "leader_posting";
  }
  return "hiring_estimating";
}

export function linkedInPeopleSearchUrl(name: string, company: string): string {
  const keywords = encodeURIComponent(`${name} ${company}`.trim());
  return `https://www.linkedin.com/search/results/people/?keywords=${keywords}`;
}

export function resolveLinkedInUrl(
  linkedinUrl: string | null | undefined,
  name: string,
  company: string
): string {
  const url = (linkedinUrl || "").trim();
  if (url && /linkedin\.com\/in\//i.test(url)) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  if (url && /linkedin\.com\/search/i.test(url)) {
    return url.startsWith("http") ? url : `https://${url}`;
  }
  return linkedInPeopleSearchUrl(name, company);
}

/** Ranking score: base 1-5, +1 effective boost for hiring_ai (capped display still 1-5) */
export function rankingWeight(score: number, signalTypes: string[]): number {
  const hasAi = signalTypes.includes("hiring_ai");
  return score * 10 + (hasAi ? 5 : 0);
}

import { PORTFOLIO_PROJECTS } from "@/lib/portfolio/data";
import type { GtmAccount } from "@/server/repos/gtm-accounts";
import type { ListSearchCriteria } from "@/lib/validators/list-builder";

export type ScoreResult = {
  score: number;
  breakdown: Record<string, number>;
  caseStudyMatch: string | null;
  nextAction: string;
};

export function calculateFitScore(
  account: Partial<GtmAccount>,
  criteria: ListSearchCriteria | null,
  verticalTier: number | null
): ScoreResult {
  const breakdown: Record<string, number> = {};

  if (account.industry && criteria?.industries?.length) {
    const industryLower = account.industry.toLowerCase();
    const match = criteria.industries.some((i) =>
      industryLower.includes(i.toLowerCase())
    );
    breakdown.industry_fit = match ? 20 : 8;
  } else {
    breakdown.industry_fit = account.industry ? 12 : 5;
  }

  if (account.employee_count && criteria) {
    const min = criteria.employee_min || 0;
    const max = criteria.employee_max || 10000;
    if (account.employee_count >= min && account.employee_count <= max) {
      breakdown.employee_fit = 15;
    } else if (
      account.employee_count >= min * 0.7 &&
      account.employee_count <= max * 1.3
    ) {
      breakdown.employee_fit = 8;
    } else {
      breakdown.employee_fit = 3;
    }
  } else {
    breakdown.employee_fit = 5;
  }

  const tier = verticalTier || 2;
  breakdown.vertical_tier = tier === 1 ? 15 : tier === 2 ? 10 : 5;
  breakdown.founder_led = Math.round((account.founder_led_score || 0) * 0.15);

  const caseStudy = matchCaseStudy(account);
  breakdown.case_study_match = caseStudy ? 15 : 5;
  breakdown.revenue_fit = account.revenue_estimate ? 10 : 4;

  let completeness = 0;
  if (account.domain) completeness += 3;
  if (account.linkedin_url) completeness += 2;
  if (account.description) completeness += 3;
  if (account.location) completeness += 2;
  breakdown.data_completeness = completeness;

  const score = Math.min(100, Object.values(breakdown).reduce((a, b) => a + b, 0));

  return {
    score,
    breakdown,
    caseStudyMatch: caseStudy,
    nextAction: deriveNextAction(score, account),
  };
}

export function calculatePainScore(
  account: Partial<GtmAccount>,
  criteria: ListSearchCriteria | null
): ScoreResult {
  const breakdown: Record<string, number> = {};
  const desc = (account.description || "").toLowerCase();
  const industry = (account.industry || "").toLowerCase();

  const manualKeywords = ["manual", "spreadsheet", "excel", "paper", "email", "inbox", "intake"];
  breakdown.manual_workflow = manualKeywords.some((k) => desc.includes(k)) ? 15 : 6;

  const opsHeavy = ["healthcare", "property", "management", "consulting", "financial", "advisory"];
  breakdown.operational_complexity = opsHeavy.some((k) => industry.includes(k)) ? 14 : 7;

  if (account.employee_count && account.employee_count > 30) breakdown.scale_pain = 12;
  else if (account.employee_count && account.employee_count > 15) breakdown.scale_pain = 8;
  else breakdown.scale_pain = 4;

  const reportKeywords = ["report", "compliance", "document", "audit", "tracking"];
  breakdown.reporting_burden = reportKeywords.some((k) => desc.includes(k)) ? 12 : 5;

  const toolKeywords = ["system", "platform", "software", "tool", "integration"];
  breakdown.tool_fragmentation = toolKeywords.some((k) => desc.includes(k)) ? 10 : 5;

  breakdown.signal_boost = Math.min(12, (account.signal_count || 0) * 4);

  if (criteria?.website_keywords?.length) {
    const match = criteria.website_keywords.some((k) => desc.includes(k.toLowerCase()));
    breakdown.website_signals = match ? 12 : 4;
  } else {
    breakdown.website_signals = 5;
  }

  const handoffKeywords = ["coordination", "vendor", "client", "patient", "owner"];
  breakdown.handoff_complexity = handoffKeywords.some((k) => desc.includes(k)) ? 10 : 4;

  const score = Math.min(100, Object.values(breakdown).reduce((a, b) => a + b, 0));

  return {
    score,
    breakdown,
    caseStudyMatch: matchCaseStudy(account),
    nextAction: deriveNextAction(account.fit_score || score, account),
  };
}

export function calculateContactRelevance(
  title: string | null,
  criteria: ListSearchCriteria | null
): number {
  if (!title) return 20;
  const titleLower = title.toLowerCase();
  const priorityTitles = criteria?.job_titles?.length
    ? criteria.job_titles
    : ["founder", "ceo", "coo", "owner", "president", "operations"];

  for (const t of priorityTitles) {
    if (titleLower.includes(t.toLowerCase())) return 95;
  }

  const goodTitles = ["director", "vp", "head", "manager", "partner", "administrator"];
  for (const t of goodTitles) {
    if (titleLower.includes(t)) return 70;
  }

  return 30;
}

export function estimateFounderLedScore(account: Partial<GtmAccount>): number {
  let score = 40;
  const employees = account.employee_count || 0;
  if (employees > 0 && employees < 50) score += 25;
  else if (employees < 150) score += 15;
  else score += 5;

  const desc = (account.description || "").toLowerCase();
  if (desc.includes("founder") || desc.includes("family")) score += 15;
  if (desc.includes("private") || desc.includes("independent")) score += 10;

  return Math.min(100, score);
}

function matchCaseStudy(account: Partial<GtmAccount>): string | null {
  const industry = (account.industry || "").toLowerCase();
  for (const project of PORTFOLIO_PROJECTS) {
    const projIndustry = project.industry.toLowerCase();
    if (
      industry.includes(projIndustry) ||
      projIndustry.includes(industry) ||
      (industry.includes("health") && projIndustry.includes("health")) ||
      (industry.includes("property") && projIndustry.includes("property")) ||
      (industry.includes("data") && projIndustry.includes("data")) ||
      (industry.includes("consult") && projIndustry.includes("consult"))
    ) {
      return project.name;
    }
  }
  return null;
}

function deriveNextAction(fitScore: number, account: Partial<GtmAccount>): string {
  const stage = account.gtm_stage;
  if (stage && !["discovered", "list_built"].includes(stage)) {
    return account.next_action || "Continue pipeline";
  }
  if (fitScore >= 75) return "Generate hypothesis → promote to pipeline";
  if (fitScore >= 55) return "Enrich contacts → review signals";
  if (fitScore >= 35) return "Enrich account data";
  return "Review or reject";
}

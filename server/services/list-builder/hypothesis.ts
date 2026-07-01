import Anthropic from "@anthropic-ai/sdk";
import { PORTFOLIO_PROJECTS } from "@/lib/portfolio/data";
import { getGtmAccountDetail } from "@/server/repos/gtm-accounts";
import { createGtmHypothesis } from "@/server/repos/gtm-hypotheses";
import { getList } from "@/server/repos/lists";
import { ICP_TEMPLATES } from "@/lib/list-builder/icp-templates";

const anthropic = new Anthropic();

export async function generateHypothesis(accountId: string, listId?: string) {
  const account = await getGtmAccountDetail(accountId);
  if (!account) throw new Error("Account not found");

  const list = listId ? await getList(listId) : null;
  const template = list?.icp_template
    ? ICP_TEMPLATES.find((t) => t.id === list.icp_template)
    : null;

  const portfolioContext = PORTFOLIO_PROJECTS.map(
    (p) => `- ${p.name} (${p.industry}): ${p.description}`
  ).join("\n");

  const contactsContext = (account.contacts as { name: string; title: string | null }[])
    .map((c) => `${c.name}, ${c.title || "unknown title"}`)
    .join("; ");

  const signalsContext = (account.signals as { signal_type: string; evidence_summary: string }[])
    .map((s) => `${s.signal_type}: ${s.evidence_summary}`)
    .join("; ");

  const prompt = `You are a GTM strategist for CappaWork, a founder-led advisory that helps businesses identify and modernize "computer work" — manual workflows, spreadsheets, email routing, reporting burden, and tool fragmentation.

Analyze this prospect account and generate a sales hypothesis.

COMPANY:
- Name: ${account.company_name}
- Industry: ${account.industry || "unknown"}
- Location: ${account.location || "unknown"}
- Employees: ${account.employee_count || "unknown"}
- Revenue: ${account.revenue_estimate || "unknown"}
- Description: ${account.description || "none"}
- Fit Score: ${account.fit_score}/100
- Pain Score: ${account.pain_score}/100
- Case Study Match: ${account.case_study_match || "none"}

CONTACTS: ${contactsContext || "none found"}
SIGNALS: ${signalsContext || "none detected"}
ICP: ${template?.name || list?.name || "general"}
RECOMMENDED OFFER: ${template?.recommended_offer || "Free Computer Work Audit"}

CappaWork Portfolio:
${portfolioContext}

Return ONLY valid JSON:
{
  "likely_pain": "1-2 sentences",
  "relevant_workflow": "specific workflow",
  "relevant_proof": "which CappaWork project and why",
  "recommended_offer": "Free Computer Work Audit, Discover Sprint, Discover Deep, or Build",
  "outreach_angle": "2-3 sentences",
  "suggested_first_question": "opening audit question",
  "suggested_email_draft": "3-4 sentence cold email",
  "suggested_linkedin_message": "2-3 sentence LinkedIn message",
  "confidence_score": 0-100,
  "uncertainty_notes": "what we don't know"
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].type === "text" ? response.content[0].text : "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Failed to parse hypothesis response");

  const parsed = JSON.parse(jsonMatch[0]);

  const hypothesis = await createGtmHypothesis({
    account_id: accountId,
    list_id: listId || null,
    likely_pain: parsed.likely_pain,
    relevant_workflow: parsed.relevant_workflow,
    relevant_proof: parsed.relevant_proof,
    recommended_offer: parsed.recommended_offer,
    outreach_angle: parsed.outreach_angle,
    suggested_first_question: parsed.suggested_first_question,
    suggested_email_draft: parsed.suggested_email_draft,
    suggested_linkedin_message: parsed.suggested_linkedin_message,
    confidence_score: parsed.confidence_score || 50,
    approval_status: "draft",
    is_ai_generated: true,
  });

  return { hypothesis, uncertainty: parsed.uncertainty_notes };
}

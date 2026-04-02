import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { requireAdmin } from "@/lib/auth/guards";
import {
  createProspect,
  getProspects,
  updateProspect,
  calculatePriorityScore,
  calculateEnrichmentStatus,
  SEQUENCE_STAGES,
} from "@/server/repos/prospects";
import {
  createDeal,
  getDealsByStage,
  updateDeal,
  moveDeal,
  STAGES,
} from "@/server/repos/bd-deals";
import {
  createCatalyst,
  getCatalysts,
  updateCatalyst,
  CATEGORIES,
  RELATIONSHIPS,
} from "@/server/repos/bd-catalysts";
import { getVerticals } from "@/server/repos/verticals";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic();

const TOOLS: Anthropic.Tool[] = [
  {
    name: "create_prospect",
    description:
      "Create a new prospect company in the BD pipeline. Use when the user wants to add a company to track.",
    input_schema: {
      type: "object" as const,
      properties: {
        company_name: { type: "string", description: "Company name" },
        estimated_revenue: {
          type: "string",
          description: "$3M-$5M, $5M-$10M, $10M+, or null",
        },
        location: { type: "string", description: "City, State" },
        website: { type: "string", description: "Company website URL" },
        vertical_match: {
          type: "string",
          description: "Best matching vertical name from available list",
        },
        decision_maker_name: { type: "string", description: "CEO/Owner name" },
        decision_maker_title: { type: "string", description: "Their title" },
        linkedin_url: { type: "string", description: "LinkedIn profile URL" },
        key_pain_point: {
          type: "string",
          description: "Likely operational pain point",
        },
        trigger_event: { type: "string", description: "Recent trigger event" },
        trigger_event_source: {
          type: "string",
          enum: [
            "linkedin_post",
            "job_posting",
            "news",
            "ai_generated",
          ],
        },
        tech_stack_signal: { type: "string", description: "Visible tech/tools" },
        personalized_first_line: {
          type: "string",
          description: "Personalized opening line for outreach",
        },
        cold_email_hook: { type: "string", description: "Punchy email opener" },
      },
      required: ["company_name"],
    },
  },
  {
    name: "query_prospects",
    description:
      "Query and filter the prospect list. Use when the user wants to see, search, or filter prospects.",
    input_schema: {
      type: "object" as const,
      properties: {
        sequence_stage: {
          type: "string",
          description: "Filter by sequence stage",
        },
        enrichment_status: {
          type: "string",
          description: "Filter by enrichment status: raw, partially_enriched, fully_enriched, stale",
        },
        tier: {
          type: "number",
          description: "Filter by vertical tier (1, 2, or 3)",
        },
        limit: {
          type: "number",
          description: "Max results to return (default 20)",
        },
      },
      required: [],
    },
  },
  {
    name: "update_prospect",
    description:
      "Update a prospect record. Use when the user wants to change a prospect's stage, fields, or status. Searches by company name to find the prospect.",
    input_schema: {
      type: "object" as const,
      properties: {
        company_name: {
          type: "string",
          description: "Company name to search for",
        },
        sequence_stage: { type: "string", description: "New sequence stage" },
        decision_maker_name: { type: "string" },
        decision_maker_title: { type: "string" },
        linkedin_url: { type: "string" },
        key_pain_point: { type: "string" },
        trigger_event: { type: "string" },
        location: { type: "string" },
        estimated_revenue: { type: "string" },
        website: { type: "string" },
      },
      required: ["company_name"],
    },
  },
  {
    name: "create_deal",
    description:
      "Create a new deal/lead in the pipeline. Use when the user wants to add a deal or lead.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: {
          type: "string",
          description: "Deal name (company or contact name)",
        },
        company: { type: "string" },
        contact_name: { type: "string" },
        contact_title: { type: "string" },
        email: { type: "string" },
        linkedin_url: { type: "string" },
        value: { type: "number", description: "Deal value in dollars" },
        source: {
          type: "string",
          enum: ["linkedin", "referral", "inbound", "calculator", "other"],
        },
        referral_partner: { type: "string" },
        notes: { type: "string" },
      },
      required: ["name"],
    },
  },
  {
    name: "query_deals",
    description:
      "Query the deal pipeline. Shows deals grouped by stage. Use when the user asks about deals, pipeline, or revenue.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "move_deal",
    description:
      "Move a deal to a different pipeline stage. Searches by deal name.",
    input_schema: {
      type: "object" as const,
      properties: {
        deal_name: { type: "string", description: "Deal name to search for" },
        new_stage: {
          type: "string",
          enum: ["lead", "contacted", "discovery", "proposal", "won", "lost"],
          description: "Target stage",
        },
      },
      required: ["deal_name", "new_stage"],
    },
  },
  {
    name: "create_catalyst",
    description:
      "Create a new referral catalyst (CPA, attorney, coach, etc). Use when the user wants to add a referral partner.",
    input_schema: {
      type: "object" as const,
      properties: {
        name: { type: "string", description: "Full name" },
        company: { type: "string" },
        title: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        linkedin_url: { type: "string" },
        category: {
          type: "string",
          enum: [
            "cpa",
            "attorney",
            "coach",
            "fractional",
            "eos",
            "insurance",
            "banker",
            "consultant",
            "peer",
            "other",
          ],
        },
        relationship: {
          type: "string",
          enum: ["cold", "warm", "strong", "champion"],
        },
        notes: { type: "string" },
        next_action: { type: "string" },
      },
      required: ["name"],
    },
  },
  {
    name: "query_catalysts",
    description:
      "Query the catalyst list. Use when the user asks about catalysts or referral partners.",
    input_schema: {
      type: "object" as const,
      properties: {},
      required: [],
    },
  },
  {
    name: "update_catalyst",
    description:
      "Update a catalyst record. Searches by name.",
    input_schema: {
      type: "object" as const,
      properties: {
        catalyst_name: {
          type: "string",
          description: "Catalyst name to search for",
        },
        relationship: {
          type: "string",
          enum: ["cold", "warm", "strong", "champion"],
        },
        next_action: { type: "string" },
        next_contact_date: {
          type: "string",
          description: "YYYY-MM-DD format",
        },
        notes: { type: "string" },
        company: { type: "string" },
        title: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        category: { type: "string" },
      },
      required: ["catalyst_name"],
    },
  },
];

function buildSystemPrompt(context: {
  page: string;
  summary: string;
  capabilities: string[];
} | null) {
  const verticalNote = "Verticals will be fetched dynamically when creating prospects.";

  const stageList = SEQUENCE_STAGES.map((s) => `${s.value} (${s.label})`).join(
    ", "
  );
  const dealStageList = STAGES.map((s) => `${s.id} (${s.label})`).join(", ");
  const categoryList = CATEGORIES.map(
    (c) => `${c.value} (${c.label})`
  ).join(", ");
  const relationshipList = RELATIONSHIPS.map(
    (r) => `${r.value} (${r.label})`
  ).join(", ");

  let contextBlock = "";
  if (context) {
    contextBlock = `\n\nCurrent page: ${context.page}\nPage summary: ${context.summary}\nAvailable capabilities on this page: ${context.capabilities.join(", ")}`;
  }

  return `You are a BD operations assistant for CappaWork, an AI transformation consultancy targeting founder-led service businesses ($3M-$10M revenue).

You help manage the BD pipeline through natural language commands. Use the provided tools to create, query, and update records. For questions or explanations, respond with plain text.${contextBlock}

Reference data:
- Prospect sequence stages: ${stageList}
- Deal pipeline stages: ${dealStageList}
- Catalyst categories: ${categoryList}
- Catalyst relationships: ${relationshipList}

Rules:
- Use tools for any action (creating, querying, updating records)
- For queries, summarize results conversationally — don't dump raw JSON
- When creating prospects, always set the stage to "not_started"
- When creating deals, always set the stage to "lead"
- For prospect updates, search by company_name (fuzzy match is fine)
- Keep responses concise and actionable
- If the user's intent is unclear, ask a clarifying question rather than guessing`;
}

type ToolInput = Record<string, unknown>;

async function executeTool(
  name: string,
  input: ToolInput
): Promise<{ result: string; actionTaken: boolean }> {
  switch (name) {
    case "create_prospect": {
      const verticals = await getVerticals();
      let verticalId: string | null = null;
      let verticalTier: number | null = null;

      if (input.vertical_match) {
        const match = verticals.find(
          (v) =>
            v.name.toLowerCase() ===
            (input.vertical_match as string).toLowerCase()
        );
        if (match) {
          verticalId = match.id;
          verticalTier = match.tier;
        }
      }

      const prospectData = {
        vertical_id: verticalId,
        company_name: input.company_name as string,
        estimated_revenue: (input.estimated_revenue as string) || null,
        location: (input.location as string) || null,
        website: (input.website as string) || null,
        decision_maker_name: (input.decision_maker_name as string) || null,
        decision_maker_title: (input.decision_maker_title as string) || null,
        linkedin_url: (input.linkedin_url as string) || null,
        email_verified: null,
        email_source: null,
        key_pain_point: (input.key_pain_point as string) || null,
        why_closes_fast: null,
        trigger_event: (input.trigger_event as string) || null,
        trigger_event_source: (input.trigger_event_source as string) || null,
        trigger_event_date: null,
        tech_stack_signal: (input.tech_stack_signal as string) || null,
        tech_stack_source: null,
        personalized_first_line:
          (input.personalized_first_line as string) || null,
        cold_email_hook: (input.cold_email_hook as string) || null,
        sales_nav_search_tip: null,
        sequence_stage: "not_started" as const,
      };

      const { score, breakdown } = calculatePriorityScore(
        prospectData,
        verticalTier
      );
      const enrichmentStatus = calculateEnrichmentStatus(prospectData);

      const prospect = await createProspect({
        ...prospectData,
        priority_score: score,
        score_breakdown: breakdown,
        enrichment_status: enrichmentStatus,
      });

      return {
        result: `Created prospect "${prospect.company_name}" (score: ${score}, stage: not_started)`,
        actionTaken: true,
      };
    }

    case "query_prospects": {
      const filters: {
        sequence_stage?: string;
        enrichment_status?: string;
        tier?: number;
        limit?: number;
      } = {};
      if (input.sequence_stage) filters.sequence_stage = input.sequence_stage as string;
      if (input.enrichment_status) filters.enrichment_status = input.enrichment_status as string;
      if (input.tier) filters.tier = input.tier as number;
      filters.limit = (input.limit as number) || 20;

      const { prospects, total } = await getProspects(filters);
      const lines = prospects.map(
        (p) =>
          `- ${p.company_name} | ${p.vertical_name || "no vertical"} (T${p.vertical_tier || "?"}) | ${p.sequence_stage} | score: ${p.priority_score} | ${p.enrichment_status}${p.location ? ` | ${p.location}` : ""}`
      );

      return {
        result: `Found ${total} prospects (showing ${prospects.length}):\n${lines.join("\n")}`,
        actionTaken: false,
      };
    }

    case "update_prospect": {
      const { prospects } = await getProspects({ limit: 200 });
      const searchName = (input.company_name as string).toLowerCase();
      const match = prospects.find(
        (p) =>
          p.company_name.toLowerCase() === searchName ||
          p.company_name.toLowerCase().includes(searchName)
      );

      if (!match) {
        return {
          result: `No prospect found matching "${input.company_name}"`,
          actionTaken: false,
        };
      }

      const { company_name: _, ...updates } = input;
      const cleaned: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates)) {
        if (v !== undefined && v !== null) cleaned[k] = v;
      }

      const updated = await updateProspect(match.id, cleaned);
      return {
        result: `Updated "${updated.company_name}": ${Object.keys(cleaned).join(", ")} changed`,
        actionTaken: true,
      };
    }

    case "create_deal": {
      const deal = await createDeal({
        name: (input.name as string) || "Untitled Lead",
        company: (input.company as string) || null,
        contact_name: (input.contact_name as string) || null,
        contact_title: (input.contact_title as string) || null,
        email: (input.email as string) || null,
        linkedin_url: (input.linkedin_url as string) || null,
        value: (input.value as number) || null,
        stage: "lead",
        source: (input.source as string) || "other",
        referral_partner: (input.referral_partner as string) || null,
        catalyst_id: null,
        expected_close_date: null,
        follow_up_date: null,
        next_action: null,
        notes: (input.notes as string) || null,
      });

      return {
        result: `Created deal "${deal.name}" in Lead stage${deal.value ? ` ($${deal.value.toLocaleString()})` : ""}`,
        actionTaken: true,
      };
    }

    case "query_deals": {
      const stages = await getDealsByStage();
      const lines = stages
        .filter((s) => s.deals.length > 0)
        .map((s) => {
          const total = s.deals.reduce((sum, d) => sum + (d.value || 0), 0);
          const dealNames = s.deals.map((d) => d.name).join(", ");
          return `${s.stageId}: ${s.deals.length} deal${s.deals.length !== 1 ? "s" : ""}${total > 0 ? ` ($${total.toLocaleString()})` : ""} — ${dealNames}`;
        });

      return {
        result: lines.length > 0 ? lines.join("\n") : "No deals in pipeline.",
        actionTaken: false,
      };
    }

    case "move_deal": {
      const allStages = await getDealsByStage();
      const allDeals = allStages.flatMap((s) => s.deals);
      const searchName = (input.deal_name as string).toLowerCase();
      const deal = allDeals.find(
        (d) =>
          d.name.toLowerCase() === searchName ||
          d.name.toLowerCase().includes(searchName)
      );

      if (!deal) {
        return {
          result: `No deal found matching "${input.deal_name}"`,
          actionTaken: false,
        };
      }

      const targetStage = allStages.find(
        (s) => s.stageId === input.new_stage
      );
      const newOrder = targetStage ? targetStage.deals.length : 0;

      await moveDeal(deal.id, input.new_stage as string, newOrder);
      return {
        result: `Moved "${deal.name}" from ${deal.stage} to ${input.new_stage}`,
        actionTaken: true,
      };
    }

    case "create_catalyst": {
      const catalyst = await createCatalyst({
        name: (input.name as string) || "Unknown",
        company: (input.company as string) || null,
        title: (input.title as string) || null,
        email: (input.email as string) || null,
        phone: (input.phone as string) || null,
        linkedin_url: (input.linkedin_url as string) || null,
        category: (input.category as string) || "other",
        relationship: (input.relationship as string) || "cold",
        notes: (input.notes as string) || null,
        last_contact_date: null,
        next_contact_date: null,
        next_action: (input.next_action as string) || null,
      });

      return {
        result: `Created catalyst "${catalyst.name}" (${catalyst.category}, ${catalyst.relationship})`,
        actionTaken: true,
      };
    }

    case "query_catalysts": {
      const catalysts = await getCatalysts();
      if (catalysts.length === 0) {
        return { result: "No catalysts found.", actionTaken: false };
      }

      const lines = catalysts.map(
        (c) =>
          `- ${c.name}${c.company ? ` @ ${c.company}` : ""} | ${c.category} | ${c.relationship}${c.next_action ? ` | next: ${c.next_action}` : ""}`
      );

      return {
        result: `${catalysts.length} catalysts:\n${lines.join("\n")}`,
        actionTaken: false,
      };
    }

    case "update_catalyst": {
      const catalysts = await getCatalysts();
      const searchName = (input.catalyst_name as string).toLowerCase();
      const match = catalysts.find(
        (c) =>
          c.name.toLowerCase() === searchName ||
          c.name.toLowerCase().includes(searchName)
      );

      if (!match) {
        return {
          result: `No catalyst found matching "${input.catalyst_name}"`,
          actionTaken: false,
        };
      }

      const { catalyst_name: _, ...updates } = input;
      const cleaned: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates)) {
        if (v !== undefined && v !== null) cleaned[k] = v;
      }

      const updated = await updateCatalyst(match.id, cleaned);
      return {
        result: `Updated "${updated.name}": ${Object.keys(cleaned).join(", ")} changed`,
        actionTaken: true,
      };
    }

    default:
      return { result: `Unknown tool: ${name}`, actionTaken: false };
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();

    const { messages, context } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(context);

    // Build Anthropic messages format
    const apiMessages: Anthropic.MessageParam[] = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })
    );

    let actionTaken = false;

    // Tool-use loop: send to Claude, execute tools, feed results back
    let currentMessages = [...apiMessages];

    for (let i = 0; i < 5; i++) {
      const response = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: systemPrompt,
        tools: TOOLS,
        messages: currentMessages,
      });

      // Check if there are tool_use blocks
      const toolUseBlocks = response.content.filter(
        (b) => b.type === "tool_use"
      );

      if (toolUseBlocks.length === 0) {
        // No tools — extract final text response
        const textBlocks = response.content.filter((b) => b.type === "text");
        const finalText = textBlocks
          .map((b) => (b as { type: "text"; text: string }).text)
          .join("\n")
          .trim();

        return NextResponse.json({
          message: finalText || "Done.",
          action_taken: actionTaken,
        });
      }

      // Execute each tool and build tool results
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of toolUseBlocks) {
        if (block.type !== "tool_use") continue;
        try {
          const { result, actionTaken: took } = await executeTool(
            block.name,
            block.input as ToolInput
          );
          if (took) actionTaken = true;
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: result,
          });
        } catch (err) {
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
            is_error: true,
          });
        }
      }

      // Feed results back for the next iteration
      currentMessages = [
        ...currentMessages,
        { role: "assistant" as const, content: response.content },
        { role: "user" as const, content: toolResults },
      ];
    }

    // If we exhausted the loop, return whatever we have
    return NextResponse.json({
      message:
        "Completed — but the operation required more steps than expected. Check if your request was fulfilled.",
      action_taken: actionTaken,
    });
  } catch (error) {
    console.error("Command panel error:", error);
    return NextResponse.json(
      { error: "Failed to process command" },
      { status: 500 }
    );
  }
}

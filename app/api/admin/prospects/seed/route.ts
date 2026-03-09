import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import {
  createProspect,
  calculatePriorityScore,
  calculateEnrichmentStatus,
} from "@/server/repos/prospects";
import { getVerticals, createVertical } from "@/server/repos/verticals";
import { supabaseAdmin } from "@/lib/db/client";

export const runtime = "nodejs";

// Accepts JSON array of prospects (and optionally verticals)
// Format: { verticals?: [...], prospects: [...] }
export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    const body = await request.json();

    let existingVerticals = await getVerticals();

    // Seed verticals if provided
    if (body.verticals && Array.isArray(body.verticals)) {
      for (const v of body.verticals) {
        const exists = existingVerticals.find(
          (ev) => ev.name.toLowerCase() === v.name?.toLowerCase()
        );
        if (!exists && v.name) {
          try {
            const created = await createVertical({
              name: v.name,
              tier: v.tier || 2,
              close_speed: v.close_speed || 5,
              ai_awareness: v.ai_awareness || 5,
              automation_pain: v.automation_pain || 5,
              rationale: v.rationale || null,
              sales_nav_boolean: v.sales_nav_boolean || null,
              google_alert_string: v.google_alert_string || null,
              job_posting_keywords: v.job_posting_keywords || [],
              signal_indicators: v.signal_indicators || [],
            });
            existingVerticals.push(created);
          } catch {
            // Skip duplicates
          }
        }
      }
    }

    // Seed prospects
    let created = 0;
    let skipped = 0;
    let lastError: string | null = null;

    if (body.prospects && Array.isArray(body.prospects)) {
      for (const p of body.prospects) {
        if (!p.company_name) {
          skipped++;
          continue;
        }

        // Match vertical by name
        let verticalId: string | null = null;
        let verticalTier: number | null = null;
        if (p.vertical) {
          const match = existingVerticals.find(
            (v) => v.name.toLowerCase() === p.vertical.toLowerCase()
          );
          if (match) {
            verticalId = match.id;
            verticalTier = match.tier;
          }
        }

        // Normalize sequence stage to match DB check constraint
        const stageRaw = (p.sequence_stage || "not_started")
          .toLowerCase()
          .replace(/\s+/g, "_");
        const validStages = [
          "not_started", "warming_up", "connected", "dm_sent", "email_sent",
          "follow_up_sent", "breakup_sent", "nurture", "call_booked",
          "diagnostic_sold", "lost", "disqualified",
        ];
        const sequenceStage = validStages.includes(stageRaw) ? stageRaw : "not_started";

        // Normalize trigger_event_source and tech_stack_source
        const validTriggerSources = ["linkedin_post", "job_posting", "news", "manual", "ai_generated"];
        const validTechSources = ["job_posting", "website", "linkedin", "ai_generated"];
        const triggerSource = p.trigger_event_source && validTriggerSources.includes(p.trigger_event_source)
          ? p.trigger_event_source : null;
        const techSource = p.tech_stack_source && validTechSources.includes(p.tech_stack_source)
          ? p.tech_stack_source : null;

        const prospectData = {
          vertical_id: verticalId,
          company_name: p.company_name,
          estimated_revenue: p.estimated_revenue || null,
          location: p.location || null,
          website: p.website || null,
          decision_maker_name: p.decision_maker_name || null,
          decision_maker_title: p.decision_maker_title || null,
          linkedin_url: p.linkedin_url || null,
          email_verified: p.email_verified || null,
          email_source: p.email_source || null,
          key_pain_point: p.key_pain_point || null,
          why_closes_fast: p.why_closes_fast || null,
          trigger_event: p.trigger_event || null,
          trigger_event_source: triggerSource,
          trigger_event_date: null, // Date parsing handled during enrichment
          tech_stack_signal: p.tech_stack_signal || null,
          tech_stack_source: techSource,
          personalized_first_line: p.personalized_first_line || null,
          cold_email_hook: p.cold_email_hook || null,
          sales_nav_search_tip: p.sales_nav_search_tip || null,
          sequence_stage: sequenceStage,
        };

        const { score, breakdown } = calculatePriorityScore(
          prospectData,
          verticalTier
        );
        const enrichmentStatus = calculateEnrichmentStatus(prospectData);

        try {
          await createProspect({
            ...prospectData,
            priority_score: score,
            score_breakdown: breakdown,
            enrichment_status: enrichmentStatus,
          });
          created++;
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : JSON.stringify(err);
          console.error(`Failed to create prospect "${p.company_name}":`, msg);
          lastError = msg;
          skipped++;
        }
      }
    }

    // Seed outreach templates if provided
    let templatesCreated = 0;
    if (body.templates && Array.isArray(body.templates)) {
      for (const t of body.templates) {
        if (!t.body_template) continue;
        try {
          await supabaseAdmin.from("outreach_templates").insert({
            sequence_tier: t.sequence_tier || 1,
            step_number: t.step_number || 1,
            channel: t.channel || "other",
            template_name: t.template_name || "Untitled",
            subject_line: t.subject_line || null,
            body_template: t.body_template,
            is_active: t.is_active !== false,
          });
          templatesCreated++;
        } catch {
          // Skip duplicates
        }
      }
    }

    return NextResponse.json({
      created,
      skipped,
      verticals_count: existingVerticals.length,
      templates_created: templatesCreated,
      message: `Seeded ${created} prospects (${skipped} skipped). ${existingVerticals.length} verticals, ${templatesCreated} templates.${lastError ? ` Last error: ${lastError}` : ""}`,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Seed failed" },
      { status: 500 }
    );
  }
}

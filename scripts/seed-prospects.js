#!/usr/bin/env node
/**
 * Seed script — reads the Excel file and outputs JSON for the seed API.
 *
 * Usage:
 *   node scripts/seed-prospects.js /path/to/cappawork_prospect_list.xlsx > seed-data.json
 *
 * Then POST seed-data.json to /api/admin/prospects/seed
 * Or use: node scripts/seed-prospects.js /path/to/file.xlsx --post https://cappawork.com/api/admin/prospects/seed
 */

const XLSX = require("xlsx");
const path = require("path");

const filePath = process.argv[2] || path.join(__dirname, "../cappawork_prospect_list.xlsx");
const wb = XLSX.readFile(filePath);

// --- Parse Verticals ---
const vSheet = wb.Sheets["Vertical Rankings"];
const vRows = XLSX.utils.sheet_to_json(vSheet, { header: 1 });

function parseTier(tierStr) {
  if (!tierStr) return 2;
  const s = String(tierStr);
  if (s.includes("1")) return 1;
  if (s.includes("2")) return 2;
  if (s.includes("3")) return 3;
  return 2;
}

// Also grab Sales Nav filters
const sfSheet = wb.Sheets["Sales Nav Filters"];
const sfRows = XLSX.utils.sheet_to_json(sfSheet, { header: 1 });
const salesNavMap = {};
for (let i = 3; i < sfRows.length; i++) {
  const r = sfRows[i];
  if (r && r[0]) {
    salesNavMap[r[0].toLowerCase()] = {
      sales_nav_boolean: r[4] || null,
    };
  }
}

const verticals = [];
for (let i = 4; i <= 18; i++) {
  const r = vRows[i];
  if (!r || !r[1]) continue;

  const name = r[1];
  const nameLower = name.toLowerCase();
  const salesNav = Object.entries(salesNavMap).find(([k]) => nameLower.includes(k) || k.includes(nameLower.split(" ")[0].toLowerCase()));

  verticals.push({
    name,
    tier: parseTier(r[2]),
    close_speed: r[3] || 5,
    ai_awareness: r[4] || 5,
    automation_pain: r[5] || 5,
    rationale: r[7] || null,
    sales_nav_boolean: salesNav ? salesNav[1].sales_nav_boolean : null,
  });
}

// --- Parse 200 Prospects ---
const pSheet = wb.Sheets["200 Prospect List"];
const pRows = XLSX.utils.sheet_to_json(pSheet, { header: 1 });
// Headers at row 3: #, Company Name, Vertical, Tier, Est. Revenue, Location, Key Pain Point, Why They Close Fast, LinkedIn Sales Nav Search Tip, Cold Email Hook, Status, Decision Maker, Title, LinkedIn URL, Email, Trigger Event, Tech Stack, Priority Score, Personalized First Line, Sequence Stage

const prospects = [];
for (let i = 4; i < pRows.length; i++) {
  const r = pRows[i];
  if (!r || !r[1]) continue;

  const vertical = r[2] || "";
  const triggerEvent = r[15] || null;
  const techStack = r[16] || null;

  // Map trigger/tech source
  let triggerSource = null;
  if (triggerEvent) {
    const t = triggerEvent.toLowerCase();
    if (t.includes("linkedin")) triggerSource = "linkedin_post";
    else if (t.includes("job") || t.includes("hiring") || t.includes("posted")) triggerSource = "job_posting";
    else if (t.includes("news") || t.includes("announced") || t.includes("expansion")) triggerSource = "news";
    else triggerSource = "ai_generated";
  }

  let techSource = null;
  if (techStack) {
    const ts = techStack.toLowerCase();
    if (ts.includes("[") || ts.includes("manual") || ts.includes("spreadsheet")) techSource = "ai_generated";
    else techSource = "ai_generated";
  }

  // Clean decision maker placeholders
  const dm = r[11];
  const dmName = dm && !dm.includes("[") ? dm : null;
  const dmTitle = r[12];
  const title = dmTitle && !dmTitle.includes("[") ? dmTitle : null;
  const linkedin = r[13];
  const linkedinUrl = linkedin && !linkedin.includes("[") ? linkedin : null;
  const email = r[14];
  const emailVerified = email && !email.includes("[") ? email : null;

  // Map sequence stage
  const stageRaw = (r[19] || "Not Started").toLowerCase().replace(/\s+/g, "_");
  const stageMap = {
    not_started: "not_started",
    warming_up: "warming_up",
    connected: "connected",
    dm_sent: "dm_sent",
    email_sent: "email_sent",
    follow_up_sent: "follow_up_sent",
    breakup_sent: "breakup_sent",
    nurture: "nurture",
    call_booked: "call_booked",
    diagnostic_sold: "diagnostic_sold",
    lost: "lost",
    disqualified: "disqualified",
  };

  prospects.push({
    company_name: r[1],
    vertical,
    estimated_revenue: r[4] || null,
    location: r[5] || null,
    key_pain_point: r[6] || null,
    why_closes_fast: r[7] || null,
    sales_nav_search_tip: r[8] || null,
    cold_email_hook: r[9] || null,
    decision_maker_name: dmName,
    decision_maker_title: title,
    linkedin_url: linkedinUrl,
    email_verified: emailVerified,
    trigger_event: triggerEvent,
    trigger_event_source: triggerSource,
    tech_stack_signal: techStack,
    tech_stack_source: techSource,
    personalized_first_line: r[18] || null,
    sequence_stage: stageMap[stageRaw] || "not_started",
  });
}

// --- Parse Outreach Sequences for templates ---
const oSheet = wb.Sheets["Outreach Sequences"];
const oRows = XLSX.utils.sheet_to_json(oSheet, { header: 1 });
// Headers at row 3: Step, Day, Channel, Action/Script, Why This Works, If They Respond, Stage Update

const templates = [];
let currentTier = 1;

for (let i = 4; i < oRows.length; i++) {
  const r = oRows[i];
  if (!r) continue;

  // Check for tier header rows
  const firstCell = String(r[0] || "");
  if (firstCell.includes("TIER 1")) { currentTier = 1; continue; }
  if (firstCell.includes("TIER 2")) { currentTier = 2; continue; }
  if (firstCell.includes("TIER 3")) { currentTier = 3; continue; }

  if (!r[0] || !r[2]) continue;

  const channelRaw = String(r[2] || "").toLowerCase();
  let channel = "other";
  if (channelRaw.includes("linkedin") && channelRaw.includes("dm")) channel = "linkedin_dm";
  else if (channelRaw.includes("linkedin")) channel = "linkedin_engage";
  else if (channelRaw.includes("email")) channel = "email";
  else if (channelRaw.includes("phone")) channel = "phone";

  templates.push({
    sequence_tier: currentTier,
    step_number: parseInt(r[0]) || i,
    channel,
    template_name: `Tier ${currentTier} - Step ${r[0]} - ${r[2]}`,
    body_template: r[3] || "",
    is_active: true,
  });
}

const output = {
  verticals,
  prospects,
  templates,
  summary: {
    verticals: verticals.length,
    prospects: prospects.length,
    templates: templates.length,
  },
};

console.log(JSON.stringify(output, null, 2));

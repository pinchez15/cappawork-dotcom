import { createPhase, createTask } from "@/server/repos/kanban";

export type ServiceTier = "portal_build" | "diagnostic" | "implementation";

interface PhaseTemplate {
  name: string;
  order: number;
}

interface TaskTemplate {
  title: string;
  description: string;
}

interface TierTemplate {
  phases: PhaseTemplate[];
  tasks: Record<string, TaskTemplate[]>;
}

// Standard kanban columns for all project types
const KANBAN_PHASES: PhaseTemplate[] = [
  { name: "Upcoming", order: 0 },
  { name: "To Do", order: 1 },
  { name: "In Progress", order: 2 },
  { name: "Needs Review", order: 3 },
  { name: "Done", order: 4 },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1: Custom Portal / Dashboard Build — $10,000 | 6–10 weeks
// ─────────────────────────────────────────────────────────────────────────────

const PORTAL_BUILD_TEMPLATE: TierTemplate = {
  phases: KANBAN_PHASES,
  tasks: {
    "To Do": [
      // Week 1–2: Discovery & Requirements
      { title: "Kickoff call", description: "Align on goals, timeline, success criteria, and key stakeholders" },
      { title: "Access & credentials handoff", description: "Provide logins, API keys, data sources, and system access needed for build" },
      { title: "Current workflow documentation", description: "Map existing processes, tools, and pain points from kickoff notes" },
      { title: "Data source inventory", description: "Catalog all data sources, formats, volumes, and integration points" },
      { title: "User interviews (up to 3)", description: "Short calls with key users to understand daily workflows and friction" },
      { title: "Requirements document draft", description: "Written spec: features, data flows, user roles, and success metrics" },
      { title: "Requirements review & sign-off", description: "Client reviews and approves requirements doc — changes after this are scoped separately" },
    ],
    "Upcoming": [
      // Week 3–4: Architecture & Design
      { title: "Technical architecture plan", description: "Database schema, API design, hosting, and integration approach" },
      { title: "Wireframes / UI mockups", description: "Visual mockups of key screens and user flows for client review" },
      { title: "Wireframe review & feedback", description: "Client reviews mockups and provides consolidated feedback" },
      { title: "Design revisions (1 round)", description: "Incorporate client feedback into final design direction" },
      { title: "Design sign-off", description: "Approve final wireframes — this is what we build" },
      { title: "Data pipeline design", description: "Map how data flows in, gets processed, and surfaces in the portal" },
      { title: "Development environment setup", description: "Repo, CI/CD, staging environment, auth scaffolding" },
      // Week 5–7: Build
      { title: "Core platform build", description: "Authentication, navigation, user roles, base infrastructure" },
      { title: "Data integration & pipeline", description: "Connect data sources, build ETL/sync, validate data integrity" },
      { title: "Dashboard / reporting views", description: "Build primary dashboard screens per approved designs" },
      { title: "Client-facing portal features", description: "Build the features and views the client's customers/team will use" },
      { title: "Mid-build demo", description: "Live walkthrough of progress — chance to flag issues early" },
      { title: "Mid-build feedback", description: "Provide written feedback from demo within 3 business days" },
      { title: "AI workflow integration", description: "Implement any AI-driven automations scoped in requirements" },
      { title: "Notification & alert system", description: "Email/in-app notifications for key events and thresholds" },
      // Week 8–9: Testing & Refinement
      { title: "Internal QA & bug fixes", description: "Full test pass — functionality, edge cases, mobile, permissions" },
      { title: "Data validation", description: "Verify all data displays correctly, calculations are accurate" },
      { title: "Client UAT (user acceptance testing)", description: "Client tests the portal against real scenarios and flags issues" },
      { title: "UAT bug fixes & refinements", description: "Resolve issues surfaced during client testing" },
      { title: "Performance & security review", description: "Load testing, security audit, backup verification" },
      { title: "Final design polish", description: "UI tightening, micro-interactions, responsive fixes" },
      // Week 10: Launch & Handoff
      { title: "Team training session", description: "Live walkthrough with client team — recorded for future reference" },
      { title: "Admin documentation", description: "How to manage users, update content, troubleshoot common issues" },
      { title: "Production deployment", description: "Deploy to production, DNS, SSL, final environment config" },
      { title: "Go-live monitoring (72 hrs)", description: "Monitor for errors, performance issues, and data sync problems" },
      { title: "Post-launch check-in", description: "1-week post-launch call — what's working, what needs adjustment" },
      { title: "30-day support window opens", description: "Bug fixes and minor adjustments included for 30 days post-launch" },
      { title: "Project retrospective", description: "Internal debrief — lessons learned, reusable components, case study notes" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2: Phase 1 — Scale & Margin Diagnostic — $30,000 | 4–6 weeks
// ─────────────────────────────────────────────────────────────────────────────

const DIAGNOSTIC_TEMPLATE: TierTemplate = {
  phases: KANBAN_PHASES,
  tasks: {
    "To Do": [
      // Week 1: Kickoff & Access
      { title: "Kickoff call", description: "Align on goals, concerns, timeline, and what success looks like" },
      { title: "Data access & credentials", description: "Provide access to financial systems, P&L, CRM, tools, and any reporting" },
      { title: "Team roster & org chart", description: "Who does what — roles, responsibilities, reporting lines" },
      { title: "Software stack inventory", description: "List of all tools, subscriptions, and integrations currently in use" },
      { title: "Founder priorities interview", description: "60-min deep dive with founder on biggest pain points and growth goals" },
      { title: "Stakeholder interview scheduling", description: "Schedule 3–5 interviews with key team members across functions" },
    ],
    "Upcoming": [
      // Week 2: Financial Analysis
      { title: "P&L deep dive (trailing 24 months)", description: "Analyze revenue, COGS, margins, and expense trends over time" },
      { title: "Revenue segmentation analysis", description: "Break down revenue by customer, product/service, channel, and geography" },
      { title: "Margin decomposition by segment", description: "Identify which segments are profitable and which are margin-negative" },
      { title: "Revenue per employee modeling", description: "Benchmark current efficiency and model path to $10M" },
      { title: "Software stack cost analysis", description: "Total spend, per-user cost, overlap, and ROI assessment" },
      { title: "Stakeholder interviews (batch 1)", description: "Interviews with 2–3 team members on workflow, bottlenecks, time sinks" },
      // Week 3: Operational Mapping
      { title: "End-to-end workflow mapping", description: "Map core business processes from lead to cash to delivery to support" },
      { title: "Stakeholder interviews (batch 2)", description: "Remaining 2–3 interviews focused on operational detail" },
      { title: "Time allocation analysis", description: "Estimate how team time splits across value-add vs. manual/admin work" },
      { title: "Bottleneck identification", description: "Pinpoint where work stalls, queues, or requires manual intervention" },
      { title: "Data quality assessment", description: "Evaluate state of client's data — completeness, accuracy, accessibility" },
      { title: "Progress check-in", description: "Brief update to founder on emerging themes — no deliverable yet" },
      // Week 4: Analysis & Opportunity Sizing
      { title: "Automation opportunity identification", description: "List every process that could be automated, AI-assisted, or eliminated" },
      { title: "Dollar-impact modeling per opportunity", description: "Quantify each opportunity: time saved, cost reduced, margin gained" },
      { title: "Prioritization matrix (impact vs. effort)", description: "Rank all opportunities by ROI and implementation complexity" },
      { title: "Quick wins identification", description: "Flag anything that can be fixed in <1 week with outsized impact" },
      { title: "Risk & dependency mapping", description: "Identify what blocks what — sequencing constraints and prerequisites" },
      // Week 5: Deliverable Build
      { title: "Draft diagnostic report", description: "Compile findings into structured deliverable with executive summary" },
      { title: "Implementation roadmap draft", description: "Phased plan with timelines, costs, and expected ROI per initiative" },
      { title: "Internal review & QA", description: "Verify all numbers, pressure-test recommendations, refine narrative" },
      { title: "Final report design & formatting", description: "Polish deliverable for client presentation" },
      // Week 6: Delivery & Decision
      { title: "Diagnostic readout (live presentation)", description: "60–90 min session walking through findings, opportunities, and roadmap" },
      { title: "Diagnostic report delivered", description: "Final written deliverable — PDF + supporting data" },
      { title: "Q&A follow-up session", description: "Scheduled within 1 week of readout for follow-up questions" },
      { title: "Phase 2 scoping (if applicable)", description: "If client proceeds, define scope, timeline, and investment for build phase" },
      { title: "Go/no-go recommendation", description: "Honest assessment — is Phase 2 worth it, or should client execute internally" },
      { title: "Case study notes & retrospective", description: "Document outcomes, lessons learned, and reusable frameworks" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3: Phase 2 — Custom System Build — $50,000+ | 8–14 weeks
// ─────────────────────────────────────────────────────────────────────────────

const IMPLEMENTATION_TEMPLATE: TierTemplate = {
  phases: KANBAN_PHASES,
  tasks: {
    "To Do": [
      // Week 1: Scoping & Planning
      { title: "Phase 2 kickoff call", description: "Review diagnostic findings, confirm build priorities, align on scope" },
      { title: "Statement of work finalized", description: "Formal scope document with deliverables, timeline, milestones, investment" },
      { title: "SOW review & sign-off", description: "Client approves SOW — work begins on approval" },
      { title: "Success metrics defined", description: "Agree on measurable outcomes: margin target, time saved, efficiency gains" },
      { title: "Technical requirements spec", description: "Translate diagnostic recommendations into build requirements" },
      { title: "Data migration / cleanup plan", description: "Plan for moving and cleaning client data into new systems" },
    ],
    "Upcoming": [
      // Week 2–3: Design & Architecture
      { title: "System architecture design", description: "Technical blueprint: data model, integrations, infrastructure" },
      { title: "UI/UX wireframes", description: "Visual mockups of dashboards, workflows, and key interfaces" },
      { title: "Wireframe review & feedback", description: "Client reviews and provides feedback within 5 business days" },
      { title: "Design revisions & sign-off", description: "Finalize designs — this is the blueprint for the build" },
      { title: "AI workflow specification", description: "Define exactly what gets automated, triggers, logic, and fallbacks" },
      { title: "Integration mapping", description: "Document all connections to existing tools and data sources" },
      { title: "Change management plan", description: "How we'll transition the team: communication, training, rollout sequence" },
      // Week 4–7: Core Build
      { title: "Platform infrastructure", description: "Auth, hosting, CI/CD, base application framework" },
      { title: "Data migration & cleanup execution", description: "Move, clean, deduplicate, and structure client data" },
      { title: "Data validation checkpoint", description: "Client spot-checks migrated data for accuracy" },
      { title: "Core workflow build — Priority 1", description: "Build the highest-ROI system identified in diagnostic" },
      { title: "Bi-weekly progress demo #1", description: "Live demo of work in progress — flag issues early" },
      { title: "Client feedback (demo #1)", description: "Written feedback within 3 business days" },
      { title: "Core workflow build — Priority 2", description: "Build the second-highest priority system" },
      { title: "AI automation implementation", description: "Build and test AI-driven workflows and automations" },
      { title: "Dashboard & reporting build", description: "Real-time dashboards tied to the new operational data" },
      { title: "Bi-weekly progress demo #2", description: "Second progress demo — system should be substantially functional" },
      { title: "Client feedback (demo #2)", description: "Written feedback within 3 business days" },
      // Week 8–10: Integration & Refinement
      { title: "Third-party integrations", description: "Connect to existing tools (accounting, CRM, email, etc.)" },
      { title: "Integration testing", description: "Verify all data flows correctly between systems" },
      { title: "Refinement sprint", description: "Address all feedback from demos — polish features and UX" },
      { title: "Internal QA — full test pass", description: "Functionality, edge cases, permissions, mobile, performance" },
      { title: "Bi-weekly progress demo #3", description: "Near-final demo — should feel ready for real use" },
      { title: "Security & permissions audit", description: "Verify access controls, data protection, and backup systems" },
      // Week 11–12: Testing & Training
      { title: "Client UAT (user acceptance testing)", description: "Client team tests system against real workflows for 1 week" },
      { title: "UAT issue resolution", description: "Fix everything surfaced in UAT" },
      { title: "Team training — session 1 (core users)", description: "Hands-on training with daily users — recorded" },
      { title: "Team training — session 2 (admin/owner)", description: "Admin functions, configuration, and troubleshooting for founder/ops lead" },
      { title: "Training documentation & SOPs", description: "Written guides for all key workflows and admin functions" },
      { title: "AI workflow training", description: "How the automations work, what to monitor, when to intervene" },
      // Week 13–14: Launch & Stabilize
      { title: "Staged rollout plan", description: "Plan for phased go-live — not everything at once if team is large" },
      { title: "Production deployment", description: "Deploy to production environment" },
      { title: "Go-live monitoring (1 week)", description: "Active monitoring for errors, data issues, and performance" },
      { title: "Daily check-in (launch week)", description: "Quick daily standup during first week live — 15 min max" },
      { title: "Post-launch optimization", description: "Performance tuning, minor UX fixes based on real usage" },
      { title: "30-day support window opens", description: "Bug fixes and minor adjustments included for 30 days" },
      { title: "Baseline metrics snapshot", description: "Document current state of all success metrics for ROI tracking" },
      { title: "30-day ROI check-in", description: "Review metrics against targets — what's working, what needs adjustment" },
      { title: "90-day ROI review (scheduled)", description: "Scheduled future check-in to measure sustained impact" },
      { title: "Project retrospective", description: "Internal debrief — lessons, reusable components, case study potential" },
      { title: "Case study draft (if permitted)", description: "Draft client success story for marketing (pending client approval)" },
    ],
  },
};

// Template registry
const TIER_TEMPLATES: Record<ServiceTier, TierTemplate> = {
  portal_build: PORTAL_BUILD_TEMPLATE,
  diagnostic: DIAGNOSTIC_TEMPLATE,
  implementation: IMPLEMENTATION_TEMPLATE,
};

export async function initializeKanbanForProject(
  projectId: string,
  serviceTier?: ServiceTier
) {
  // Use tier-specific template or default to diagnostic
  const template = serviceTier
    ? TIER_TEMPLATES[serviceTier]
    : TIER_TEMPLATES.diagnostic;

  const phases = [];

  // Create all phases (kanban columns)
  for (const phaseTemplate of template.phases) {
    const phase = await createPhase(
      projectId,
      phaseTemplate.name,
      phaseTemplate.order
    );
    phases.push(phase);

    // Create tasks for this phase
    const tasks = template.tasks[phaseTemplate.name] || [];
    for (let i = 0; i < tasks.length; i++) {
      await createTask(projectId, phase.id, {
        title: tasks[i].title,
        description: tasks[i].description,
        orderIndex: i,
      });
    }
  }

  return phases;
}

// Export for reference
export { TIER_TEMPLATES };

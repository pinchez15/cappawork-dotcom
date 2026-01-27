import { createPhase, createTask } from "@/server/repos/kanban";

export type ServiceTier = "internal_tool" | "scale_ready" | "commercial_product";

interface PhaseTemplate {
  name: string;
  order: number;
}

interface TierTemplate {
  phases: PhaseTemplate[];
  tasks: Record<string, string[]>;
}

// Internal Tool ($9,900) - Core rebuild with clean architecture
const INTERNAL_TOOL_TEMPLATE: TierTemplate = {
  phases: [
    { name: "Discovery", order: 0 },
    { name: "Architecture", order: 1 },
    { name: "Backend", order: 2 },
    { name: "Frontend", order: 3 },
    { name: "Polish", order: 4 },
    { name: "Handoff", order: 5 },
  ],
  tasks: {
    Discovery: [
      "Requirements gathering",
      "PRD creation",
      "Technical scoping",
    ],
    Architecture: [
      "Design system selection",
      "Component library setup",
      "Project structure",
    ],
    Backend: [
      "Database schema design",
      "Clerk Auth integration",
      "Supabase configuration",
      "API structure",
    ],
    Frontend: [
      "Clean UI rebuild",
      "Core components",
      "Feature pages",
      "State management",
    ],
    Polish: [
      "Mobile responsive",
      "Accessibility audit",
      "Performance optimization",
    ],
    Handoff: [
      "Deployment setup",
      "30-day support kickoff",
      "Credential transfer",
      "Documentation",
    ],
  },
};

// Scale-Ready ($14,900) - Internal Tool + scalability features
const SCALE_READY_TEMPLATE: TierTemplate = {
  phases: [
    { name: "Discovery", order: 0 },
    { name: "Architecture", order: 1 },
    { name: "Backend", order: 2 },
    { name: "Frontend", order: 3 },
    { name: "Analytics", order: 4 },
    { name: "Polish", order: 5 },
    { name: "Handoff", order: 6 },
  ],
  tasks: {
    Discovery: [
      "Requirements gathering",
      "PRD creation",
      "Technical scoping",
      "Scalability assessment",
    ],
    Architecture: [
      "Design system selection",
      "Component library setup",
      "Scalable DB schema design",
      "Project structure",
    ],
    Backend: [
      "Database implementation",
      "Clerk Auth integration",
      "RBAC implementation",
      "Supabase configuration",
      "API structure",
    ],
    Frontend: [
      "Clean UI rebuild",
      "Core components",
      "Feature pages",
      "State management",
      "Role-based UI",
    ],
    Analytics: [
      "PostHog integration",
      "Event tracking setup",
      "Dashboard configuration",
      "User journey tracking",
    ],
    Polish: [
      "Mobile responsive",
      "Accessibility audit",
      "Performance optimization",
      "Load testing",
    ],
    Handoff: [
      "Deployment setup",
      "45-day support kickoff",
      "Credential transfer",
      "Documentation",
      "Team training",
    ],
  },
};

// Commercial Product ($24,900) - Scale-Ready + monetization & integrations
const COMMERCIAL_PRODUCT_TEMPLATE: TierTemplate = {
  phases: [
    { name: "Discovery", order: 0 },
    { name: "Architecture", order: 1 },
    { name: "Backend", order: 2 },
    { name: "Integrations", order: 3 },
    { name: "Frontend", order: 4 },
    { name: "Analytics", order: 5 },
    { name: "Landing Page", order: 6 },
    { name: "Polish", order: 7 },
    { name: "Handoff", order: 8 },
  ],
  tasks: {
    Discovery: [
      "Requirements gathering",
      "PRD creation",
      "Technical scoping",
      "Scalability assessment",
      "Integration planning",
    ],
    Architecture: [
      "Design system selection",
      "Component library setup",
      "Scalable DB schema design",
      "Multi-tenant architecture",
      "Project structure",
    ],
    Backend: [
      "Database implementation",
      "Clerk Auth integration",
      "RBAC implementation",
      "Supabase configuration",
      "API structure",
    ],
    Integrations: [
      "Stripe billing setup",
      "Subscription management",
      "AI workflow integration",
      "Third-party API connections",
      "Webhook handlers",
    ],
    Frontend: [
      "Clean UI rebuild",
      "Core components",
      "Feature pages",
      "State management",
      "Role-based UI",
      "Billing UI",
    ],
    Analytics: [
      "PostHog integration",
      "Event tracking setup",
      "Dashboard configuration",
      "User journey tracking",
      "Conversion tracking",
    ],
    "Landing Page": [
      "Marketing page design",
      "Pricing page",
      "Feature showcase",
      "SEO optimization",
      "Social meta tags",
    ],
    Polish: [
      "Mobile responsive",
      "Accessibility audit",
      "Performance optimization",
      "Load testing",
      "Security audit",
    ],
    Handoff: [
      "Production deployment",
      "60-day support kickoff",
      "Credential transfer",
      "Documentation",
      "Team training",
      "Launch support",
    ],
  },
};

// Template registry
const TIER_TEMPLATES: Record<ServiceTier, TierTemplate> = {
  internal_tool: INTERNAL_TOOL_TEMPLATE,
  scale_ready: SCALE_READY_TEMPLATE,
  commercial_product: COMMERCIAL_PRODUCT_TEMPLATE,
};

// Legacy template for backwards compatibility (defaults to internal_tool)
const PHASE_TEMPLATE = INTERNAL_TOOL_TEMPLATE.phases;
const TASK_TEMPLATE = INTERNAL_TOOL_TEMPLATE.tasks;

export async function initializeKanbanForProject(
  projectId: string,
  serviceTier?: ServiceTier
) {
  // Use tier-specific template or default to internal_tool
  const template = serviceTier
    ? TIER_TEMPLATES[serviceTier]
    : TIER_TEMPLATES.internal_tool;

  const phases = [];

  // Create all phases
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
        title: tasks[i],
        orderIndex: i,
      });
    }
  }

  return phases;
}

// Export for reference
export { TIER_TEMPLATES, PHASE_TEMPLATE, TASK_TEMPLATE };

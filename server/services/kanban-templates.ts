import { createPhase, createTask } from "@/server/repos/kanban";

const PHASE_TEMPLATE = [
  { name: "Discovery", order: 0 },
  { name: "Design Selection", order: 1 },
  { name: "Backend", order: 2 },
  { name: "Frontend", order: 3 },
  { name: "Polish", order: 4 },
  { name: "Handoff", order: 5 },
];

const TASK_TEMPLATE: Record<string, string[]> = {
  Discovery: [
    "Requirements gathering",
    "PRD creation",
    "Technical scoping",
    "Design brief",
  ],
  "Design Selection": [
    "Theme selection",
    "Color customization",
    "Typography",
    "Component style",
  ],
  Backend: [
    "Database schema",
    "Authentication setup",
    "API structure",
    "Integrations",
  ],
  Frontend: [
    "Layout system",
    "Core components",
    "Feature pages",
    "State management",
  ],
  Polish: [
    "Mobile responsive",
    "Accessibility",
    "Performance",
    "Bug fixes",
  ],
  Handoff: [
    "Domain setup",
    "Deployment",
    "Documentation",
    "Credential transfer",
    "Training",
  ],
};

export async function initializeKanbanForProject(projectId: string) {
  const phases = [];

  // Create all phases
  for (const phaseTemplate of PHASE_TEMPLATE) {
    const phase = await createPhase(
      projectId,
      phaseTemplate.name,
      phaseTemplate.order
    );
    phases.push(phase);

    // Create tasks for this phase
    const tasks = TASK_TEMPLATE[phaseTemplate.name] || [];
    for (let i = 0; i < tasks.length; i++) {
      await createTask(projectId, phase.id, {
        title: tasks[i],
        orderIndex: i,
      });
    }
  }

  return phases;
}


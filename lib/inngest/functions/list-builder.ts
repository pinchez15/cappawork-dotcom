import { inngest } from "@/lib/inngest/client";
import {
  runListGeneration,
  runListEnrichment,
  runListScoring,
  runHypothesisGeneration,
  runPromote,
  importCsvAccounts,
} from "@/server/services/list-builder/runner";

export const listBuilderGenerate = inngest.createFunction(
  { id: "list-builder-generate", retries: 2, triggers: [{ event: "list-builder/generate" }] },
  async ({ event }) => {
    const { listId, runId } = event.data as { listId: string; runId: string };
    return runListGeneration(listId, runId);
  }
);

export const listBuilderEnrich = inngest.createFunction(
  { id: "list-builder-enrich", retries: 2, triggers: [{ event: "list-builder/enrich" }] },
  async ({ event }) => {
    const { listId, runId, accountIds } = event.data as {
      listId: string; runId: string; accountIds?: string[];
    };
    return runListEnrichment(listId, runId, accountIds);
  }
);

export const listBuilderScore = inngest.createFunction(
  { id: "list-builder-score", retries: 2, triggers: [{ event: "list-builder/score" }] },
  async ({ event }) => {
    const { listId, runId, accountIds } = event.data as {
      listId: string; runId: string; accountIds?: string[];
    };
    return runListScoring(listId, runId, accountIds);
  }
);

export const listBuilderHypothesis = inngest.createFunction(
  { id: "list-builder-hypothesis", retries: 1, triggers: [{ event: "list-builder/hypothesis" }] },
  async ({ event }) => {
    const { listId, runId, accountIds } = event.data as {
      listId: string; runId: string; accountIds: string[];
    };
    return runHypothesisGeneration(listId, runId, accountIds);
  }
);

export const listBuilderPromote = inngest.createFunction(
  { id: "list-builder-promote", retries: 2, triggers: [{ event: "list-builder/promote" }] },
  async ({ event }) => {
    const { listId, runId, accountIds } = event.data as {
      listId: string; runId: string; accountIds: string[];
    };
    return runPromote(listId, runId, accountIds);
  }
);

export const listBuilderImport = inngest.createFunction(
  { id: "list-builder-import", retries: 1, triggers: [{ event: "list-builder/import" }] },
  async ({ event }) => {
    const { listId, runId, rows } = event.data as {
      listId: string; runId: string; rows: Record<string, unknown>[];
    };
    return importCsvAccounts(listId, runId, rows as Parameters<typeof importCsvAccounts>[2]);
  }
);

export const listBuilderFunctions = [
  listBuilderGenerate,
  listBuilderEnrich,
  listBuilderScore,
  listBuilderHypothesis,
  listBuilderPromote,
  listBuilderImport,
];

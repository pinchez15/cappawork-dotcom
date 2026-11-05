import { inngest } from "@/lib/inngest/client";
import { researchListSignals } from "@/server/services/li-signals/research";

export const liSignalsResearchList = inngest.createFunction(
  {
    id: "li-signals-research-list",
    retries: 1,
    triggers: [{ event: "li-signals/research-list" }],
  },
  async ({ event }) => {
    const { listId, accountIds } = event.data as {
      listId: string;
      accountIds?: string[];
    };
    return researchListSignals(listId, accountIds);
  }
);

export const liSignalsFunctions = [liSignalsResearchList];

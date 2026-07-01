import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "cappawork-os",
  name: "CappaWork OS",
});

export type ListBuilderEvents = {
  "list-builder/generate": { data: { listId: string; runId: string } };
  "list-builder/enrich": {
    data: { listId: string; runId: string; accountIds?: string[] };
  };
  "list-builder/score": {
    data: { listId: string; runId: string; accountIds?: string[] };
  };
  "list-builder/hypothesis": {
    data: { listId: string; runId: string; accountIds: string[] };
  };
  "list-builder/promote": {
    data: { listId: string; runId: string; accountIds: string[] };
  };
  "list-builder/import": {
    data: {
      listId: string;
      runId: string;
      rows: Record<string, unknown>[];
    };
  };
};

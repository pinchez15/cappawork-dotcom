import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { listBuilderFunctions } from "@/lib/inngest/functions/list-builder";

export const runtime = "nodejs";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: listBuilderFunctions,
});

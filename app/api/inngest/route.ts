import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { listBuilderFunctions } from "@/lib/inngest/functions/list-builder";
import { discoveryFunctions } from "@/lib/inngest/functions/discovery";

export const runtime = "nodejs";
// Discovery extraction runs a long structured-output call inside one step.
export const maxDuration = 300;

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [...listBuilderFunctions, ...discoveryFunctions],
});

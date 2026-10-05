#!/usr/bin/env node
/**
 * Import the discovery question bank into Supabase, once per version.
 *
 * Usage:
 *   node --env-file=.env.local scripts/import-discovery-bank.mjs [path/to/bank.json]
 *
 * Defaults to lib/docs/discovery-question-bank.json. The imported version becomes active.
 * Re-running with the same file is a no-op. Changing questions requires bumping "version":
 * leads keep answers tied to the version they were written under.
 */

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = process.argv[2] ?? path.join(root, "lib/docs/discovery-question-bank.json");

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set.");
  process.exit(1);
}

const raw = readFileSync(file, "utf8");
const bank = JSON.parse(raw);
// Hash the parsed JSON, so whitespace edits don't count as a content change.
const sha256 = createHash("sha256").update(JSON.stringify(bank)).digest("hex");

const tiers = new Set(["must", "if_time", "confirm", "fallback", "once"]);
for (const q of bank.discovery ?? []) {
  if (!q.id || !q.stage || !q.cue || !Array.isArray(q.fields) || !tiers.has(q.tier)) {
    console.error(`Invalid question: ${JSON.stringify(q)}`);
    process.exit(1);
  }
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const { data, error } = await supabase.rpc("discovery_import_bank", { p_bank: bank, p_sha256: sha256 });
if (error) {
  console.error(error.message);
  process.exit(1);
}
console.log(`${bank.version}: ${data} (${bank.discovery.length} questions)`);

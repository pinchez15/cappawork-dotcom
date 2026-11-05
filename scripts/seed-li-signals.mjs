#!/usr/bin/env node
/**
 * Seed LinkedIn outreach signals into the admin Signals view.
 *
 * Usage (local, with admin session cookie, or via service import API):
 *   node scripts/seed-li-signals.mjs
 *   node scripts/seed-li-signals.mjs --post http://localhost:3011/api/admin/signals/import
 *   node scripts/seed-li-signals.mjs --post https://cappawork.com/api/admin/signals/import --cookie "..."
 *
 * Without --post, prints the JSON payload to stdout.
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const seedDir = join(__dirname, "../supabase/seed");

const signalsFile = JSON.parse(
  readFileSync(join(seedDir, "li_signals.json"), "utf8")
);
const nosigFile = JSON.parse(readFileSync(join(seedDir, "nosig.json"), "utf8"));

const payload = {
  signals: signalsFile.signals || [],
  no_signal: signalsFile.no_signal || nosigFile || [],
};

const postIdx = process.argv.indexOf("--post");
const cookieIdx = process.argv.indexOf("--cookie");

if (postIdx === -1) {
  process.stdout.write(JSON.stringify(payload, null, 2));
  process.exit(0);
}

const url = process.argv[postIdx + 1];
const cookie = cookieIdx >= 0 ? process.argv[cookieIdx + 1] : process.env.ADMIN_COOKIE;

const headers = { "Content-Type": "application/json" };
if (cookie) headers.Cookie = cookie;

const res = await fetch(url, {
  method: "POST",
  headers,
  body: JSON.stringify(payload),
});

const text = await res.text();
console.log(res.status, text);
if (!res.ok) process.exit(1);

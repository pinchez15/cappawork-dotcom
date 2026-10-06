import { timingSafeEqual } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { DiscoveryWebhookSchema } from "@/lib/validators/discovery";
import { findPipelineDealByEmails, queueDiscoveryRun } from "@/server/services/discovery";

export const runtime = "nodejs";

// Where finished transcripts land: the Google Meet Apps Script (scripts/google-meet) or any recorder.
// Authorization: Bearer $DISCOVERY_WEBHOOK_SECRET
// Repeat posts with the same source_ref return the existing run instead of starting another.

// Attendee domains that never identify a lead on their own (exact email matches still count).
const IGNORED_DOMAINS = new Set([
  "cappawork.com",
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "yahoo.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
]);

function authorized(request: NextRequest): boolean {
  const secret = process.env.DISCOVERY_WEBHOOK_SECRET;
  const header = request.headers.get("authorization") ?? "";
  if (!secret || !header.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice(7));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = DiscoveryWebhookSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  const body = parsed.data;

  const dealId = body.deal_id ?? (await findPipelineDealByEmails(body.attendee_emails ?? [], IGNORED_DOMAINS));
  if (!dealId) return NextResponse.json({ error: "No open Pipeline deal matches the attendees" }, { status: 404 });

  const meeting = [
    body.meeting_title && `Meeting: ${body.meeting_title}`,
    body.meeting_started_at && `Started: ${body.meeting_started_at}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const run = await queueDiscoveryRun(dealId, {
      transcript: body.transcript,
      research: [meeting, body.research].filter(Boolean).join("\n\n") || undefined,
      constraintMap: body.constraint_map,
      defaults: body.defaults,
      priceUsd: body.price_usd,
      source: body.source,
      sourceRef: body.source_ref,
    });
    return NextResponse.json({ ...run, pipelineDealId: dealId }, { status: run.duplicate ? 200 : 202 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to queue run";
    return NextResponse.json({ error: message }, { status: 422 });
  }
}

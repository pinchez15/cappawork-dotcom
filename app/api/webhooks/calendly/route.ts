import { NextRequest, NextResponse } from "next/server";
import { upsertMeeting, cancelMeeting, autoAssignMeetingByEmail } from "@/server/repos/meetings";

export const runtime = "nodejs";

/**
 * Calendly Webhook Handler
 *
 * Receives webhook events from Calendly when meetings are created or canceled.
 * Set up the webhook subscription in the Calendly dashboard:
 *   https://calendly.com/integrations → Webhooks
 *   URL: https://cappawork.com/api/webhooks/calendly
 *   Events: invitee.created, invitee.canceled
 *
 * Optional: Set CALENDLY_WEBHOOK_SIGNING_KEY env var for signature verification.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const event = body.event; // "invitee.created" | "invitee.canceled"
    const payload = body.payload;

    if (!event || !payload) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Optional: verify webhook signature
    const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
    if (signingKey) {
      const signature = request.headers.get("calendly-webhook-signature");
      if (!signature) {
        return NextResponse.json({ error: "Missing signature" }, { status: 401 });
      }
      // Calendly uses HMAC SHA256 — for now we accept if key is set but skip verification
      // Full verification: https://developer.calendly.com/api-docs/docs/webhook-signatures
    }

    if (event === "invitee.created") {
      await handleInviteeCreated(payload);
    } else if (event === "invitee.canceled") {
      await handleInviteeCanceled(payload);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Calendly webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}

function extractUuid(uri: string): string {
  return uri.split("/").pop() || "";
}

async function handleInviteeCreated(payload: any) {
  const scheduledEvent = payload.scheduled_event;
  const invitee = payload;

  const eventUuid = extractUuid(scheduledEvent.uri);
  const locationUrl =
    scheduledEvent.location?.join_url ||
    scheduledEvent.location?.uri ||
    null;

  const now = new Date();
  const endTime = new Date(scheduledEvent.end_time);
  const status = endTime < now ? "completed" : "scheduled";

  const meeting = await upsertMeeting({
    calendly_event_id: eventUuid,
    title: scheduledEvent.name || scheduledEvent.event_type?.name || "Meeting",
    start_time: scheduledEvent.start_time,
    end_time: scheduledEvent.end_time,
    location_url: locationUrl,
    status,
    invitee_name: invitee.name || null,
    invitee_email: invitee.email || null,
    calendly_event_url: scheduledEvent.uri || null,
    calendly_cancel_url: invitee.cancel_url || null,
    event_type_name:
      scheduledEvent.event_type?.name ||
      scheduledEvent.name ||
      null,
  });

  // Auto-assign to org/project by invitee email
  await autoAssignMeetingByEmail(meeting);
}

async function handleInviteeCanceled(payload: any) {
  const scheduledEvent = payload.scheduled_event;
  const eventUuid = extractUuid(scheduledEvent.uri);
  await cancelMeeting(eventUuid);
}

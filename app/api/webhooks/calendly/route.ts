import { NextRequest, NextResponse } from "next/server";
import { upsertMeeting, cancelMeeting, autoAssignMeetingByEmail } from "@/server/repos/meetings";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the full payload for debugging
    console.log("Calendly webhook received:", JSON.stringify(body, null, 2));

    const event = body.event; // "invitee.created" | "invitee.canceled"
    const payload = body.payload;

    if (!event || !payload) {
      console.error("Calendly webhook: missing event or payload");
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
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
  // The payload IS the invitee object
  // payload.scheduled_event can be a full object or just a URI string
  const scheduledEvent = payload.scheduled_event || {};
  const isEventObject = typeof scheduledEvent === "object";
  const eventUri = isEventObject ? scheduledEvent.uri : scheduledEvent;

  if (!eventUri) {
    console.error("Calendly webhook: no scheduled_event URI found", payload);
    return;
  }

  const eventUuid = extractUuid(eventUri);

  // Extract meeting details — handle both nested object and flat payload
  const startTime = isEventObject
    ? scheduledEvent.start_time
    : payload.event?.start_time;
  const endTime = isEventObject
    ? scheduledEvent.end_time
    : payload.event?.end_time;
  const title = isEventObject
    ? scheduledEvent.name || scheduledEvent.event_type?.name || "Meeting"
    : payload.event_type?.name || "Meeting";

  const locationUrl = isEventObject
    ? scheduledEvent.location?.join_url || scheduledEvent.location?.uri || null
    : null;

  const now = new Date();
  const status = endTime && new Date(endTime) < now ? "completed" : "scheduled";

  const meetingData: any = {
    calendly_event_id: eventUuid,
    title,
    start_time: startTime || new Date().toISOString(),
    end_time: endTime || new Date().toISOString(),
    location_url: locationUrl,
    status,
    invitee_name: payload.name || null,
    invitee_email: payload.email || null,
    calendly_event_url: eventUri,
    calendly_cancel_url: payload.cancel_url || null,
    event_type_name: isEventObject
      ? scheduledEvent.event_type?.name || scheduledEvent.name || null
      : null,
  };

  console.log("Calendly webhook: upserting meeting", meetingData);

  const meeting = await upsertMeeting(meetingData);

  // Auto-assign to org/project by invitee email
  await autoAssignMeetingByEmail(meeting);
}

async function handleInviteeCanceled(payload: any) {
  const scheduledEvent = payload.scheduled_event || {};
  const eventUri = typeof scheduledEvent === "object"
    ? scheduledEvent.uri
    : scheduledEvent;

  if (!eventUri) {
    console.error("Calendly webhook cancel: no event URI", payload);
    return;
  }

  const eventUuid = extractUuid(eventUri);
  await cancelMeeting(eventUuid);
}

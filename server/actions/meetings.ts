"use server";

import { requireAdmin, requireUser } from "@/lib/auth/guards";
import {
  assignMeetingToProject,
  upsertMeeting,
  autoAssignMeetingByEmail,
} from "@/server/repos/meetings";
import {
  getCurrentUser,
  getScheduledEvents,
  getEventInvitees,
  getEventTypes,
  getAvailableTimes,
  createEventInvitee,
  extractCalendlyUuid,
} from "@/lib/calendly";
import type { CalendlyEventType, CalendlyAvailableTime } from "@/lib/calendly";
import { revalidatePath } from "next/cache";

export async function assignMeetingToProjectAction(
  meetingId: string,
  projectId: string
) {
  await requireAdmin();

  await assignMeetingToProject(meetingId, projectId);

  revalidatePath(`/admin/projects/${projectId}`);
}

export async function syncCalendlyMeetings() {
  await requireAdmin();

  const user = await getCurrentUser();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysFromNow = new Date(
    now.getTime() + 60 * 24 * 60 * 60 * 1000
  );

  // Fetch active events
  const [activeEvents, canceledEvents] = await Promise.all([
    getScheduledEvents({
      userUri: user.uri,
      minStartTime: thirtyDaysAgo.toISOString(),
      maxStartTime: sixtyDaysFromNow.toISOString(),
      status: "active",
    }),
    getScheduledEvents({
      userUri: user.uri,
      minStartTime: thirtyDaysAgo.toISOString(),
      maxStartTime: sixtyDaysFromNow.toISOString(),
      status: "canceled",
    }),
  ]);

  // Process active events
  for (const event of activeEvents) {
    const eventUuid = extractCalendlyUuid(event.uri);
    const invitees = await getEventInvitees(eventUuid);
    const invitee = invitees[0];

    // Determine status based on time
    const endTime = new Date(event.end_time);
    const status = endTime < now ? "completed" : "scheduled";

    // Extract location URL (Google Meet, Zoom, etc.)
    const locationUrl =
      event.location?.join_url || event.location?.uri || null;

    const meeting = await upsertMeeting({
      calendly_event_id: eventUuid,
      title: event.name || event.event_type?.name || "Meeting",
      start_time: event.start_time,
      end_time: event.end_time,
      location_url: locationUrl,
      status,
      invitee_name: invitee?.name || null,
      invitee_email: invitee?.email || null,
      calendly_event_url: event.uri || null,
      calendly_cancel_url: invitee?.cancel_url || null,
      event_type_name: event.event_type?.name || null,
    });

    // Auto-assign by email
    await autoAssignMeetingByEmail(meeting);
  }

  // Process canceled events
  for (const event of canceledEvents) {
    const eventUuid = extractCalendlyUuid(event.uri);
    const invitees = await getEventInvitees(eventUuid);
    const invitee = invitees[0];

    await upsertMeeting({
      calendly_event_id: eventUuid,
      title: event.name || event.event_type?.name || "Meeting",
      start_time: event.start_time,
      end_time: event.end_time,
      status: "cancelled",
      invitee_name: invitee?.name || null,
      invitee_email: invitee?.email || null,
      calendly_event_url: event.uri || null,
      event_type_name: event.event_type?.name || null,
    });
  }

  revalidatePath("/admin");
}

// --- Scheduling API actions (client portal) ---

/**
 * Fetch available event types for booking.
 */
export async function fetchEventTypes(): Promise<CalendlyEventType[]> {
  await requireUser();
  const user = await getCurrentUser();
  return getEventTypes(user.uri);
}

/**
 * Fetch available time slots for a specific event type.
 * Max 7-day range.
 */
export async function fetchAvailableTimes(
  eventTypeUri: string,
  startTime: string,
  endTime: string
): Promise<CalendlyAvailableTime[]> {
  await requireUser();
  return getAvailableTimes({ eventTypeUri, startTime, endTime });
}

/**
 * Book a meeting via the Scheduling API and save to DB.
 */
export async function bookMeetingAction(params: {
  projectId: string;
  eventTypeUri: string;
  startTime: string;
  inviteeName: string;
  inviteeEmail: string;
  timezone: string;
}) {
  const user = await requireUser();

  // Create the booking via Calendly
  const result = await createEventInvitee({
    eventTypeUri: params.eventTypeUri,
    startTime: params.startTime,
    invitee: {
      name: params.inviteeName,
      email: params.inviteeEmail,
      timezone: params.timezone,
    },
  });

  // Extract event UUID from the event URI
  const eventUri = result.event;
  const eventUuid = extractCalendlyUuid(eventUri);

  // Fetch the event details to get end_time and location
  // The event URI is the full Calendly event resource
  const events = await getScheduledEvents({
    userUri: (await getCurrentUser()).uri,
    minStartTime: params.startTime,
    maxStartTime: new Date(
      new Date(params.startTime).getTime() + 24 * 60 * 60 * 1000
    ).toISOString(),
    status: "active",
  });

  const event = events.find(
    (e: any) => extractCalendlyUuid(e.uri) === eventUuid
  );

  // Save to our DB
  const meeting = await upsertMeeting({
    calendly_event_id: eventUuid,
    project_id: params.projectId,
    title: event?.name || "Meeting",
    start_time: params.startTime,
    end_time: event?.end_time || params.startTime,
    location_url: event?.location?.join_url || event?.location?.uri || null,
    status: "scheduled",
    invitee_name: params.inviteeName,
    invitee_email: params.inviteeEmail,
    calendly_event_url: eventUri,
    calendly_cancel_url: result.cancel_url,
    event_type_name: event?.event_type?.name || null,
  });

  // Auto-assign org
  await autoAssignMeetingByEmail(meeting);

  revalidatePath(`/projects/${params.projectId}`);
  revalidatePath(`/admin/projects/${params.projectId}`);

  return { success: true };
}

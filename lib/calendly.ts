const CALENDLY_API_BASE = "https://api.calendly.com";

function getToken(): string {
  const token = process.env.CALENDLY_API_TOKEN;
  if (!token) {
    throw new Error("Missing CALENDLY_API_TOKEN environment variable");
  }
  return token;
}

async function calendlyFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${CALENDLY_API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Calendly API error ${res.status}: ${body}`);
  }

  return res.json();
}

/**
 * Get the current authenticated user's URI (needed for event queries).
 */
export async function getCurrentUser(): Promise<{
  uri: string;
  name: string;
  email: string;
}> {
  const data = await calendlyFetch("/users/me");
  return {
    uri: data.resource.uri,
    name: data.resource.name,
    email: data.resource.email,
  };
}

/**
 * Fetch scheduled events for the authenticated user.
 */
export async function getScheduledEvents(params: {
  userUri: string;
  minStartTime?: string;
  maxStartTime?: string;
  status?: "active" | "canceled";
  count?: number;
}): Promise<any[]> {
  const searchParams = new URLSearchParams({
    user: params.userUri,
    count: String(params.count || 100),
  });

  if (params.minStartTime) {
    searchParams.set("min_start_time", params.minStartTime);
  }
  if (params.maxStartTime) {
    searchParams.set("max_start_time", params.maxStartTime);
  }
  if (params.status) {
    searchParams.set("status", params.status);
  }

  const data = await calendlyFetch(
    `/scheduled_events?${searchParams.toString()}`
  );
  return data.collection || [];
}

/**
 * Get invitees for a specific event.
 */
export async function getEventInvitees(
  eventUuid: string
): Promise<any[]> {
  const data = await calendlyFetch(
    `/scheduled_events/${eventUuid}/invitees`
  );
  return data.collection || [];
}

/**
 * Extract UUID from a Calendly resource URI.
 * e.g., "https://api.calendly.com/scheduled_events/abc-123" → "abc-123"
 */
export function extractCalendlyUuid(uri: string): string {
  const parts = uri.split("/");
  return parts[parts.length - 1];
}

// --- Scheduling API ---

export interface CalendlyEventType {
  uri: string;
  name: string;
  slug: string;
  duration: number;
  description_plain: string | null;
  active: boolean;
  color: string;
}

export interface CalendlyAvailableTime {
  status: string;
  start_time: string;
  invitees_remaining: number;
  scheduling_url: string;
}

/**
 * List active event types for the authenticated user.
 */
export async function getEventTypes(userUri: string): Promise<CalendlyEventType[]> {
  const data = await calendlyFetch(
    `/event_types?user=${encodeURIComponent(userUri)}&active=true`
  );
  return (data.collection || []).map((et: any) => ({
    uri: et.uri,
    name: et.name,
    slug: et.slug,
    duration: et.duration,
    description_plain: et.description_plain || null,
    active: et.active,
    color: et.color,
  }));
}

/**
 * Get available time slots for an event type.
 * Max 7-day range per request.
 */
export async function getAvailableTimes(params: {
  eventTypeUri: string;
  startTime: string;
  endTime: string;
}): Promise<CalendlyAvailableTime[]> {
  const searchParams = new URLSearchParams({
    event_type: params.eventTypeUri,
    start_time: params.startTime,
    end_time: params.endTime,
  });

  const data = await calendlyFetch(
    `/event_type_available_times?${searchParams.toString()}`
  );
  return (data.collection || []).map((slot: any) => ({
    status: slot.status,
    start_time: slot.start_time,
    invitees_remaining: slot.invitees_remaining,
    scheduling_url: slot.scheduling_url,
  }));
}

/**
 * Book a meeting via the Scheduling API (Create Event Invitee).
 * Returns the created invitee and associated event details.
 */
export async function createEventInvitee(params: {
  eventTypeUri: string;
  startTime: string;
  invitee: {
    name: string;
    email: string;
    timezone: string;
  };
}): Promise<{
  uri: string;
  event: string;
  name: string;
  email: string;
  cancel_url: string;
  reschedule_url: string;
}> {
  const data = await calendlyFetch("/invitees", {
    method: "POST",
    body: JSON.stringify({
      event_type: params.eventTypeUri,
      start_time: params.startTime,
      invitee: {
        name: params.invitee.name,
        first_name: params.invitee.name.split(" ")[0],
        last_name: params.invitee.name.split(" ").slice(1).join(" ") || "",
        email: params.invitee.email,
        timezone: params.invitee.timezone,
      },
    }),
  });

  const resource = data.resource || data;
  return {
    uri: resource.uri,
    event: resource.event || resource.scheduled_event,
    name: resource.name,
    email: resource.email,
    cancel_url: resource.cancel_url,
    reschedule_url: resource.reschedule_url,
  };
}

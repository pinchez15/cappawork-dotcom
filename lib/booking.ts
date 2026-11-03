/**
 * Public booking URL for marketing CTAs ("Book a call").
 * Uses the site's existing Calendly discovery event when
 * NEXT_PUBLIC_CALENDLY_LINK is set; otherwise the same fallback
 * used elsewhere on the marketing site.
 */
export const BOOKING_URL =
  process.env.NEXT_PUBLIC_CALENDLY_LINK ||
  "https://calendly.com/cappawork/discovery_call"

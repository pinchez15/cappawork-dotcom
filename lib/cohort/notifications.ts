import { Resend } from "resend";
import type { Cohort, CohortType } from "@/server/repos/cohorts";
import { COHORT_TYPE_LABELS } from "@/server/repos/cohorts";
import { getSiteUrl } from "@/lib/site";

const FROM = process.env.EMAIL_FROM || "CappaWork <onboarding@resend.dev>";
const ADMIN_TO = process.env.EMAIL_TO || "nate@cappawork.com";
const SITE_URL = getSiteUrl();

function resend() {
  return new Resend(process.env.RESEND_API_KEY);
}

/** Notifies Nate that someone requested a cohort seat. */
export async function sendLeadNotification(lead: {
  name?: string | null;
  email: string;
  linkedin_url: string;
  cohort_type: CohortType;
}): Promise<void> {
  const label = COHORT_TYPE_LABELS[lead.cohort_type];
  const { error } = await resend().emails.send({
    from: FROM,
    to: ADMIN_TO,
    replyTo: lead.email,
    subject: `New cohort lead: ${label}`,
    text: [
      `New cohort seat request from cappawork.com`,
      ``,
      `Cohort: ${label} (${lead.cohort_type})`,
      lead.name ? `Name: ${lead.name}` : null,
      `Email: ${lead.email}`,
      `LinkedIn: ${lead.linkedin_url}`,
      ``,
      `Added to the cohort lead queue: ${SITE_URL}/admin/leads`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) throw error;
}

/** Welcomes a newly enrolled participant with a login link to the portal. */
export async function sendWelcomeEmail(params: {
  email: string;
  cohort: Cohort;
}): Promise<void> {
  const { email, cohort } = params;
  const portalUrl = `${SITE_URL}/portal/cohort`;

  const { error } = await resend().emails.send({
    from: FROM,
    to: email,
    subject: `You're in: ${cohort.name}`,
    text: [
      `Welcome to ${cohort.name}.`,
      ``,
      `Your seat is confirmed. Here's how to get in:`,
      ``,
      `1. Go to ${portalUrl}`,
      `2. Sign in (or create an account) using this email address: ${email}`,
      `3. You'll land in your cohort portal with the schedule, the Zoom link, and the materials library.`,
      ``,
      cohort.zoom_link ? `Live sessions Zoom link: ${cohort.zoom_link}` : null,
      ``,
      `See you there,`,
      `Nate`,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) throw error;
}

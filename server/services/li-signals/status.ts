import {
  liStatusToOutreachStage,
  type LiOutreachStatus,
} from "@/lib/validators/li-signals";
import { getGtmAccount, updateGtmAccount } from "@/server/repos/gtm-accounts";
import {
  getContactsForAccount,
  updateGtmContact,
  setPrimaryContact,
} from "@/server/repos/gtm-contacts";
import { createGtmOutreachActivity } from "@/server/repos/gtm-outreach-activities";

const ACCOUNT_STAGE_FOR_STATUS: Record<LiOutreachStatus, string | null> = {
  to_message: "signal_found",
  messaged: "contacted",
  replied: "replied",
  booked: "audit_booked",
};

export async function updateLiOutreachStatus(input: {
  accountId: string;
  status: LiOutreachStatus;
  contactId?: string;
}) {
  const account = await getGtmAccount(input.accountId);
  if (!account) throw new Error("Account not found");

  const contacts = await getContactsForAccount(input.accountId);
  let contact =
    (input.contactId
      ? contacts.find((c) => c.id === input.contactId)
      : null) ||
    contacts.find((c) => c.id === account.primary_contact_id) ||
    contacts.find((c) => c.is_primary) ||
    contacts[0];

  if (!contact) {
    throw new Error("No contact on this account to update");
  }

  const outreachStage = liStatusToOutreachStage(input.status);
  contact = await updateGtmContact(contact.id, {
    outreach_stage: outreachStage,
  });
  await setPrimaryContact(input.accountId, contact.id);

  const activityStatus =
    input.status === "replied" || input.status === "booked"
      ? "replied"
      : input.status === "messaged"
        ? "sent"
        : "draft";

  await createGtmOutreachActivity({
    contact_id: contact.id,
    account_id: input.accountId,
    channel: "linkedin_dm",
    action_type: `status_${input.status}`,
    content: `Marked as ${input.status.replace(/_/g, " ")}`,
    status: activityStatus,
    sent_at:
      input.status === "to_message" ? null : new Date().toISOString(),
    responded_at:
      input.status === "replied" || input.status === "booked"
        ? new Date().toISOString()
        : null,
  });

  const nextGtmStage = ACCOUNT_STAGE_FOR_STATUS[input.status];
  if (nextGtmStage) {
    await updateGtmAccount(input.accountId, {
      gtm_stage: nextGtmStage,
      next_action:
        input.status === "to_message"
          ? "Message on LinkedIn"
          : input.status === "messaged"
            ? "Wait for reply"
            : input.status === "replied"
              ? "Book a call"
              : "Prepare for call",
    });
  }

  return {
    contact,
    status: input.status,
    outreach_stage: outreachStage,
  };
}

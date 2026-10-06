import { z } from "zod";

const AnswerItem = z.object({
  value: z.string().trim().min(1),
  quote: z.string().optional(),
  at: z.string().optional(),
});

export const DiscoveryPatchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("set_field"),
    field: z.string().regex(/^(deal|constraint)\.[a-z0-9_]+$/),
    items: z.array(AnswerItem).min(1),
    constraint_id: z.string().uuid().optional(),
    source: z.enum(["manual", "call", "recap"]).default("manual"),
  }),
  z.object({ action: z.literal("set_hypothesis"), hypothesis: z.string().max(500) }),
  z.object({ action: z.literal("set_price"), price_usd: z.number().int().positive() }),
  z.object({ action: z.literal("add_constraint") }),
  z.object({ action: z.literal("confirm_primary"), constraint_id: z.string().uuid() }),
]);

export const DiscoveryDefaultsSchema = z
  .object({
    close_rate: z.number().min(0).max(1).optional(),
    margin: z.number().min(0).max(1).optional(),
    owner_revenue_per_hour: z.number().positive().optional(),
  })
  .optional();

export const DiscoveryRunSchema = z.object({
  transcript: z.string().trim().min(200, "Paste the full transcript"),
  research: z.string().optional(),
  constraint_map: z.string().optional(),
  defaults: DiscoveryDefaultsSchema,
  price_usd: z.number().int().positive().optional(),
});

export const DiscoveryWebhookSchema = DiscoveryRunSchema.extend({
  deal_id: z.string().uuid().optional(), // Pipeline deal (bd_deals)
  attendee_emails: z.array(z.string().email()).optional(),
  source: z.enum(["google_meet", "webhook"]).default("webhook"),
  source_ref: z.string().max(300).optional(),
  meeting_title: z.string().max(300).optional(),
  meeting_started_at: z.string().optional(),
}).refine((b) => b.deal_id || b.attendee_emails?.length, {
  message: "deal_id or attendee_emails is required",
});

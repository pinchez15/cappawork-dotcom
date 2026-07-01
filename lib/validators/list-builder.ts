import { z } from "zod";

export const ListSearchCriteriaSchema = z.object({
  industries: z.array(z.string()).default([]),
  geographies: z.array(z.string()).default([]),
  employee_min: z.number().int().positive().optional(),
  employee_max: z.number().int().positive().optional(),
  revenue_min: z.number().optional(),
  revenue_max: z.number().optional(),
  company_keywords: z.array(z.string()).default([]),
  excluded_keywords: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  job_titles: z.array(z.string()).default([]),
  seniority_levels: z.array(z.string()).default([]),
  departments: z.array(z.string()).default([]),
  founder_led_min_score: z.number().int().min(0).max(100).optional(),
  website_keywords: z.array(z.string()).default([]),
  signals_required: z.array(z.string()).default([]),
  signals_excluded: z.array(z.string()).default([]),
  case_study_match: z.string().optional(),
  min_fit_score: z.number().int().min(0).max(100).optional(),
  max_records: z.number().int().min(1).max(500).default(100),
  enrichment_depth: z.enum(["minimal", "standard", "deep"]).default("standard"),
});

export const CreateListSchema = z.object({
  name: z.string().min(1).max(200),
  vertical_id: z.string().uuid().optional().nullable(),
  description: z.string().optional(),
  icp_template: z.string().optional(),
  source_provider: z
    .enum(["apollo", "csv", "crm", "inbound", "manual"])
    .default("apollo"),
  criteria: ListSearchCriteriaSchema,
  notes: z.string().optional(),
});

export const UpdateListSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: z
    .enum([
      "draft",
      "generating",
      "review",
      "enriching",
      "scoring",
      "ready",
      "synced",
      "archived",
    ])
    .optional(),
  notes: z.string().optional(),
});

export const RunListActionSchema = z.object({
  action: z.enum([
    "generate",
    "enrich",
    "score",
    "hypothesis",
    "promote",
    "signal_fetch",
  ]),
  account_ids: z.array(z.string().uuid()).optional(),
});

export const SyncToCrmSchema = z.object({
  account_ids: z.array(z.string().uuid()).min(1),
});

export const PromoteAccountsSchema = SyncToCrmSchema;

export const ReviewSignalSchema = z.object({
  review_status: z.enum(["accepted", "rejected", "snoozed"]),
});

export const ApproveHypothesisSchema = z.object({
  approval_status: z.enum(["approved", "edited", "discarded"]),
  edits: z
    .object({
      likely_pain: z.string().optional(),
      relevant_workflow: z.string().optional(),
      relevant_proof: z.string().optional(),
      recommended_offer: z.string().optional(),
      outreach_angle: z.string().optional(),
      suggested_first_question: z.string().optional(),
      suggested_email_draft: z.string().optional(),
      suggested_linkedin_message: z.string().optional(),
    })
    .optional(),
});

export const ProviderSettingsSchema = z.object({
  provider: z.enum(["apollo", "whitewhale", "clay"]),
  api_key: z.string().min(1),
  is_active: z.boolean().default(true),
  config: z.record(z.unknown()).default({}),
});

export const CsvImportRowSchema = z.object({
  company_name: z.string().min(1),
  domain: z.string().optional(),
  website: z.string().optional(),
  industry: z.string().optional(),
  location: z.string().optional(),
  employee_count: z.union([z.number(), z.string()]).optional(),
  revenue_estimate: z.string().optional(),
  contact_name: z.string().optional(),
  contact_title: z.string().optional(),
  contact_email: z.string().optional(),
  linkedin_url: z.string().optional(),
});

export type ListSearchCriteria = z.infer<typeof ListSearchCriteriaSchema>;
export type CreateListInput = z.infer<typeof CreateListSchema>;
export type UpdateListInput = z.infer<typeof UpdateListSchema>;

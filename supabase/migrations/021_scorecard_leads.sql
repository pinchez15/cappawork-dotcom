-- Scorecard leads: stores every Profit Leak Scorecard submission
CREATE TABLE public.scorecard_leads (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now(),
  name                    text NOT NULL,
  email                   text NOT NULL,
  revenue_range           text,
  industry                text,
  answers                 jsonb,
  scores                  jsonb,
  overall_grade           text,
  top_leak                text,
  purchased_call          boolean NOT NULL DEFAULT false,
  purchased_pdf           boolean NOT NULL DEFAULT false,
  email_sequence_started  boolean NOT NULL DEFAULT false,
  source                  text DEFAULT 'scorecard',
  utm_source              text,
  utm_medium              text,
  utm_campaign            text,
  utm_content             text,
  utm_term                text,
  fb_click_id             text
);

CREATE UNIQUE INDEX scorecard_leads_email_idx ON public.scorecard_leads (email);

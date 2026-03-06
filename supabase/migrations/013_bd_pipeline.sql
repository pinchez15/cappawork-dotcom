-- BD pipeline for tracking deals
CREATE TABLE public.bd_deals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  company text,
  contact_name text,
  contact_title text,
  email text,
  linkedin_url text,
  value integer,
  stage text NOT NULL DEFAULT 'lead',
  stage_order integer NOT NULL DEFAULT 0,
  source text NOT NULL DEFAULT 'linkedin',
  referral_partner text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bd_deals_stage ON public.bd_deals(stage, stage_order);

ALTER TABLE public.bd_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on bd_deals"
  ON public.bd_deals
  FOR ALL
  USING (true)
  WITH CHECK (true);

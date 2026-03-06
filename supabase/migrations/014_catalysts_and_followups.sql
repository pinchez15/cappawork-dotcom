-- Add follow-up tracking to deals
ALTER TABLE public.bd_deals
  ADD COLUMN follow_up_date date,
  ADD COLUMN next_action text;

CREATE INDEX idx_bd_deals_follow_up ON public.bd_deals(follow_up_date)
  WHERE follow_up_date IS NOT NULL;

-- Catalyst / referral partner tracking
CREATE TABLE public.bd_catalysts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  company text,
  title text,
  email text,
  phone text,
  linkedin_url text,
  category text NOT NULL DEFAULT 'other',
  relationship text NOT NULL DEFAULT 'cold',
  notes text,
  last_contact_date date,
  next_contact_date date,
  next_action text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_bd_catalysts_relationship ON public.bd_catalysts(relationship);
CREATE INDEX idx_bd_catalysts_next_contact ON public.bd_catalysts(next_contact_date)
  WHERE next_contact_date IS NOT NULL;

ALTER TABLE public.bd_catalysts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on bd_catalysts"
  ON public.bd_catalysts
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Link deals to catalysts
ALTER TABLE public.bd_deals
  ADD COLUMN catalyst_id uuid REFERENCES public.bd_catalysts(id) ON DELETE SET NULL;

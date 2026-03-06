-- Calculator lead capture for AI Opportunity Calculator
CREATE TABLE public.calculator_leads (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name text NOT NULL,
  email text NOT NULL,
  company text NOT NULL,
  inputs jsonb NOT NULL DEFAULT '{}'::jsonb,
  results jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_calculator_leads_email ON public.calculator_leads(email);
CREATE INDEX idx_calculator_leads_created_at ON public.calculator_leads(created_at DESC);

ALTER TABLE public.calculator_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on calculator_leads"
  ON public.calculator_leads
  FOR ALL
  USING (true)
  WITH CHECK (true);

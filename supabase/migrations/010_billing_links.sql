-- Drop old Stripe billing tables and column
DROP TABLE IF EXISTS public.stripe_invoices CASCADE;
DROP TABLE IF EXISTS public.stripe_subscriptions CASCADE;
ALTER TABLE public.organizations DROP COLUMN IF EXISTS stripe_customer_id;

-- New billing_links table for Stripe Payment Links
CREATE TABLE public.billing_links (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  url text NOT NULL,
  label text NOT NULL,
  type text NOT NULL DEFAULT 'one_time'
    CHECK (type IN ('one_time', 'subscription')),
  amount_display text,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paid', 'archived')),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_billing_links_organization_id ON public.billing_links(organization_id);
CREATE INDEX idx_billing_links_project_id ON public.billing_links(project_id);
CREATE INDEX idx_billing_links_status ON public.billing_links(status);

ALTER TABLE public.billing_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on billing_links"
  ON public.billing_links
  FOR ALL
  USING (true)
  WITH CHECK (true);

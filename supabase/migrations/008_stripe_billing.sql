-- Add stripe_customer_id to organizations
ALTER TABLE public.organizations ADD COLUMN stripe_customer_id text UNIQUE;
CREATE INDEX idx_organizations_stripe_customer_id ON public.organizations(stripe_customer_id);

-- Stripe invoices (separate from Clerk billing)
CREATE TABLE public.stripe_invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_invoice_id text UNIQUE NOT NULL,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft','open','paid','void','uncollectible')),
  description text,
  stripe_hosted_invoice_url text,
  stripe_invoice_pdf text,
  due_date timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_stripe_invoices_organization_id ON public.stripe_invoices(organization_id);
CREATE INDEX idx_stripe_invoices_project_id ON public.stripe_invoices(project_id);
CREATE INDEX idx_stripe_invoices_status ON public.stripe_invoices(status);
CREATE INDEX idx_stripe_invoices_stripe_id ON public.stripe_invoices(stripe_invoice_id);

ALTER TABLE public.stripe_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on stripe_invoices"
  ON public.stripe_invoices
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Stripe subscriptions (separate from existing Clerk subscriptions table)
CREATE TABLE public.stripe_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_subscription_id text UNIQUE NOT NULL,
  organization_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  stripe_price_id text NOT NULL,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active','past_due','canceled','incomplete','trialing','paused')),
  description text,
  amount_cents integer NOT NULL,
  currency text NOT NULL DEFAULT 'usd',
  interval text NOT NULL DEFAULT 'month' CHECK (interval IN ('month','year')),
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  canceled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_stripe_subscriptions_organization_id ON public.stripe_subscriptions(organization_id);
CREATE INDEX idx_stripe_subscriptions_status ON public.stripe_subscriptions(status);
CREATE INDEX idx_stripe_subscriptions_stripe_id ON public.stripe_subscriptions(stripe_subscription_id);

ALTER TABLE public.stripe_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on stripe_subscriptions"
  ON public.stripe_subscriptions
  FOR ALL
  USING (true)
  WITH CHECK (true);

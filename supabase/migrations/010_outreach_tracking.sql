-- Outreach goal cycles (90-day goals)
CREATE TABLE public.outreach_goals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_text text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_outreach_goals_is_active ON public.outreach_goals(is_active);

ALTER TABLE public.outreach_goals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on outreach_goals"
  ON public.outreach_goals
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Outreach daily entries
CREATE TABLE public.outreach_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id uuid REFERENCES public.outreach_goals(id) ON DELETE SET NULL,
  entry_date date UNIQUE NOT NULL,
  targets jsonb NOT NULL DEFAULT '[]'::jsonb,
  counts jsonb NOT NULL DEFAULT '{}'::jsonb,
  eod_checks jsonb NOT NULL DEFAULT '{}'::jsonb,
  gratitude jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_outreach_entries_entry_date ON public.outreach_entries(entry_date);
CREATE INDEX idx_outreach_entries_goal_id ON public.outreach_entries(goal_id);

ALTER TABLE public.outreach_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on outreach_entries"
  ON public.outreach_entries
  FOR ALL
  USING (true)
  WITH CHECK (true);

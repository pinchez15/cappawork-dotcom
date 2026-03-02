-- Meetings table (synced from Calendly)
CREATE TABLE public.meetings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  calendly_event_id text UNIQUE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  organization_id uuid REFERENCES public.organizations(id) ON DELETE SET NULL,
  title text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  location_url text,
  status text NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','cancelled','completed')),
  invitee_name text,
  invitee_email text,
  calendly_event_url text,
  calendly_cancel_url text,
  event_type_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_meetings_project_id ON public.meetings(project_id);
CREATE INDEX idx_meetings_organization_id ON public.meetings(organization_id);
CREATE INDEX idx_meetings_calendly_event_id ON public.meetings(calendly_event_id);
CREATE INDEX idx_meetings_start_time ON public.meetings(start_time);
CREATE INDEX idx_meetings_invitee_email ON public.meetings(invitee_email);
CREATE INDEX idx_meetings_status ON public.meetings(status);

ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on meetings"
  ON public.meetings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Activity events table for tracking page views, logins, and file downloads
CREATE TABLE public.activity_events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('page_view', 'login', 'file_download')),
  metadata jsonb DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_activity_events_profile_id ON public.activity_events(profile_id);
CREATE INDEX idx_activity_events_project_id ON public.activity_events(project_id);
CREATE INDEX idx_activity_events_event_type ON public.activity_events(event_type);
CREATE INDEX idx_activity_events_created_at ON public.activity_events(created_at DESC);

-- RLS: service role has full access (app uses service role key)
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on activity_events"
  ON public.activity_events
  FOR ALL
  USING (true)
  WITH CHECK (true);

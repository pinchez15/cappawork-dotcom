-- Project messages table for in-portal messaging
CREATE TABLE public.project_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  sender_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_project_messages_project_id ON public.project_messages(project_id);
CREATE INDEX idx_project_messages_sender ON public.project_messages(sender_profile_id);
CREATE INDEX idx_project_messages_created_at ON public.project_messages(created_at DESC);
CREATE INDEX idx_project_messages_unread ON public.project_messages(project_id, is_read) WHERE is_read = false;

-- RLS: service role has full access (app uses service role key)
ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on project_messages"
  ON public.project_messages
  FOR ALL
  USING (true)
  WITH CHECK (true);

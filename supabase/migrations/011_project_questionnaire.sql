-- Pre-meeting vision questionnaire responses
CREATE TABLE public.project_questionnaire (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  responses jsonb NOT NULL DEFAULT '{}'::jsonb,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT project_questionnaire_project_id_key UNIQUE (project_id)
);

CREATE INDEX idx_project_questionnaire_project_id ON public.project_questionnaire(project_id);

ALTER TABLE public.project_questionnaire ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on project_questionnaire"
  ON public.project_questionnaire
  FOR ALL
  USING (true)
  WITH CHECK (true);

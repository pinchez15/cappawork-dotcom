-- Project Attachments
-- This migration creates the attachments table for file storage tracking

CREATE TABLE IF NOT EXISTS public.project_attachments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  uploaded_by uuid NOT NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  name text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  mime_type text NOT NULL,
  storage_path text NOT NULL,
  category text NOT NULL DEFAULT 'document'
    CHECK (category IN ('design', 'document', 'asset', 'contract', 'other')),
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_attachments_project_id ON public.project_attachments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_attachments_uploaded_by ON public.project_attachments(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_project_attachments_category ON public.project_attachments(category);

-- Enable RLS
ALTER TABLE public.project_attachments ENABLE ROW LEVEL SECURITY;

-- RLS Policy (service role access)
CREATE POLICY "Service role full access project_attachments" ON public.project_attachments
  FOR ALL USING (true) WITH CHECK (true);

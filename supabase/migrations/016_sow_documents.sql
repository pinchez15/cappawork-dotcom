-- SOW (Statement of Work) documents table
CREATE TABLE public.sow_documents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,

  -- SOW content
  title text NOT NULL,
  sow_data jsonb NOT NULL DEFAULT '{}',

  -- Lifecycle
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'signed', 'voided')),

  -- PDF storage
  draft_storage_path text,
  signed_storage_path text,

  -- Link to Files tab
  attachment_id uuid REFERENCES public.project_attachments(id) ON DELETE SET NULL,

  -- Signing token auth
  signing_token uuid,
  signing_token_expires_at timestamptz,

  -- Signature audit trail
  signed_by_name text,
  signed_by_email text,
  signed_by_ip text,
  signed_at timestamptz,
  signature_image_path text,

  -- Admin + audit
  created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_sow_documents_project_id ON public.sow_documents(project_id);
CREATE INDEX idx_sow_documents_status ON public.sow_documents(status);
CREATE UNIQUE INDEX idx_sow_documents_signing_token ON public.sow_documents(signing_token) WHERE signing_token IS NOT NULL;

ALTER TABLE public.sow_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON public.sow_documents
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Add client visibility flag to SOW documents
-- SOWs are not visible to clients until explicitly published
ALTER TABLE public.sow_documents
  ADD COLUMN client_visible boolean NOT NULL DEFAULT false;

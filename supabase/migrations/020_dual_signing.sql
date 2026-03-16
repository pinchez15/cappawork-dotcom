-- Admin signature fields for dual-signing flow
ALTER TABLE public.sow_documents
  ADD COLUMN IF NOT EXISTS admin_signed_by_name text,
  ADD COLUMN IF NOT EXISTS admin_signed_at timestamptz,
  ADD COLUMN IF NOT EXISTS admin_signature_image_path text,
  ADD COLUMN IF NOT EXISTS admin_signed_storage_path text;

-- Expand status constraint to include dual-signing states
ALTER TABLE public.sow_documents DROP CONSTRAINT IF EXISTS sow_documents_status_check;
ALTER TABLE public.sow_documents ADD CONSTRAINT sow_documents_status_check
  CHECK (status IN ('draft','sent','signed','voided','admin_signed','countersigned'));

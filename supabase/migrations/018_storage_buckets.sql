-- Create storage bucket for project file uploads (attachments, SOW PDFs, signatures)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-attachments', 'project-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Service role full access on project-attachments"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'project-attachments')
  WITH CHECK (bucket_id = 'project-attachments');

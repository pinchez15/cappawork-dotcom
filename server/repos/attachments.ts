import { supabaseAdmin } from "@/lib/db/client";

export interface ProjectAttachment {
  id: string;
  project_id: string;
  uploaded_by: string;
  name: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  category: "design" | "document" | "asset" | "contract" | "other";
  description: string | null;
  created_at: string;
}

export async function createAttachment(data: {
  projectId: string;
  uploadedBy: string;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  category?: "design" | "document" | "asset" | "contract" | "other";
  description?: string;
}) {
  const { data: attachment, error } = await supabaseAdmin
    .from("project_attachments")
    .insert({
      project_id: data.projectId,
      uploaded_by: data.uploadedBy,
      name: data.name,
      file_name: data.fileName,
      file_size: data.fileSize,
      mime_type: data.mimeType,
      storage_path: data.storagePath,
      category: data.category || "document",
      description: data.description || null,
    })
    .select()
    .single();

  if (error) throw error;
  return attachment as ProjectAttachment;
}

export async function getAttachmentsForProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_attachments")
    .select(
      `
      *,
      uploader:profiles!project_attachments_uploaded_by_fkey(id, name, email)
    `
    )
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getAttachmentById(attachmentId: string) {
  const { data, error } = await supabaseAdmin
    .from("project_attachments")
    .select("*")
    .eq("id", attachmentId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as ProjectAttachment | null;
}

export async function deleteAttachment(attachmentId: string) {
  // First get the attachment to get storage path
  const { data: attachment, error: fetchError } = await supabaseAdmin
    .from("project_attachments")
    .select("storage_path")
    .eq("id", attachmentId)
    .single();

  if (fetchError) throw fetchError;

  // Delete from storage
  if (attachment?.storage_path) {
    const { error: storageError } = await supabaseAdmin.storage
      .from("project-attachments")
      .remove([attachment.storage_path]);

    if (storageError) {
      console.error("Failed to delete from storage:", storageError);
      // Continue with DB deletion even if storage deletion fails
    }
  }

  // Delete from database
  const { error } = await supabaseAdmin
    .from("project_attachments")
    .delete()
    .eq("id", attachmentId);

  if (error) throw error;
}

export async function getSignedUrl(storagePath: string, expiresIn = 3600) {
  const { data, error } = await supabaseAdmin.storage
    .from("project-attachments")
    .createSignedUrl(storagePath, expiresIn);

  if (error) throw error;
  return data.signedUrl;
}

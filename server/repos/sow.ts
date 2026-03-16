import { supabaseAdmin } from "@/lib/db/client";

export interface SowDocument {
  id: string;
  project_id: string;
  title: string;
  sow_data: SowData | null;
  status: "draft" | "sent" | "signed" | "voided" | "admin_signed" | "countersigned";
  draft_storage_path: string | null;
  signed_storage_path: string | null;
  attachment_id: string | null;
  signing_token: string | null;
  signing_token_expires_at: string | null;
  signed_by_name: string | null;
  signed_by_email: string | null;
  signed_by_ip: string | null;
  signed_at: string | null;
  signature_image_path: string | null;
  admin_signed_by_name: string | null;
  admin_signed_at: string | null;
  admin_signature_image_path: string | null;
  admin_signed_storage_path: string | null;
  created_by: string | null;
  sent_at: string | null;
  client_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SowLineItem {
  description: string;
  amount: string;
}

export interface SowDeliverable {
  title: string;
  description: string;
}

export interface SowData {
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  scope: string;
  deliverables: SowDeliverable[];
  timeline: string;
  lineItems: SowLineItem[];
  totalAmount: string;
  paymentTerms: string;
  termsAndConditions: string;
}

export async function createSowDocument(data: {
  project_id: string;
  title: string;
  sow_data?: Partial<SowData> | null;
  draft_storage_path: string;
  created_by: string;
}) {
  const { data: sow, error } = await supabaseAdmin
    .from("sow_documents")
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return sow as SowDocument;
}

export async function getSowDocumentsForProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("sow_documents")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as SowDocument[];
}

export async function getSowDocumentById(sowId: string) {
  const { data, error } = await supabaseAdmin
    .from("sow_documents")
    .select("*")
    .eq("id", sowId)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as SowDocument | null;
}

export async function getSowDocumentByToken(token: string) {
  const { data, error } = await supabaseAdmin
    .from("sow_documents")
    .select("*")
    .eq("signing_token", token)
    .eq("status", "sent")
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return data as SowDocument | null;
}

export async function updateSowDocument(
  sowId: string,
  data: Partial<
    Pick<
      SowDocument,
      | "title"
      | "sow_data"
      | "status"
      | "draft_storage_path"
      | "signed_storage_path"
      | "attachment_id"
      | "signing_token"
      | "signing_token_expires_at"
      | "signed_by_name"
      | "signed_by_email"
      | "signed_by_ip"
      | "signed_at"
      | "signature_image_path"
      | "admin_signed_by_name"
      | "admin_signed_at"
      | "admin_signature_image_path"
      | "admin_signed_storage_path"
      | "sent_at"
      | "client_visible"
    >
  >
) {
  const { error } = await supabaseAdmin
    .from("sow_documents")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", sowId);

  if (error) throw error;
}

export async function getClientVisibleSowsForProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("sow_documents")
    .select("*")
    .eq("project_id", projectId)
    .eq("client_visible", true)
    .in("status", ["signed", "admin_signed", "countersigned"])
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as SowDocument[];
}

export async function deleteSowDocument(sowId: string) {
  const { error } = await supabaseAdmin
    .from("sow_documents")
    .delete()
    .eq("id", sowId);

  if (error) throw error;
}

export async function voidSowDocument(sowId: string) {
  const { error } = await supabaseAdmin
    .from("sow_documents")
    .update({
      status: "voided",
      signing_token: null,
      signing_token_expires_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", sowId);

  if (error) throw error;
}

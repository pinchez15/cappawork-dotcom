import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/guards";
import { supabaseAdmin } from "@/lib/db/client";
import { createAttachment } from "@/server/repos/attachments";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

// Max file size: 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    // Require admin access
    const user = await requireAdmin();

    if (!user.profileId) {
      return NextResponse.json({ error: "No profile found" }, { status: 400 });
    }

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const projectId = formData.get("projectId") as string | null;
    const name = formData.get("name") as string | null;
    const category = formData.get("category") as string | null;
    const description = formData.get("description") as string | null;

    if (!file || !projectId || !name) {
      return NextResponse.json(
        { error: "Missing required fields: file, projectId, name" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit" },
        { status: 400 }
      );
    }

    // Generate unique storage path
    const fileExt = file.name.split(".").pop() || "bin";
    const storagePath = `${projectId}/${uuidv4()}.${fileExt}`;

    // Upload to Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error: uploadError } = await supabaseAdmin.storage
      .from("project-attachments")
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload file" },
        { status: 500 }
      );
    }

    // Create database record
    const validCategories = ["design", "document", "asset", "contract", "other"];
    const attachmentCategory = validCategories.includes(category || "")
      ? (category as "design" | "document" | "asset" | "contract" | "other")
      : "document";

    const attachment = await createAttachment({
      projectId,
      uploadedBy: user.profileId,
      name,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      storagePath,
      category: attachmentCategory,
      description: description || undefined,
    });

    return NextResponse.json({ attachment }, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    const message = error instanceof Error ? error.message : "Upload failed";

    if (message === "UNAUTHORIZED" || message.includes("FORBIDDEN")) {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

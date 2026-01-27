"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Image,
  File,
  FileCode,
  FileArchive,
} from "lucide-react";

interface Attachment {
  id: string;
  name: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  category: string;
  description: string | null;
  created_at: string;
}

interface ClientAttachmentsProps {
  attachments: Attachment[];
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.includes("pdf") || mimeType.includes("document"))
    return FileText;
  if (mimeType.includes("zip") || mimeType.includes("archive"))
    return FileArchive;
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("json") ||
    mimeType.includes("html") ||
    mimeType.includes("css")
  )
    return FileCode;
  return File;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function getCategoryColor(category: string) {
  switch (category) {
    case "design":
      return "bg-purple-100 text-purple-800";
    case "document":
      return "bg-blue-100 text-blue-800";
    case "asset":
      return "bg-green-100 text-green-800";
    case "contract":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-stone-100 text-stone-800";
  }
}

export function ClientAttachments({ attachments }: ClientAttachmentsProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (attachmentId: string) => {
    setDownloadingId(attachmentId);

    try {
      const response = await fetch(`/api/download/${attachmentId}`);
      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      const { url, fileName } = await response.json();

      // Open download in new tab
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
    } finally {
      setDownloadingId(null);
    }
  };

  if (attachments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Files</CardTitle>
          <CardDescription>Project attachments and documents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <File className="mx-auto h-8 w-8 text-stone-400 mb-2" />
            <p className="text-sm text-stone-500">
              No files have been shared yet
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files</CardTitle>
        <CardDescription>
          {attachments.length} file{attachments.length !== 1 ? "s" : ""} shared
          with you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {attachments.map((attachment) => {
            const FileIcon = getFileIcon(attachment.mime_type);
            return (
              <div
                key={attachment.id}
                className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <FileIcon className="h-5 w-5 text-stone-400" />
                  <div>
                    <div className="font-medium text-stone-900">
                      {attachment.name}
                    </div>
                    <div className="text-xs text-stone-500">
                      {formatFileSize(attachment.file_size)} &bull;{" "}
                      {new Date(attachment.created_at).toLocaleDateString()}
                    </div>
                    {attachment.description && (
                      <div className="text-sm text-stone-600 mt-1">
                        {attachment.description}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(attachment.category)}>
                    {attachment.category}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(attachment.id)}
                    disabled={downloadingId === attachment.id}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {downloadingId === attachment.id
                      ? "Downloading..."
                      : "Download"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

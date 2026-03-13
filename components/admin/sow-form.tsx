"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadSowAction } from "@/server/actions/sow";
import { Plus, Upload, Loader2, FileText, X } from "lucide-react";
import { toast } from "sonner";

interface SowFormProps {
  projectId: string;
}

export function SowForm({ projectId }: SowFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    setTitle("");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected && selected.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      e.target.value = "";
      return;
    }
    setFile(selected || null);
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!file) {
      toast.error("Please select a PDF file");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("projectId", projectId);
      formData.append("title", title.trim());
      formData.append("file", file);

      await uploadSowAction(formData);

      toast.success("SOW uploaded");
      resetForm();
      setOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload SOW";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload SOW
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Statement of Work</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sow-title">SOW Title</Label>
            <Input
              id="sow-title"
              placeholder="Phase 1 — Operational Diagnostic"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>PDF Document</Label>
            {file ? (
              <div className="flex items-center gap-2 p-3 border border-stone-200 rounded-lg bg-stone-50">
                <FileText className="h-5 w-5 text-blue-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-stone-200 rounded-lg p-6 text-center cursor-pointer hover:border-stone-300 transition-colors"
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-stone-400" />
                <p className="text-sm text-stone-500">
                  Click to select a PDF file
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <Button type="submit" disabled={isSubmitting || !file} className="w-full">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Upload className="h-4 w-4 mr-2" />
            )}
            Upload SOW
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

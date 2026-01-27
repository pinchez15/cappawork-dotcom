"use client";

import { useState } from "react";
import { RichTextEditor } from "./rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateProject } from "@/server/repos/projects";
import { toast } from "sonner";

interface PRDEditorProps {
  projectId: string;
  initialContent: any;
}

export function PRDEditor({ projectId, initialContent }: PRDEditorProps) {
  const [content, setContent] = useState(initialContent || {});
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProject(projectId, { prd_content: content });
      toast.success("PRD saved successfully");
    } catch (error) {
      toast.error("Failed to save PRD");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Product Requirements Document</CardTitle>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <RichTextEditor
          content={content}
          onChange={setContent}
          placeholder="Start writing your PRD..."
        />
      </CardContent>
    </Card>
  );
}


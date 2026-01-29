"use client";

import { useSearchParams } from "next/navigation";
import { KanbanBoard } from "./kanban-board";
import { PRDEditor } from "./prd-editor";
import { SecretsVault } from "./secrets-vault";
import { URLsSection } from "./urls-section";
import { DesignSpec } from "./design-spec";
import { FileAttachments } from "./file-attachments";

interface ProjectDetailViewProps {
  project: any;
  phases: any[];
  tasks: any[];
  secrets: any[];
  urls: any[];
  design: any;
  attachments: any[];
}

export function ProjectDetailView({
  project,
  phases,
  tasks,
  secrets,
  urls,
  design,
  attachments,
}: ProjectDetailViewProps) {
  const searchParams = useSearchParams();

  // Get current tab from URL
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam || "kanban";

  return (
    <div className="p-6">
      {activeTab === "kanban" && (
        <KanbanBoard
          projectId={project.id}
          initialPhases={phases}
          initialTasks={tasks}
        />
      )}

      {activeTab === "prd" && (
        <PRDEditor projectId={project.id} initialContent={project.prd_content} />
      )}

      {activeTab === "files" && (
        <FileAttachments projectId={project.id} attachments={attachments} />
      )}

      {activeTab === "secrets" && (
        <SecretsVault projectId={project.id} initialSecrets={secrets} />
      )}

      {activeTab === "urls" && (
        <URLsSection projectId={project.id} initialUrls={urls} />
      )}

      {activeTab === "design" && (
        <DesignSpec projectId={project.id} initialDesign={design} />
      )}
    </div>
  );
}

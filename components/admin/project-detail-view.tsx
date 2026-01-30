"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "./kanban-board";
import { PRDEditor } from "./prd-editor";
import { SecretsVault } from "./secrets-vault";
import { URLsSection } from "./urls-section";
import { DesignSpec } from "./design-spec";
import { FileAttachments } from "./file-attachments";
import { Badge } from "@/components/ui/badge";
import { getTierInfo } from "@/lib/animations";
import { Kanban, FileText, FolderOpen, Key, Link2, Palette } from "lucide-react";

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
  const tierInfo = getTierInfo(project.service_tier);

  return (
    <div className="p-6">
      {/* Project Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-stone-900">
            {project.name}
          </h1>
          <Badge
            className={
              project.status === "active"
                ? "bg-blue-100 text-blue-800"
                : project.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }
          >
            {project.status}
          </Badge>
          {project.service_tier && (
            <Badge className={`${tierInfo.colors.bg} text-white`}>
              {tierInfo.label}
            </Badge>
          )}
        </div>
        {project.description && (
          <p className="text-stone-600">{project.description}</p>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="kanban" className="space-y-6">
        <TabsList className="bg-stone-100 p-1">
          <TabsTrigger value="kanban" className="gap-2">
            <Kanban className="h-4 w-4" />
            Kanban
          </TabsTrigger>
          <TabsTrigger value="prd" className="gap-2">
            <FileText className="h-4 w-4" />
            PRD
          </TabsTrigger>
          <TabsTrigger value="files" className="gap-2">
            <FolderOpen className="h-4 w-4" />
            Files
          </TabsTrigger>
          <TabsTrigger value="secrets" className="gap-2">
            <Key className="h-4 w-4" />
            Secrets
          </TabsTrigger>
          <TabsTrigger value="urls" className="gap-2">
            <Link2 className="h-4 w-4" />
            URLs
          </TabsTrigger>
          <TabsTrigger value="design" className="gap-2">
            <Palette className="h-4 w-4" />
            Design
          </TabsTrigger>
        </TabsList>

        <TabsContent value="kanban">
          <KanbanBoard
            projectId={project.id}
            initialPhases={phases}
            initialTasks={tasks}
          />
        </TabsContent>

        <TabsContent value="prd">
          <PRDEditor projectId={project.id} initialContent={project.prd_content} />
        </TabsContent>

        <TabsContent value="files">
          <FileAttachments projectId={project.id} attachments={attachments} />
        </TabsContent>

        <TabsContent value="secrets">
          <SecretsVault projectId={project.id} initialSecrets={secrets} />
        </TabsContent>

        <TabsContent value="urls">
          <URLsSection projectId={project.id} initialUrls={urls} />
        </TabsContent>

        <TabsContent value="design">
          <DesignSpec projectId={project.id} initialDesign={design} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

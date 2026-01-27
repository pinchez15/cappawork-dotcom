"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "./kanban-board";
import { PRDEditor } from "./prd-editor";
import { SecretsVault } from "./secrets-vault";
import { URLsSection } from "./urls-section";
import { DesignSpec } from "./design-spec";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProjectDetailViewProps {
  project: any;
  phases: any[];
  tasks: any[];
  secrets: any[];
  urls: any[];
  design: any;
}

export function ProjectDetailView({
  project,
  phases,
  tasks,
  secrets,
  urls,
  design,
}: ProjectDetailViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <h1 className="text-3xl font-semibold text-stone-900">
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
        </div>
        {project.description && (
          <p className="text-stone-600 mt-2">{project.description}</p>
        )}
      </div>

      <Tabs defaultValue="kanban" className="space-y-6">
        <TabsList>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="prd">PRD</TabsTrigger>
          <TabsTrigger value="secrets">Secrets</TabsTrigger>
          <TabsTrigger value="urls">URLs</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
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


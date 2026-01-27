"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientKanbanView } from "./client-kanban-view";
import { ClientURLs } from "./client-urls";
import { ClientDesignSpec } from "./client-design-spec";
import { ClientAttachments } from "./client-attachments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface ClientProjectViewProps {
  project: any;
  phases: any[];
  tasks: any[];
  urls: any[];
  design: any;
  attachments: any[];
}

export function ClientProjectView({
  project,
  phases,
  tasks,
  urls,
  design,
  attachments,
}: ClientProjectViewProps) {
  const handoffPhase = phases.find((p) => p.name === "Handoff");
  const isHandoffReady = handoffPhase && tasks.some(
    (t) => t.phase_id === handoffPhase.id && t.is_completed
  );

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

      {isHandoffReady && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium text-green-900">
                    Project Ready for Handoff
                  </div>
                  <div className="text-sm text-green-700">
                    Access all credentials and final documentation
                  </div>
                </div>
              </div>
              <Link href={`/projects/${project.id}/handoff`}>
                <Button>View Handoff</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="urls">URLs</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <ClientKanbanView phases={phases} tasks={tasks} />
        </TabsContent>

        <TabsContent value="files">
          <ClientAttachments attachments={attachments} />
        </TabsContent>

        <TabsContent value="urls">
          <ClientURLs urls={urls} />
        </TabsContent>

        <TabsContent value="design">
          <ClientDesignSpec design={design} />
        </TabsContent>
      </Tabs>
    </div>
  );
}


"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClientKanbanView } from "./client-kanban-view";
import { ClientURLs } from "./client-urls";
import { ClientDesignSpec } from "./client-design-spec";
import { ClientAttachments } from "./client-attachments";
import { ClientDashboard } from "./client-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, LayoutDashboard, Kanban, FileText, Link2, Palette } from "lucide-react";
import { getTierInfo, animations } from "@/lib/animations";

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
  const [activeTab, setActiveTab] = useState("dashboard");

  const handoffPhase = phases.find((p) => p.name === "Handoff");
  const isHandoffReady = handoffPhase && tasks.some(
    (t) => t.phase_id === handoffPhase.id && t.is_completed
  );

  const tierInfo = getTierInfo(project.service_tier);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${animations.fadeIn}`}>
      {/* Handoff Ready Banner */}
      {isHandoffReady && (
        <Card className="mb-6 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
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
                <Button className="bg-green-600 hover:bg-green-700">View Handoff</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <div className="border-b">
          <TabsList className="bg-transparent h-auto p-0 space-x-1">
            <TabsTrigger
              value="dashboard"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 text-stone-600 data-[state=active]:text-stone-900"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 text-stone-600 data-[state=active]:text-stone-900"
            >
              <Kanban className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 text-stone-600 data-[state=active]:text-stone-900"
            >
              <FileText className="h-4 w-4 mr-2" />
              Files
              {attachments.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {attachments.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="urls"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 text-stone-600 data-[state=active]:text-stone-900"
            >
              <Link2 className="h-4 w-4 mr-2" />
              Links
              {urls.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                  {urls.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="design"
              className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 py-3 text-stone-600 data-[state=active]:text-stone-900"
            >
              <Palette className="h-4 w-4 mr-2" />
              Design
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="dashboard" className="mt-6">
          <ClientDashboard
            project={project}
            phases={phases}
            tasks={tasks}
            onTabChange={handleTabChange}
          />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <ClientKanbanView phases={phases} tasks={tasks} />
        </TabsContent>

        <TabsContent value="files" className="mt-6">
          <ClientAttachments attachments={attachments} />
        </TabsContent>

        <TabsContent value="urls" className="mt-6">
          <ClientURLs urls={urls} />
        </TabsContent>

        <TabsContent value="design" className="mt-6">
          <ClientDesignSpec design={design} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

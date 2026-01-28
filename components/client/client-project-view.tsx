"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ClientKanbanView } from "./client-kanban-view";
import { ClientURLs } from "./client-urls";
import { ClientDesignSpec } from "./client-design-spec";
import { ClientAttachments } from "./client-attachments";
import { ClientDashboard } from "./client-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { animations } from "@/lib/animations";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Map URL tab param to internal tab value
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "progress" ? "progress"
    : tabParam === "files" ? "files"
    : tabParam === "urls" ? "urls"
    : tabParam === "design" ? "design"
    : "dashboard";

  const handoffPhase = phases.find((p) => p.name === "Handoff");
  const isHandoffReady = handoffPhase && tasks.some(
    (t) => t.phase_id === handoffPhase.id && t.is_completed
  );

  const handleTabChange = (tab: string) => {
    // Update URL when tab changes (for dashboard cards that use onTabChange)
    if (tab === "dashboard") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?tab=${tab}`);
    }
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

      {/* Tab Content - Navigation is handled by sidebar */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsContent value="dashboard" className="mt-0">
          <ClientDashboard
            project={project}
            phases={phases}
            tasks={tasks}
            onTabChange={handleTabChange}
          />
        </TabsContent>

        <TabsContent value="progress" className="mt-0">
          <ClientKanbanView phases={phases} tasks={tasks} />
        </TabsContent>

        <TabsContent value="files" className="mt-0">
          <ClientAttachments attachments={attachments} />
        </TabsContent>

        <TabsContent value="urls" className="mt-0">
          <ClientURLs urls={urls} />
        </TabsContent>

        <TabsContent value="design" className="mt-0">
          <ClientDesignSpec design={design} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

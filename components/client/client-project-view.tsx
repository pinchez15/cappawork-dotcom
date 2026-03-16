"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ClientKanbanView } from "./client-kanban-view";
import { ClientURLs } from "./client-urls";
import { ClientDesignSpec } from "./client-design-spec";
import { ClientQuestionnaire } from "./client-questionnaire";
import { ClientAttachments } from "./client-attachments";
import { ClientDashboard } from "./client-dashboard";
import { ClientMessages } from "./client-messages";
import { ClientMeetings } from "./client-meetings";
import { ClientSowView } from "./client-sow-view";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { animations } from "@/lib/animations";

interface Message {
  id: string;
  project_id: string;
  sender_profile_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender: {
    id: string;
    name: string | null;
    email: string;
    is_admin: boolean;
  };
}

interface Meeting {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location_url: string | null;
  status: string;
  invitee_name: string | null;
  invitee_email: string | null;
  event_type_name: string | null;
  calendly_cancel_url: string | null;
}

interface ClientProjectViewProps {
  project: any;
  phases: any[];
  tasks: any[];
  urls: any[];
  design: any;
  questionnaire: any;
  attachments: any[];
  messages?: Message[];
  meetings?: Meeting[];
  sowDocuments?: any[];
  billingLinks?: any[];
  currentProfileId?: string;
  currentUserName?: string;
  currentUserEmail?: string;
}

export function ClientProjectView({
  project,
  phases,
  tasks,
  urls,
  design,
  questionnaire,
  attachments,
  messages = [],
  meetings = [],
  sowDocuments = [],
  billingLinks = [],
  currentProfileId,
  currentUserName = "",
  currentUserEmail = "",
}: ClientProjectViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Map URL tab param to internal tab value
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "progress" ? "progress"
    : tabParam === "files" ? "files"
    : tabParam === "urls" ? "urls"
    : tabParam === "vision" ? "vision"
    : tabParam === "design" ? "design"
    : tabParam === "messages" ? "messages"
    : tabParam === "meetings" ? "meetings"
    : tabParam === "contract" ? "contract"
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

        <TabsContent value="vision" className="mt-0">
          <ClientQuestionnaire questionnaire={questionnaire} projectId={project.id} />
        </TabsContent>

        <TabsContent value="design" className="mt-0">
          <ClientDesignSpec design={design} projectId={project.id} />
        </TabsContent>

        <TabsContent value="messages" className="mt-0">
          <ClientMessages
            projectId={project.id}
            messages={messages}
            currentProfileId={currentProfileId || ""}
          />
        </TabsContent>

        <TabsContent value="meetings" className="mt-0">
          <ClientMeetings
            projectId={project.id}
            meetings={meetings}
            currentUserName={currentUserName}
            currentUserEmail={currentUserEmail}
          />
        </TabsContent>

        <TabsContent value="contract" className="mt-0">
          <ClientSowView
            sowDocuments={sowDocuments}
            billingLinks={billingLinks}
            phases={phases}
            tasks={tasks}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

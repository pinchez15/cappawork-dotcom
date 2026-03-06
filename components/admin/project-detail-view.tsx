"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "./kanban-board";
import { PRDEditor } from "./prd-editor";
import { SecretsVault } from "./secrets-vault";
import { URLsSection } from "./urls-section";
import { DesignSpec } from "./design-spec";
import { FileAttachments } from "./file-attachments";
import { ProjectClientAssignment } from "./project-client-assignment";
import { ProjectMessages } from "./project-messages";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getTierInfo } from "@/lib/animations";
import { deleteProjectAction } from "@/server/actions/projects";
import { ProjectMeetings } from "./project-meetings";
import { ProjectQuestionnaireView } from "./project-questionnaire-view";
import { Kanban, FileText, FolderOpen, Key, Link2, Palette, Lightbulb, Trash2, MessageCircle, Calendar } from "lucide-react";

interface Organization {
  id: string;
  name: string;
  slug: string | null;
}

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
  calendly_event_id: string;
  title: string;
  start_time: string;
  end_time: string;
  location_url: string | null;
  status: string;
  invitee_name: string | null;
  invitee_email: string | null;
  event_type_name: string | null;
}

interface ProjectDetailViewProps {
  project: any;
  phases: any[];
  tasks: any[];
  secrets: any[];
  urls: any[];
  design: any;
  questionnaire: any;
  attachments: any[];
  currentOrganization?: Organization | null;
  allOrganizations?: Organization[];
  messages?: Message[];
  meetings?: Meeting[];
  unassignedMeetings?: Meeting[];
  currentProfileId?: string;
}

export function ProjectDetailView({
  project,
  phases,
  tasks,
  secrets,
  urls,
  design,
  questionnaire,
  attachments,
  currentOrganization,
  allOrganizations,
  messages = [],
  meetings = [],
  unassignedMeetings = [],
  currentProfileId,
}: ProjectDetailViewProps) {
  const tierInfo = getTierInfo(project.service_tier);
  const [isDeleting, setIsDeleting] = useState(false);

  const unreadCount = messages.filter(
    (m) => !m.is_read && m.sender_profile_id !== currentProfileId
  ).length;

  return (
    <div className="p-6 overflow-hidden min-w-0">
      {/* Project Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-semibold text-foreground">
            {project.name}
          </h1>
          <Badge
            className={
              project.status === "active"
                ? "bg-gold/20 text-gold"
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
          {allOrganizations !== undefined && (
            <ProjectClientAssignment
              projectId={project.id}
              currentOrganization={currentOrganization ?? null}
              allOrganizations={allOrganizations}
              variant="compact"
            />
          )}
          <div className="ml-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete &ldquo;{project.name}&rdquo;?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this project and all associated data including kanban boards, secrets, files, URLs, and design specs. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-600 hover:bg-red-700"
                    disabled={isDeleting}
                    onClick={async () => {
                      setIsDeleting(true);
                      await deleteProjectAction(project.id);
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Delete Project"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        {project.description && (
          <p className="text-stone-500">{project.description}</p>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="kanban" className="space-y-6">
        <TabsList className="bg-card-light p-1">
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
          <TabsTrigger value="vision" className="gap-2">
            <Lightbulb className="h-4 w-4" />
            Vision
          </TabsTrigger>
          <TabsTrigger value="design" className="gap-2">
            <Palette className="h-4 w-4" />
            Design
          </TabsTrigger>
          <TabsTrigger value="messages" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Messages
            {unreadCount > 0 && (
              <Badge className="ml-1 h-5 px-1.5 text-xs bg-blue-600 text-white">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="meetings" className="gap-2">
            <Calendar className="h-4 w-4" />
            Meetings
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

        <TabsContent value="vision">
          <ProjectQuestionnaireView questionnaire={questionnaire} />
        </TabsContent>

        <TabsContent value="design">
          <DesignSpec projectId={project.id} initialDesign={design} />
        </TabsContent>

        <TabsContent value="messages">
          <ProjectMessages
            projectId={project.id}
            messages={messages}
            currentProfileId={currentProfileId || ""}
          />
        </TabsContent>

        <TabsContent value="meetings">
          <ProjectMeetings
            projectId={project.id}
            meetings={meetings}
            unassignedMeetings={unassignedMeetings}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignProjectToOrg } from "@/server/actions/organizations";
import { Plus, X, FolderKanban } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
  status: string;
  organization_id: string | null;
}

interface ProjectAssignmentProps {
  organizationId: string;
  assignedProjects: Project[];
  availableProjects: Project[];
}

export function ProjectAssignment({
  organizationId,
  assignedProjects,
  availableProjects,
}: ProjectAssignmentProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedProject, setSelectedProject] = useState<string>("");

  const unassignedProjects = availableProjects.filter(
    (p) => p.organization_id === null
  );

  const handleAssign = () => {
    if (!selectedProject) return;

    startTransition(async () => {
      await assignProjectToOrg(selectedProject, organizationId);
      setSelectedProject("");
    });
  };

  const handleUnassign = (projectId: string) => {
    startTransition(async () => {
      await assignProjectToOrg(projectId, null);
    });
  };

  function getStatusColor(status: string) {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "on_hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-stone-100 text-stone-800";
    }
  }

  return (
    <div className="space-y-4">
      {assignedProjects.length === 0 ? (
        <div className="text-center py-6">
          <FolderKanban className="mx-auto h-8 w-8 text-stone-400 mb-2" />
          <p className="text-sm text-stone-500">No projects assigned yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {assignedProjects.map((project) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-3 bg-stone-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="font-medium text-stone-900 hover:text-blue-600"
                >
                  {project.name}
                </Link>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUnassign(project.id)}
                disabled={isPending}
                className="text-stone-500 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {unassignedProjects.length > 0 && (
        <div className="flex gap-2 pt-4 border-t">
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Select a project to assign..." />
            </SelectTrigger>
            <SelectContent>
              {unassignedProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAssign}
            disabled={!selectedProject || isPending}
          >
            <Plus className="h-4 w-4 mr-1" />
            Assign
          </Button>
        </div>
      )}

      {unassignedProjects.length === 0 && assignedProjects.length > 0 && (
        <p className="text-sm text-stone-500 pt-4 border-t">
          All projects are assigned. Create a new project to assign it here.
        </p>
      )}
    </div>
  );
}

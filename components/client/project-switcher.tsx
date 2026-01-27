"use client";

import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getTierInfo } from "@/lib/animations";
import { FolderKanban } from "lucide-react";

interface ProjectSwitcherProps {
  currentProject: any;
  projects: any[];
}

export function ProjectSwitcher({
  currentProject,
  projects,
}: ProjectSwitcherProps) {
  const router = useRouter();

  const handleProjectChange = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  if (projects.length <= 1) {
    return null;
  }

  return (
    <Select
      value={currentProject.id}
      onValueChange={handleProjectChange}
    >
      <SelectTrigger className="w-full">
        <div className="flex items-center gap-2 truncate">
          <FolderKanban className="h-4 w-4 flex-shrink-0" />
          <SelectValue>
            <span className="truncate">{currentProject.name}</span>
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {projects.map((project) => {
          const tierInfo = getTierInfo(project.service_tier);
          return (
            <SelectItem key={project.id} value={project.id}>
              <div className="flex items-center gap-2">
                <FolderKanban className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                <span className="truncate">{project.name}</span>
                <Badge
                  variant="outline"
                  className={`ml-auto text-xs ${tierInfo.colors.text}`}
                >
                  {tierInfo.label}
                </Badge>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { getTierInfo } from "@/lib/animations";
import {
  Kanban,
  FileText,
  FolderOpen,
  Key,
  Link2,
  Palette,
  ArrowLeft,
} from "lucide-react";

interface AdminProjectSidebarProps {
  project: any;
}

export function AdminProjectSidebar({ project }: AdminProjectSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tierInfo = getTierInfo(project.service_tier);

  // Get current tab from URL
  const currentTab = searchParams.get("tab") || "kanban";

  const navItems = [
    {
      title: "Kanban",
      icon: Kanban,
      href: `/admin/projects/${project.id}`,
      tab: "kanban",
    },
    {
      title: "PRD",
      icon: FileText,
      href: `/admin/projects/${project.id}?tab=prd`,
      tab: "prd",
    },
    {
      title: "Files",
      icon: FolderOpen,
      href: `/admin/projects/${project.id}?tab=files`,
      tab: "files",
    },
    {
      title: "Secrets",
      icon: Key,
      href: `/admin/projects/${project.id}?tab=secrets`,
      tab: "secrets",
    },
    {
      title: "URLs",
      icon: Link2,
      href: `/admin/projects/${project.id}?tab=urls`,
      tab: "urls",
    },
    {
      title: "Design",
      icon: Palette,
      href: `/admin/projects/${project.id}?tab=design`,
      tab: "design",
    },
  ];

  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">Back to Projects</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Project Info */}
        <SidebarGroup>
          <SidebarGroupContent className="px-2 pt-2">
            <div className="rounded-lg border bg-card p-3 group-data-[collapsible=icon]:p-2">
              <div className="flex items-center gap-2 mb-2 group-data-[collapsible=icon]:justify-center">
                <h3 className="font-medium text-sm truncate flex-1 group-data-[collapsible=icon]:hidden">
                  {project.name}
                </h3>
                <Badge
                  className={
                    project.status === "active"
                      ? "bg-blue-100 text-blue-800"
                      : project.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }
                >
                  <span className="group-data-[collapsible=icon]:hidden">{project.status}</span>
                  <span className="hidden group-data-[collapsible=icon]:inline">
                    {project.status === "active" ? "A" : project.status === "completed" ? "C" : "H"}
                  </span>
                </Badge>
              </div>
              {project.service_tier && (
                <Badge className={`${tierInfo.colors.bg} text-white text-xs group-data-[collapsible=icon]:hidden`}>
                  {tierInfo.label}
                </Badge>
              )}
              {project.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2 group-data-[collapsible=icon]:hidden">
                  {project.description}
                </p>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isProjectPage = pathname === `/admin/projects/${project.id}`;
                const isActive = item.tab === "kanban"
                  ? (isProjectPage && !searchParams.get("tab"))
                  : (isProjectPage && item.tab === currentTab);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4 group-data-[collapsible=icon]:p-2">
        <div className="text-xs text-muted-foreground group-data-[collapsible=icon]:hidden">
          Project ID: {project.id.slice(0, 8)}...
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

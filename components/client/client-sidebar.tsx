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
import { ProjectSwitcher } from "./project-switcher";
import { getTierInfo } from "@/lib/animations";
import {
  LayoutDashboard,
  Kanban,
  FileText,
  Link2,
  Palette,
  Key,
  MessageCircle,
} from "lucide-react";

interface ClientSidebarProps {
  project: any;
  projects: any[];
  attachmentsCount?: number;
  urlsCount?: number;
  isHandoffReady?: boolean;
}

export function ClientSidebar({
  project,
  projects,
  attachmentsCount = 0,
  urlsCount = 0,
  isHandoffReady = false,
}: ClientSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tierInfo = getTierInfo(project.service_tier);

  // Get current tab from URL
  const currentTab = searchParams.get("tab") || "dashboard";

  const navItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: `/projects/${project.id}`,
      tab: "dashboard",
      badge: null,
    },
    {
      title: "Progress",
      icon: Kanban,
      href: `/projects/${project.id}?tab=progress`,
      tab: "progress",
      badge: null,
    },
    {
      title: "Files",
      icon: FileText,
      href: `/projects/${project.id}?tab=files`,
      tab: "files",
      badge: attachmentsCount > 0 ? attachmentsCount : null,
    },
    {
      title: "Links",
      icon: Link2,
      href: `/projects/${project.id}?tab=urls`,
      tab: "urls",
      badge: urlsCount > 0 ? urlsCount : null,
    },
    {
      title: "Design",
      icon: Palette,
      href: `/projects/${project.id}?tab=design`,
      tab: "design",
      badge: null,
    },
  ];

  // Add handoff when ready
  if (isHandoffReady) {
    navItems.push({
      title: "Handoff",
      icon: Key,
      href: `/projects/${project.id}/handoff`,
      tab: "handoff",
      badge: null,
    });
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <Link href="/projects" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">C</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">CappaWork</span>
            <span className="text-xs text-muted-foreground">Client Portal</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Project Switcher */}
        {projects.length > 1 && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Project</SidebarGroupLabel>
              <SidebarGroupContent>
                <ProjectSwitcher
                  currentProject={project}
                  projects={projects}
                />
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
          </>
        )}

        {/* Current Project Info */}
        <SidebarGroup>
          <SidebarGroupContent className="px-2">
            <div className="rounded-lg border bg-card p-3">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium text-sm truncate flex-1">
                  {project.name}
                </h3>
                <Badge className={`${tierInfo.colors.bg} text-white text-xs`}>
                  {tierInfo.label}
                </Badge>
              </div>
              {project.description && (
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              )}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                // Check if this item is active based on current tab or handoff path
                const isProjectPage = pathname === `/projects/${project.id}`;
                const isHandoffPage = pathname === `/projects/${project.id}/handoff`;
                const isActive = item.tab === "handoff"
                  ? isHandoffPage
                  : (isProjectPage && item.tab === currentTab);

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto h-5 px-1.5 text-xs"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Support */}
        <SidebarGroup>
          <SidebarGroupLabel>Help</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a
                    href="mailto:support@cappawork.com"
                    className="flex items-center"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Contact Support</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          <Link
            href="https://cappawork.com"
            target="_blank"
            className="hover:text-foreground transition-colors"
          >
            cappawork.com
          </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ActivityEvent = {
  id: string;
  created_at: string;
  event_type: string;
  metadata: Record<string, unknown>;
  profile: { id: string; name: string | null; email: string } | null;
  project: { id: string; name: string } | null;
};

type Props = {
  events: ActivityEvent[];
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventTypeBadge({ type }: { type: string }) {
  const config: Record<string, { label: string; className: string }> = {
    page_view: {
      label: "Page View",
      className: "bg-blue-100 text-blue-800",
    },
    login: {
      label: "Login",
      className: "bg-green-100 text-green-800",
    },
    file_download: {
      label: "Download",
      className: "bg-purple-100 text-purple-800",
    },
  };

  const { label, className } = config[type] || {
    label: type,
    className: "bg-stone-100 text-stone-800",
  };

  return <Badge className={className}>{label}</Badge>;
}

export function ActivityTable({ events }: Props) {
  const [projectFilter, setProjectFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const projects = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of events) {
      if (e.project) map.set(e.project.id, e.project.name);
    }
    return Array.from(map.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [events]);

  const users = useMemo(() => {
    const map = new Map<string, { name: string | null; email: string }>();
    for (const e of events) {
      if (e.profile) map.set(e.profile.id, { name: e.profile.name, email: e.profile.email });
    }
    return Array.from(map.entries()).sort((a, b) =>
      (a[1].name || a[1].email).localeCompare(b[1].name || b[1].email)
    );
  }, [events]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (projectFilter !== "all" && e.project?.id !== projectFilter) return false;
      if (userFilter !== "all" && e.profile?.id !== userFilter) return false;
      return true;
    });
  }, [events, projectFilter, userFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={projectFilter} onValueChange={setProjectFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Projects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map(([id, name]) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={userFilter} onValueChange={setUserFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Users" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users.map(([id, user]) => (
              <SelectItem key={id} value={id}>
                {user.name || user.email}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {events.length} events
      </p>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="text-sm text-stone-500">No activity matches the current filters.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 pr-4 font-medium text-stone-600">
                  Timestamp
                </th>
                <th className="pb-3 pr-4 font-medium text-stone-600">
                  User
                </th>
                <th className="pb-3 pr-4 font-medium text-stone-600">
                  Event
                </th>
                <th className="pb-3 font-medium text-stone-600">
                  Project
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((event) => (
                <tr key={event.id} className="hover:bg-stone-50">
                  <td className="py-3 pr-4 text-stone-600 whitespace-nowrap">
                    {formatDate(event.created_at)}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="font-medium text-stone-900">
                      {event.profile?.name || "Unknown"}
                    </div>
                    <div className="text-xs text-stone-500">
                      {event.profile?.email}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <EventTypeBadge type={event.event_type} />
                  </td>
                  <td className="py-3 text-stone-700">
                    {event.project?.name || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  assignMeetingToProjectAction,
  syncCalendlyMeetings,
} from "@/server/actions/meetings";
import {
  Calendar,
  Video,
  RefreshCw,
  Plus,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

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

interface ProjectMeetingsProps {
  projectId: string;
  meetings: Meeting[];
  unassignedMeetings: Meeting[];
}

function meetingStatusBadge(status: string) {
  const variants: Record<string, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-stone-100 text-stone-500",
  };
  return (
    <Badge className={variants[status] || "bg-stone-100 text-stone-800"}>
      {status}
    </Badge>
  );
}

export function ProjectMeetings({
  projectId,
  meetings,
  unassignedMeetings,
}: ProjectMeetingsProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState<string | null>(null);

  const now = new Date();
  const upcoming = meetings
    .filter((m) => m.status === "scheduled" && new Date(m.start_time) >= now)
    .sort(
      (a, b) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  const past = meetings
    .filter((m) => m.status !== "scheduled" || new Date(m.start_time) < now)
    .sort(
      (a, b) =>
        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
    );

  async function handleSync() {
    setIsSyncing(true);
    try {
      await syncCalendlyMeetings();
      toast.success("Meetings synced from Calendly");
    } catch (err: any) {
      toast.error(err.message || "Failed to sync meetings");
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleAssign(meetingId: string) {
    setIsAssigning(meetingId);
    try {
      await assignMeetingToProjectAction(meetingId, projectId);
      toast.success("Meeting assigned to project");
      setAssignDialogOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to assign meeting");
    } finally {
      setIsAssigning(null);
    }
  }

  function formatDateTime(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Meetings
        </h2>
        <div className="flex gap-2">
          <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Assign Meeting
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Meeting to Project</DialogTitle>
                <DialogDescription>
                  Select an unassigned meeting to link to this project
                </DialogDescription>
              </DialogHeader>
              {unassignedMeetings.length === 0 ? (
                <p className="text-sm text-stone-500 py-4">
                  No unassigned meetings found. Try syncing from Calendly first.
                </p>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {unassignedMeetings.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-sm">{m.title}</div>
                        <div className="text-xs text-stone-500">
                          {formatDateTime(m.start_time)}
                          {m.invitee_name && ` — ${m.invitee_name}`}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAssign(m.id)}
                        disabled={isAssigning === m.id}
                      >
                        {isAssigning === m.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          "Assign"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleSync} disabled={isSyncing}>
            {isSyncing ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Sync from Calendly
          </Button>
        </div>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Invitee</TableHead>
                  <TableHead>Meet Link</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcoming.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDateTime(m.start_time)}
                    </TableCell>
                    <TableCell className="text-sm">{m.title}</TableCell>
                    <TableCell className="text-sm">
                      {m.invitee_name || m.invitee_email || "—"}
                    </TableCell>
                    <TableCell>
                      {m.location_url ? (
                        <a
                          href={m.location_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button variant="ghost" size="sm">
                            <Video className="h-3 w-3 mr-1" />
                            Join
                          </Button>
                        </a>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell>{meetingStatusBadge(m.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Past */}
      {past.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Past Meetings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Invitee</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {past.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-sm whitespace-nowrap">
                      {formatDateTime(m.start_time)}
                    </TableCell>
                    <TableCell className="text-sm">{m.title}</TableCell>
                    <TableCell className="text-sm">
                      {m.invitee_name || m.invitee_email || "—"}
                    </TableCell>
                    <TableCell>{meetingStatusBadge(m.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {meetings.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-8 w-8 text-stone-400 mx-auto mb-3" />
            <p className="text-stone-500">No meetings for this project yet</p>
            <p className="text-sm text-stone-400 mt-1">
              Sync from Calendly or assign existing meetings
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

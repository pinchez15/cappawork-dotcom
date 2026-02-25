"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignProjectToOrg } from "@/server/actions/organizations";
import { Building2, ExternalLink, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";

interface Organization {
  id: string;
  name: string;
  slug: string | null;
}

interface ProjectClientAssignmentProps {
  projectId: string;
  currentOrganization: Organization | null;
  allOrganizations: Organization[];
}

export function ProjectClientAssignment({
  projectId,
  currentOrganization,
  allOrganizations,
}: ProjectClientAssignmentProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [isReassigning, setIsReassigning] = useState(false);

  const handleAssign = () => {
    if (!selectedOrgId) return;
    startTransition(async () => {
      await assignProjectToOrg(projectId, selectedOrgId);
      setSelectedOrgId("");
      setIsReassigning(false);
    });
  };

  const handleUnassign = () => {
    startTransition(async () => {
      await assignProjectToOrg(projectId, null);
    });
  };

  // Assigned state
  if (currentOrganization && !isReassigning) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-700 uppercase tracking-wide">
                Assigned to
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-stone-900">
                  {currentOrganization.name}
                </span>
                <Link
                  href={`/admin/clients/${currentOrganization.id}`}
                  className="text-stone-400 hover:text-emerald-700 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReassigning(true)}
              disabled={isPending}
              className="text-stone-500 hover:text-stone-900 text-xs"
            >
              Reassign
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleUnassign}
              disabled={isPending}
              className="text-stone-400 hover:text-red-600 text-xs"
            >
              {isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Remove"
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Unassigned state (or reassigning)
  return (
    <div
      className={`rounded-lg border p-4 ${
        isReassigning
          ? "border-blue-200 bg-blue-50/50"
          : "border-amber-200 bg-amber-50/50"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isReassigning ? "bg-blue-100" : "bg-amber-100"
          }`}
        >
          {isReassigning ? (
            <Building2 className="h-4.5 w-4.5 text-blue-600" />
          ) : (
            <AlertTriangle className="h-4.5 w-4.5 text-amber-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              isReassigning ? "text-blue-900" : "text-amber-900"
            }`}
          >
            {isReassigning
              ? `Reassigning from ${currentOrganization?.name}`
              : "No client assigned"}
          </p>
          <p
            className={`text-xs mt-0.5 ${
              isReassigning ? "text-blue-700" : "text-amber-700"
            }`}
          >
            {isReassigning
              ? "Select a new client for this project"
              : "Assign a client so they can access this project in their portal"}
          </p>
        </div>
        {isReassigning && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsReassigning(false);
              setSelectedOrgId("");
            }}
            className="text-xs text-stone-500 shrink-0"
          >
            Cancel
          </Button>
        )}
      </div>

      {allOrganizations.length > 0 ? (
        <div className="flex gap-2">
          <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
            <SelectTrigger className="flex-1 bg-white">
              <SelectValue placeholder="Select a client..." />
            </SelectTrigger>
            <SelectContent>
              {allOrganizations
                .filter((org) => org.id !== currentOrganization?.id)
                .map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-stone-400" />
                      {org.name}
                    </div>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAssign}
            disabled={!selectedOrgId || isPending}
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : null}
            Assign
          </Button>
        </div>
      ) : (
        <div className="text-sm text-stone-600">
          No clients exist yet.{" "}
          <Link
            href="/admin/clients/new"
            className="font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            Create your first client
          </Link>{" "}
          to get started.
        </div>
      )}
    </div>
  );
}

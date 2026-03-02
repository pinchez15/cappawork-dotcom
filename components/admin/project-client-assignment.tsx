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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  variant?: "full" | "compact";
}

export function ProjectClientAssignment({
  projectId,
  currentOrganization,
  allOrganizations,
  variant = "full",
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

  // Compact variant
  if (variant === "compact") {
    if (currentOrganization) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <button className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {currentOrganization.name}
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-2">
            <div className="space-y-1">
              <Link
                href={`/admin/clients/${currentOrganization.id}`}
                className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-stone-100 transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5 text-stone-400" />
                View Client
              </Link>
              <button
                onClick={() => setIsReassigning(true)}
                disabled={isPending}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-stone-100 transition-colors"
              >
                <Building2 className="h-3.5 w-3.5 text-stone-400" />
                Reassign
              </button>
              <button
                onClick={handleUnassign}
                disabled={isPending}
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                {isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5" />
                )}
                Remove
              </button>
            </div>
            {isReassigning && allOrganizations.length > 0 && (
              <div className="mt-2 border-t pt-2 space-y-2">
                <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select client..." />
                  </SelectTrigger>
                  <SelectContent>
                    {allOrganizations
                      .filter((org) => org.id !== currentOrganization.id)
                      .map((org) => (
                        <SelectItem key={org.id} value={org.id}>
                          {org.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-1">
                  <Button size="sm" className="h-7 text-xs flex-1" onClick={handleAssign} disabled={!selectedOrgId || isPending}>
                    {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Assign"}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => { setIsReassigning(false); setSelectedOrgId(""); }}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
      );
    }

    // Compact unassigned
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            No client
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-3">
          {allOrganizations.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-medium text-stone-500">Assign a client</p>
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Select client..." />
                </SelectTrigger>
                <SelectContent>
                  {allOrganizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" className="h-7 text-xs w-full" onClick={handleAssign} disabled={!selectedOrgId || isPending}>
                {isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                Assign
              </Button>
            </div>
          ) : (
            <div className="text-xs text-stone-500">
              No clients yet.{" "}
              <Link href="/admin/clients/new" className="font-medium text-blue-600 hover:text-blue-800 underline underline-offset-2">
                Create one
              </Link>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }

  // Full variant — Assigned state
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
                <span className="text-sm font-semibold text-foreground">
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
              className="text-muted-foreground hover:text-foreground text-xs"
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
            <SelectTrigger className="flex-1 bg-background">
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

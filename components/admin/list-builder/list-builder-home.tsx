"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  ListFilter,
  Building2,
  Users,
  Target,
  RefreshCw,
  Archive,
  Copy,
  Loader2,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { List } from "@/server/repos/lists";
import { LIST_STATUSES } from "@/server/repos/lists";
import type { Vertical } from "@/server/repos/verticals";

type Stats = {
  total: number;
  active: number;
  totalAccounts: number;
  inPipeline: number;
};

type Props = {
  lists: List[];
  stats: Stats;
  verticals: Vertical[];
};

function StatusBadge({ status }: { status: string }) {
  const s = LIST_STATUSES.find((x) => x.value === status);
  return (
    <Badge className={`text-[10px] ${s?.color || "bg-stone-100"}`}>
      {s?.label || status}
    </Badge>
  );
}

export function ListBuilderHome({ lists: initialLists, stats }: Props) {
  const router = useRouter();
  const [lists, setLists] = useState(initialLists);
  const [actioning, setActioning] = useState<string | null>(null);

  async function handleClone(listId: string) {
    setActioning(listId);
    try {
      const res = await fetch(`/api/admin/lists/${listId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "clone" }),
      });
      const cloned = await res.json();
      if (res.ok) {
        setLists((prev) => [cloned, ...prev]);
        router.push(`/admin/list-builder/${cloned.id}`);
      }
    } finally {
      setActioning(null);
    }
  }

  async function handleArchive(listId: string) {
    setActioning(listId);
    try {
      await fetch(`/api/admin/lists/${listId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "archive" }),
      });
      setLists((prev) =>
        prev.map((l) => (l.id === listId ? { ...l, status: "archived" } : l))
      );
    } finally {
      setActioning(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">List Builder</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Define ICP, discover accounts, score fit, generate hypotheses, push to CRM.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/list-builder/settings">
              Settings
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/list-builder/signals">
              <Radio className="h-4 w-4 mr-2" />
              Signal Inbox
            </Link>
          </Button>
          <Button asChild>
            <Link href="/admin/list-builder/new">
              <Plus className="h-4 w-4 mr-2" />
              Create List
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <ListFilter className="h-3.5 w-3.5" /> Lists
            </div>
            <div className="text-2xl font-bold mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Building2 className="h-3.5 w-3.5" /> Accounts
            </div>
            <div className="text-2xl font-bold mt-1">{stats.totalAccounts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <RefreshCw className="h-3.5 w-3.5" /> Active
            </div>
            <div className="text-2xl font-bold mt-1">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Target className="h-3.5 w-3.5" /> In Pipeline
            </div>
            <div className="text-2xl font-bold mt-1">{stats.inPipeline}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>List</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Accounts</TableHead>
              <TableHead className="text-right">Contacts</TableHead>
              <TableHead className="text-right">Avg Fit</TableHead>
              <TableHead>Pipeline</TableHead>
              <TableHead>Last Run</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {lists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  No lists yet. Create your first ICP list to start prospecting.
                </TableCell>
              </TableRow>
            ) : (
              lists.map((list) => (
                <TableRow
                  key={list.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/list-builder/${list.id}`)}
                >
                  <TableCell>
                    <div className="font-medium">{list.name}</div>
                    {list.description && (
                      <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {list.description}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={list.status} />
                  </TableCell>
                  <TableCell className="capitalize text-xs">{list.source_provider}</TableCell>
                  <TableCell className="text-right tabular-nums">{list.total_accounts}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    <span className="flex items-center justify-end gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      {list.total_contacts}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {list.avg_fit_score > 0 ? (
                      <Badge
                        className={`text-[10px] ${
                          list.avg_fit_score >= 70
                            ? "bg-green-100 text-green-700"
                            : list.avg_fit_score >= 50
                              ? "bg-blue-100 text-blue-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {list.avg_fit_score}
                      </Badge>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {list.status === "ready" ? "active" : list.status}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {list.last_run_at
                      ? new Date(list.last_run_at).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div
                      className="flex gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={actioning === list.id}
                        onClick={() => handleClone(list.id)}
                      >
                        {actioning === list.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        disabled={actioning === list.id || list.status === "archived"}
                        onClick={() => handleArchive(list.id)}
                      >
                        <Archive className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

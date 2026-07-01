"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Target,
  Users,
  Zap,
  Loader2,
  Upload,
  Download,
  ChevronLeft,
  RefreshCw,
  Brain,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ListWithCriteria } from "@/server/repos/lists";
import { LIST_STATUSES } from "@/server/repos/lists";
import type { ListAccount } from "@/server/repos/list-memberships";
import type { ListRun } from "@/server/repos/list-runs";
import { AccountDetailDrawer } from "./account-detail-drawer";

type Props = {
  list: ListWithCriteria;
  initialAccounts: ListAccount[];
  runs: ListRun[];
};

function ScoreBadge({ score, label }: { score: number; label?: string }) {
  const color =
    score >= 70
      ? "bg-green-100 text-green-700"
      : score >= 50
        ? "bg-blue-100 text-blue-700"
        : score >= 30
          ? "bg-amber-100 text-amber-700"
          : "bg-stone-100 text-stone-600";
  return (
    <Badge className={`text-[10px] tabular-nums ${color}`} title={label}>
      {score}
    </Badge>
  );
}

export function ListReviewTable({ list, initialAccounts, runs }: Props) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [running, setRunning] = useState<string | null>(null);
  const [drawerAccountId, setDrawerAccountId] = useState<string | null>(null);
  const [listStatus, setListStatus] = useState(list.status);

  const latestRun = runs[0];
  const isProcessing = ["generating", "enriching", "scoring"].includes(listStatus);

  const refreshAccounts = useCallback(async () => {
    const res = await fetch(`/api/admin/lists/${list.id}/accounts`);
    const data = await res.json();
    if (data.accounts) setAccounts(data.accounts);
  }, [list.id]);

  async function runAction(
    action: string,
    accountIds?: string[]
  ) {
    setRunning(action);
    try {
      await fetch(`/api/admin/lists/${list.id}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, account_ids: accountIds }),
      });
      setListStatus(
        action === "generate"
          ? "generating"
          : action === "enrich"
            ? "enriching"
            : action === "score"
              ? "scoring"
              : listStatus
      );
      // Poll for completion
      setTimeout(refreshAccounts, 3000);
      setTimeout(refreshAccounts, 8000);
      setTimeout(() => {
        refreshAccounts();
        setListStatus("review");
      }, 15000);
    } finally {
      setRunning(null);
    }
  }

  async function promoteToPipeline() {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    setRunning("promote");
    try {
      await fetch(`/api/admin/lists/${list.id}/sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_ids: ids }),
      });
      setTimeout(refreshAccounts, 2000);
    } finally {
      setRunning(null);
    }
  }

  async function handleCsvImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lines = text.split("\n").filter(Boolean);
    const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows = lines.slice(1).map((line) => {
      const values = line.split(",").map((v) => v.trim());
      const row: Record<string, string> = {};
      headers.forEach((h, i) => {
        row[h] = values[i] || "";
      });
      return {
        company_name: row.company_name || row.company || row.name || "",
        domain: row.domain || row.website || "",
        industry: row.industry || "",
        location: row.location || row.city || "",
        employee_count: row.employee_count || row.employees || "",
        contact_name: row.contact_name || row.name || "",
        contact_title: row.title || row.contact_title || "",
        contact_email: row.email || row.contact_email || "",
        linkedin_url: row.linkedin_url || row.linkedin || "",
      };
    }).filter((r) => r.company_name);

    await fetch(`/api/admin/lists/${list.id}/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    setTimeout(refreshAccounts, 2000);
  }

  function exportCsv() {
    const selected = selectedIds.size
      ? accounts.filter((a) => selectedIds.has(a.id))
      : accounts;
    const headers = [
      "company_name", "domain", "industry", "location", "employees",
      "fit_score", "pain_score", "founder_led_score", "case_study_match",
      "signal_count", "next_action", "crm_status",
    ];
    const csv = [
      headers.join(","),
      ...selected.map((a) =>
        headers.map((h) => {
          const val = (a as Record<string, unknown>)[h === "employees" ? "employee_count" : h];
          return `"${val ?? ""}"`;
        }).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${list.name.replace(/\s+/g, "-")}-export.csv`;
    a.click();
  }

  const sortedAccounts = useMemo(
    () => [...accounts].sort((a, b) => b.fit_score - a.fit_score),
    [accounts]
  );

  const statusInfo = LIST_STATUSES.find((s) => s.value === listStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/list-builder">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">{list.name}</h1>
            <Badge className={`text-[10px] ${statusInfo?.color}`}>
              {statusInfo?.label || listStatus}
            </Badge>
          </div>
          {list.description && (
            <p className="text-sm text-muted-foreground ml-10">{list.description}</p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {accounts.length === 0 && (
            <Button
              disabled={running === "generate" || isProcessing}
              onClick={() => runAction("generate")}
            >
              {running === "generate" ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              Generate List
            </Button>
          )}
          <label>
            <Button variant="outline" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Import CSV
              </span>
            </Button>
            <input type="file" accept=".csv" className="hidden" onChange={handleCsvImport} />
          </label>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={refreshAccounts}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {latestRun && latestRun.status === "running" && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="py-3 flex items-center gap-3 text-sm">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
            <span>
              Running {latestRun.run_type}… {latestRun.records_processed}
              {latestRun.records_total ? ` / ${latestRun.records_total}` : ""} processed
            </span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: "Accounts", value: accounts.length },
          { label: "Avg Fit", value: list.avg_fit_score || "—" },
          { label: "High Fit (70+)", value: accounts.filter((a) => a.fit_score >= 70).length },
          { label: "Signals", value: accounts.reduce((s, a) => s + a.signal_count, 0) },
          { label: "In Pipeline", value: accounts.filter((a) => a.review_status === "accepted").length },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-3 pb-3">
              <div className="text-xs text-muted-foreground">{stat.label}</div>
              <div className="text-xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <span className="text-sm font-medium">{selectedIds.size} selected</span>
          <Button
            size="sm"
            variant="outline"
            disabled={!!running}
            onClick={() => runAction("enrich", Array.from(selectedIds))}
          >
            <Zap className="h-3.5 w-3.5 mr-1" /> Enrich
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!!running}
            onClick={() => runAction("score", Array.from(selectedIds))}
          >
            <Target className="h-3.5 w-3.5 mr-1" /> Score
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!!running}
            onClick={() => runAction("hypothesis", Array.from(selectedIds))}
          >
            <Brain className="h-3.5 w-3.5 mr-1" /> Hypothesis
          </Button>
          <Button
            size="sm"
            disabled={running === "promote"}
            onClick={promoteToPipeline}
          >
            <Users className="h-3.5 w-3.5 mr-1" /> Promote to Pipeline
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => bulkUpdateReview("rejected")}
          >
            <XCircle className="h-3.5 w-3.5 mr-1" /> Reject
          </Button>
        </div>
      )}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">
                <Checkbox
                  checked={selectedIds.size === accounts.length && accounts.length > 0}
                  onCheckedChange={(checked) => {
                    setSelectedIds(
                      checked ? new Set(accounts.map((a) => a.id)) : new Set()
                    );
                  }}
                />
              </TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Employees</TableHead>
              <TableHead className="text-center">Fit</TableHead>
              <TableHead className="text-center">Pain</TableHead>
              <TableHead className="text-center">Founder</TableHead>
              <TableHead>Signals</TableHead>
              <TableHead>Case Study</TableHead>
              <TableHead>Next Action</TableHead>
              <TableHead>Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center py-12 text-muted-foreground">
                  {isProcessing
                    ? "Generating accounts…"
                    : "No accounts yet. Generate from Apollo or import CSV."}
                </TableCell>
              </TableRow>
            ) : (
              sortedAccounts.map((account) => (
                <TableRow
                  key={account.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setDrawerAccountId(account.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedIds.has(account.id)}
                      onCheckedChange={(checked) => {
                        setSelectedIds((prev) => {
                          const next = new Set(prev);
                          if (checked) next.add(account.id);
                          else next.delete(account.id);
                          return next;
                        });
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{account.company_name}</div>
                    {account.domain && (
                      <div className="text-xs text-muted-foreground">{account.domain}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{account.industry || "—"}</TableCell>
                  <TableCell className="text-xs">{account.location || "—"}</TableCell>
                  <TableCell className="text-right text-xs tabular-nums">
                    {account.employee_count || "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    <ScoreBadge score={account.fit_score} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ScoreBadge score={account.pain_score} />
                  </TableCell>
                  <TableCell className="text-center">
                    <ScoreBadge score={account.founder_led_score} />
                  </TableCell>
                  <TableCell className="text-xs tabular-nums">{account.signal_count}</TableCell>
                  <TableCell className="text-xs">{account.case_study_match || "—"}</TableCell>
                  <TableCell className="text-xs max-w-[140px] truncate">
                    {account.next_action || "—"}
                  </TableCell>
                  <TableCell>
                    {account.review_status === "accepted" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <span className="text-xs capitalize text-muted-foreground">{account.review_status}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {accounts.length > 0 && selectedIds.size === 0 && (
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={!!running}
            onClick={() => runAction("enrich")}
          >
            <Zap className="h-4 w-4 mr-2" /> Enrich All
          </Button>
          <Button
            variant="outline"
            disabled={!!running}
            onClick={() => runAction("score")}
          >
            <Target className="h-4 w-4 mr-2" /> Score All
          </Button>
          <Button
            variant="outline"
            disabled={!!running}
            onClick={() =>
              runAction(
                "hypothesis",
                accounts.filter((a) => a.fit_score >= 55).map((a) => a.id)
              )
            }
          >
            <Brain className="h-4 w-4 mr-2" /> Hypothesis (High Fit)
          </Button>
        </div>
      )}

      <AccountDetailDrawer
        accountId={drawerAccountId}
        listId={list.id}
        onClose={() => setDrawerAccountId(null)}
        onUpdate={refreshAccounts}
      />
    </div>
  );

  async function bulkUpdateReview(status: string) {
    await fetch(`/api/admin/lists/${list.id}/accounts`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        account_ids: Array.from(selectedIds),
        updates: { review_status: status },
      }),
    });
    refreshAccounts();
    setSelectedIds(new Set());
  }
}

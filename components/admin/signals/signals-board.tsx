"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  Building2,
  ExternalLink,
  Linkedin,
  Loader2,
  Radio,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LI_OUTREACH_STATUSES,
  LI_SIGNAL_TYPES,
  outreachStageToLiStatus,
  resolveLinkedInUrl,
  type LiOutreachStatus,
} from "@/lib/validators/li-signals";
import type { LiSignalRow } from "@/server/repos/gtm-signals";

type Stats = {
  withSignal: number;
  noSignal: number;
  highScore: number;
  avgScore: number;
  researched: number;
};

type Props = {
  initialRows: LiSignalRow[];
  stats: Stats;
};

function signalTypeMeta(type: string) {
  return LI_SIGNAL_TYPES.find((t) => t.value === type);
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 5
      ? "bg-green-100 text-green-700"
      : score >= 4
        ? "bg-blue-100 text-blue-700"
        : score >= 3
          ? "bg-amber-100 text-amber-700"
          : "bg-stone-100 text-stone-600";
  return (
    <Badge className={`text-[10px] tabular-nums ${color}`}>{score}/5</Badge>
  );
}

function StatusButtons({
  status,
  disabled,
  onChange,
}: {
  status: LiOutreachStatus;
  disabled?: boolean;
  onChange: (s: LiOutreachStatus) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1">
      {LI_OUTREACH_STATUSES.map((s) => {
        const active = status === s.value;
        return (
          <Button
            key={s.value}
            size="sm"
            variant={active ? "default" : "outline"}
            className="h-7 text-[11px] px-2"
            disabled={disabled}
            onClick={() => onChange(s.value)}
          >
            {s.label}
          </Button>
        );
      })}
    </div>
  );
}

export function SignalsBoard({ initialRows, stats }: Props) {
  const [rows, setRows] = useState(initialRows);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [sortKey, setSortKey] = useState<"score" | "company" | "status">("score");
  const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
  const [updating, setUpdating] = useState<string | null>(null);
  const [researching, setResearching] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [banner, setBanner] = useState<string | null>(null);
  const [showNoSignal, setShowNoSignal] = useState(false);

  const filtered = useMemo(() => {
    let list = rows.filter((r) => {
      if (!showNoSignal && r.signal_research_status === "no_signal") return false;
      if (filterType !== "all" && !r.signal_types.includes(filterType)) return false;
      if (filterStatus !== "all") {
        const st = outreachStageToLiStatus(r.contact?.outreach_stage);
        if (st !== filterStatus) return false;
      }
      if (filterScore !== "all") {
        const min = parseInt(filterScore, 10);
        if (r.signal_score < min) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (
          !r.company_name.toLowerCase().includes(q) &&
          !(r.domain || "").includes(q) &&
          !(r.contact?.name || "").toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "score") cmp = a.ranking_weight - b.ranking_weight;
      else if (sortKey === "company")
        cmp = a.company_name.localeCompare(b.company_name);
      else {
        cmp = outreachStageToLiStatus(a.contact?.outreach_stage).localeCompare(
          outreachStageToLiStatus(b.contact?.outreach_stage)
        );
      }
      return sortDir === "desc" ? -cmp : cmp;
    });

    return list;
  }, [
    rows,
    search,
    filterType,
    filterStatus,
    filterScore,
    sortKey,
    sortDir,
    showNoSignal,
  ]);

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir(key === "company" ? "asc" : "desc");
    }
  }

  async function setStatus(accountId: string, status: LiOutreachStatus) {
    setUpdating(accountId);
    setBanner(null);
    try {
      const row = rows.find((r) => r.account_id === accountId);
      const res = await fetch(`/api/admin/signals/${accountId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          contact_id: row?.contact?.id,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setBanner(err.error || "Could not update status");
        return;
      }
      const data = await res.json();
      setRows((prev) =>
        prev.map((r) =>
          r.account_id === accountId && r.contact
            ? {
                ...r,
                contact: {
                  ...r.contact,
                  outreach_stage: data.outreach_stage,
                },
              }
            : r
        )
      );
    } finally {
      setUpdating(null);
    }
  }

  async function loadSeed() {
    setSeeding(true);
    setBanner(null);
    try {
      const res = await fetch("/api/admin/signals/seed", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setBanner(data.error || "Seed import failed");
        return;
      }
      const listRes = await fetch("/api/admin/signals?include_no_signal=1");
      if (listRes.ok) {
        const listData = await listRes.json();
        setRows(listData.rows);
      }
      setBanner(
        `Loaded ${data.imported + data.updated} companies with signals, ${data.no_signal} with none.`
      );
    } finally {
      setSeeding(false);
    }
  }

  async function researchAccount(accountId: string) {
    setResearching(accountId);
    setBanner(null);
    try {
      const res = await fetch("/api/admin/signals/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setBanner(data.error || "Research failed");
        return;
      }
      const listRes = await fetch("/api/admin/signals?include_no_signal=1");
      if (listRes.ok) {
        const listData = await listRes.json();
        setRows(listData.rows);
      }
      setBanner(
        data.result?.has_signal
          ? `Found signals (score ${data.result.score}/5)`
          : "No signal found for this account"
      );
    } finally {
      setResearching(null);
    }
  }

  const SortIcon = ({ active }: { active: boolean }) =>
    active ? (
      sortDir === "desc" ? (
        <ArrowDown className="h-3 w-3 inline ml-1" />
      ) : (
        <ArrowUp className="h-3 w-3 inline ml-1" />
      )
    ) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Signals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ranked companies with real buying signals. Open LinkedIn, send the
            message yourself, then mark the status here.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/crm">
              <Building2 className="h-4 w-4 mr-2" />
              CRM
            </Link>
          </Button>
          <Button disabled={seeding} onClick={loadSeed} variant={rows.length ? "outline" : "default"}>
            {seeding ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {rows.length ? "Re-import seed" : "Load building-products seed"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "With signals", value: stats.withSignal, icon: Radio },
          { label: "Score 4+", value: stats.highScore, icon: Target },
          { label: "Avg score", value: stats.avgScore, icon: Sparkles },
          { label: "No signal", value: stats.noSignal, icon: Search },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <s.icon className="h-3.5 w-3.5" /> {s.label}
              </div>
              <div className="text-2xl font-bold mt-1">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banner && (
        <Card>
          <CardContent className="py-3 text-sm text-muted-foreground">
            {banner}
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search companies, domains, contacts..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Signal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All signal types</SelectItem>
            {LI_SIGNAL_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {LI_OUTREACH_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterScore} onValueChange={setFilterScore}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Score" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any score</SelectItem>
            <SelectItem value="5">5 only</SelectItem>
            <SelectItem value="4">4+</SelectItem>
            <SelectItem value="3">3+</SelectItem>
            <SelectItem value="2">2+</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={showNoSignal ? "default" : "outline"}
          size="sm"
          onClick={() => setShowNoSignal((v) => !v)}
        >
          {showNoSignal ? "Hide no-signal" : "Show no-signal"}
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[72px]">
                <button
                  type="button"
                  className="inline-flex items-center"
                  onClick={() => toggleSort("score")}
                >
                  Score
                  <SortIcon active={sortKey === "score"} />
                </button>
              </TableHead>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center"
                  onClick={() => toggleSort("company")}
                >
                  Company
                  <SortIcon active={sortKey === "company"} />
                </button>
              </TableHead>
              <TableHead className="min-w-[260px]">Signals</TableHead>
              <TableHead>Person</TableHead>
              <TableHead>
                <button
                  type="button"
                  className="inline-flex items-center"
                  onClick={() => toggleSort("status")}
                >
                  Status
                  <SortIcon active={sortKey === "status"} />
                </button>
              </TableHead>
              <TableHead className="w-[90px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-muted-foreground"
                >
                  No companies match these filters.{" "}
                  <button
                    type="button"
                    className="underline"
                    onClick={loadSeed}
                    disabled={seeding}
                  >
                    Load building-products seed
                  </button>{" "}
                  or research signals from CRM.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => {
                const hasAi = row.signal_types.includes("hiring_ai");
                const status = outreachStageToLiStatus(
                  row.contact?.outreach_stage
                );
                const statusMeta = LI_OUTREACH_STATUSES.find(
                  (s) => s.value === status
                );
                const liUrl = row.contact
                  ? resolveLinkedInUrl(
                      row.contact.linkedin_url,
                      row.contact.name,
                      row.company_name
                    )
                  : null;
                const isProfile = Boolean(
                  row.contact?.linkedin_url &&
                    /linkedin\.com\/in\//i.test(row.contact.linkedin_url)
                );

                return (
                  <TableRow
                    key={row.account_id}
                    className={
                      row.signal_research_status === "no_signal"
                        ? "opacity-70"
                        : undefined
                    }
                  >
                    <TableCell className="align-top">
                      <div className="flex flex-col items-start gap-1">
                        <ScoreBadge score={row.signal_score} />
                        {hasAi && (
                          <Badge className="text-[10px] bg-green-100 text-green-700">
                            <Sparkles className="h-3 w-3 mr-0.5" />
                            AI hire
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="align-top">
                      <div className="font-medium text-sm">
                        <Link
                          href={`/admin/crm/${row.account_id}`}
                          className="hover:underline"
                        >
                          {row.company_name}
                        </Link>
                      </div>
                      {row.domain && (
                        <a
                          href={row.website || `https://${row.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          {row.domain}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="align-top">
                      {row.signals.length === 0 ? (
                        <span className="text-xs text-muted-foreground">
                          Researched. No buying signal found.
                        </span>
                      ) : (
                        <div className="space-y-3">
                          {row.signals.map((signal) => {
                            const meta = signalTypeMeta(signal.signal_type);
                            return (
                              <div key={signal.id} className="space-y-1">
                                <Badge
                                  className={`text-[10px] ${
                                    meta?.color || "bg-stone-100 text-stone-600"
                                  }`}
                                >
                                  {meta?.label ||
                                    signal.signal_type.replace(/_/g, " ")}
                                </Badge>
                                <p className="text-sm leading-snug">
                                  {signal.evidence_summary}
                                </p>
                                <ul className="space-y-0.5">
                                  {signal.sources.map((src, i) => (
                                    <li key={`${signal.id}-${i}`}>
                                      <a
                                        href={src.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                                      >
                                        {src.label}
                                        {src.date ? ` · ${src.date}` : ""}
                                        <ExternalLink className="h-2.5 w-2.5" />
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="align-top">
                      {row.contact ? (
                        <div className="space-y-2">
                          <div>
                            <div className="text-sm font-medium">
                              {row.contact.name}
                            </div>
                            {row.contact.title && (
                              <div className="text-xs text-muted-foreground">
                                {row.contact.title}
                              </div>
                            )}
                          </div>
                          {liUrl && (
                            <Button asChild size="sm" variant="outline" className="h-8">
                              <a
                                href={liUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Linkedin className="h-3.5 w-3.5" />
                                {isProfile ? "LinkedIn" : "Find on LinkedIn"}
                              </a>
                            </Button>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          No contact yet
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="align-top">
                      {row.contact ? (
                        <div className="space-y-2">
                          {statusMeta && (
                            <Badge className={`text-[10px] ${statusMeta.color}`}>
                              {statusMeta.label}
                            </Badge>
                          )}
                          <StatusButtons
                            status={status}
                            disabled={updating === row.account_id}
                            onChange={(s) => setStatus(row.account_id, s)}
                          />
                          {updating === row.account_id && (
                            <div className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Saving
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Add a contact in CRM first
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="align-top">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs"
                        disabled={researching === row.account_id}
                        onClick={() => researchAccount(row.account_id)}
                      >
                        {researching === row.account_id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          "Re-research"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of{" "}
        {
          rows.filter(
            (r) =>
              showNoSignal || r.signal_research_status === "has_signal"
          ).length
        }{" "}
        companies. Status writes to contact outreach stage and LinkedIn DM
        activity.
      </p>
    </div>
  );
}

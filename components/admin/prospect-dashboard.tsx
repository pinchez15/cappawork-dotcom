"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Sparkles,
  Phone,
  TrendingUp,
  Search,
  Filter,
  Zap,
  Loader2,
  Linkedin,
  Upload,
  ArrowUp,
  ArrowDown,
  Trash2,
  X,
} from "lucide-react";
import { ProspectSeedDialog } from "@/components/admin/prospect-seed";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type ProspectWithVertical,
  SEQUENCE_STAGES,
  ENRICHMENT_STATUSES,
} from "@/server/repos/prospects";
import type { Vertical } from "@/server/repos/verticals";
import { useCommandContext } from "@/components/admin/command-panel/use-command-context";

type Stats = {
  total: number;
  enriched: number;
  raw: number;
  stale: number;
  activeSequences: number;
  callsBooked: number;
  sold: number;
  avgScore: number;
};

type Props = {
  initialProspects: ProspectWithVertical[];
  stats: Stats;
  verticals: Vertical[];
};

type SortKey = "priority_score" | "company_name" | "vertical_name" | "sequence_stage" | "enrichment_status" | "location";
type SortDir = "asc" | "desc";

function PriorityBadge({ score }: { score: number }) {
  let color = "bg-stone-100 text-stone-600";
  if (score >= 70) color = "bg-green-100 text-green-700";
  else if (score >= 50) color = "bg-blue-100 text-blue-700";
  else if (score >= 30) color = "bg-amber-100 text-amber-700";

  return (
    <Badge className={`text-[10px] font-bold tabular-nums ${color}`}>
      {score}
    </Badge>
  );
}

function StageBadge({ stage }: { stage: string }) {
  const s = SEQUENCE_STAGES.find((ss) => ss.value === stage);
  return (
    <Badge className={`text-[10px] ${s?.color || "bg-stone-100 text-stone-600"}`}>
      {s?.label || stage}
    </Badge>
  );
}

function EnrichmentBadge({ status }: { status: string }) {
  const e = ENRICHMENT_STATUSES.find((es) => es.value === status);
  return (
    <Badge className={`text-[10px] ${e?.color || "bg-stone-100 text-stone-600"}`}>
      {e?.label || status}
    </Badge>
  );
}

function TierBadge({ tier }: { tier: number | null }) {
  if (!tier) return null;
  const colors: Record<number, string> = {
    1: "bg-green-100 text-green-700",
    2: "bg-blue-100 text-blue-700",
    3: "bg-stone-100 text-stone-600",
  };
  return (
    <Badge className={`text-[10px] ${colors[tier] || colors[3]}`}>
      T{tier}
    </Badge>
  );
}

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (column !== sortKey) return null;
  return sortDir === "asc" ? (
    <ArrowUp className="h-3 w-3 inline ml-0.5" />
  ) : (
    <ArrowDown className="h-3 w-3 inline ml-0.5" />
  );
}

export function ProspectDashboard({
  initialProspects,
  stats,
  verticals,
}: Props) {
  const router = useRouter();

  useCommandContext({
    page: "prospects",
    summary: `${stats.total} prospects, ${stats.enriched} enriched, ${stats.callsBooked} calls booked, ${stats.sold} sold, avg score ${stats.avgScore}`,
    capabilities: ["create_prospect", "query_prospects", "update_prospect"],
  });
  const [prospects, setProspects] = useState(initialProspects);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVertical, setFilterVertical] = useState<string>("all");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterEnrichment, setFilterEnrichment] = useState<string>("all");
  const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set());
  const [batchEnriching, setBatchEnriching] = useState(false);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // Sorting
  const [sortKey, setSortKey] = useState<SortKey>("priority_score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const filtered = prospects.filter((p) => {
    if (
      searchQuery &&
      !p.company_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(p.decision_maker_name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
      !(p.location || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
      return false;
    if (filterVertical !== "all" && p.vertical_id !== filterVertical)
      return false;
    if (filterStage !== "all" && p.sequence_stage !== filterStage) return false;
    if (filterEnrichment !== "all" && p.enrichment_status !== filterEnrichment)
      return false;
    return true;
  });

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";

      switch (sortKey) {
        case "priority_score":
          aVal = a.priority_score;
          bVal = b.priority_score;
          break;
        case "company_name":
          aVal = a.company_name.toLowerCase();
          bVal = b.company_name.toLowerCase();
          break;
        case "vertical_name":
          aVal = (a.vertical_name || "zzz").toLowerCase();
          bVal = (b.vertical_name || "zzz").toLowerCase();
          break;
        case "sequence_stage":
          aVal = a.sequence_stage;
          bVal = b.sequence_stage;
          break;
        case "enrichment_status":
          aVal = a.enrichment_status;
          bVal = b.enrichment_status;
          break;
        case "location":
          aVal = (a.location || "zzz").toLowerCase();
          bVal = (b.location || "zzz").toLowerCase();
          break;
      }

      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "company_name" || key === "vertical_name" || key === "location" ? "asc" : "desc");
    }
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === sorted.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(sorted.map((p) => p.id)));
    }
  }

  const bulkUpdate = useCallback(
    async (updates: Record<string, unknown>) => {
      if (selectedIds.size === 0) return;
      setBulkUpdating(true);
      try {
        const res = await fetch("/api/admin/prospects/bulk", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [...selectedIds], updates }),
        });
        if (res.ok) {
          setSelectedIds(new Set());
          router.refresh();
        }
      } catch {
        // Silently handle
      }
      setBulkUpdating(false);
    },
    [selectedIds, router]
  );

  const bulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Delete ${selectedIds.size} prospects? This cannot be undone.`)) return;
    setBulkUpdating(true);
    try {
      const res = await fetch("/api/admin/prospects/bulk", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [...selectedIds] }),
      });
      if (res.ok) {
        setProspects((prev) => prev.filter((p) => !selectedIds.has(p.id)));
        setSelectedIds(new Set());
        router.refresh();
      }
    } catch {
      // Silently handle
    }
    setBulkUpdating(false);
  }, [selectedIds, router]);

  const [enrichError, setEnrichError] = useState<string | null>(null);

  const enrichProspect = useCallback(
    async (id: string) => {
      setEnrichingIds((prev) => new Set(prev).add(id));
      setEnrichError(null);
      try {
        const res = await fetch("/api/admin/prospects/enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prospect_id: id }),
        });
        if (res.ok) {
          const { prospect: updated } = await res.json();
          setProspects((prev) =>
            prev.map((p) =>
              p.id === id
                ? {
                    ...p,
                    ...updated,
                    vertical_name: p.vertical_name,
                    vertical_tier: p.vertical_tier,
                  }
                : p
            )
          );
        } else {
          const data = await res.json().catch(() => ({}));
          const name = prospects.find((p) => p.id === id)?.company_name || "Unknown";
          if (res.status === 429) {
            setEnrichError(`Rate limited — wait a minute before enriching more. (Failed on "${name}")`);
          } else {
            setEnrichError(`Failed to enrich "${name}": ${data.error || `HTTP ${res.status}`}`);
          }
        }
      } catch {
        const name = prospects.find((p) => p.id === id)?.company_name || "Unknown";
        setEnrichError(`Failed to enrich "${name}": network error or timeout`);
      }
      setEnrichingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [prospects]
  );

  const handleBatchEnrich = useCallback(async () => {
    const toEnrich = filtered
      .filter(
        (p) =>
          p.enrichment_status === "raw" || p.enrichment_status === "stale"
      )
      .slice(0, 20);

    if (toEnrich.length === 0) return;
    setBatchEnriching(true);

    for (const p of toEnrich) {
      await enrichProspect(p.id);
      // 12-second delay between calls to stay within 30K input tokens/min rate limit
      await new Promise((r) => setTimeout(r, 12000));
    }

    setBatchEnriching(false);
    router.refresh();
  }, [filtered, enrichProspect, router]);

  const allSelected = sorted.length > 0 && selectedIds.size === sorted.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < sorted.length;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-stone-900">Prospects</h1>
          <p className="text-stone-600 mt-1">
            AI-enriched prospect intelligence
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setSeedDialogOpen(true)}
          >
            <Upload className="h-4 w-4 mr-1" />
            Seed from File
          </Button>
          <Button
            variant="outline"
            onClick={handleBatchEnrich}
            disabled={batchEnriching}
          >
            {batchEnriching ? (
              <>
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Enriching...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-1" />
                Enrich Next 20
              </>
            )}
          </Button>
          <Link href="/admin/prospects/verticals">
            <Button variant="outline">Verticals</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <Users className="h-3.5 w-3.5" />
              Total
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {stats.total}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {stats.raw} raw, {stats.stale} stale
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <Sparkles className="h-3.5 w-3.5" />
              Enriched
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {stats.enriched}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              {stats.total > 0
                ? Math.round((stats.enriched / stats.total) * 100)
                : 0}
              % coverage
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Active Sequences
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {stats.activeSequences}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <Phone className="h-3.5 w-3.5" />
              Calls Booked
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {stats.callsBooked}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50/50">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mb-1">
              <TrendingUp className="h-3.5 w-3.5" />
              Sold
            </div>
            <div className="text-2xl font-bold text-stone-900">
              {stats.sold}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              ${(stats.sold * 30000).toLocaleString()} pipeline
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search companies, contacts, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterVertical} onValueChange={setFilterVertical}>
          <SelectTrigger className="w-[200px]">
            <Filter className="h-3.5 w-3.5 mr-1 text-stone-400" />
            <SelectValue placeholder="Vertical" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Verticals</SelectItem>
            {verticals.map((v) => (
              <SelectItem key={v.id} value={v.id}>
                {v.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stages</SelectItem>
            {SEQUENCE_STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterEnrichment} onValueChange={setFilterEnrichment}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Enrichment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {ENRICHMENT_STATUSES.map((e) => (
              <SelectItem key={e.value} value={e.value}>
                {e.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-stone-400">
          {filtered.length} prospect{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
          <span className="text-sm font-medium text-blue-800">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="text-blue-600 hover:text-blue-800"
          >
            <X className="h-3.5 w-3.5" />
          </button>
          <div className="h-4 w-px bg-blue-200" />
          <Select
            value=""
            onValueChange={(val) => {
              if (val) bulkUpdate({ vertical_id: val });
            }}
          >
            <SelectTrigger className="w-[180px] h-8 text-xs bg-white">
              <SelectValue placeholder="Set Vertical..." />
            </SelectTrigger>
            <SelectContent>
              {verticals.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value=""
            onValueChange={(val) => {
              if (val) bulkUpdate({ sequence_stage: val });
            }}
          >
            <SelectTrigger className="w-[160px] h-8 text-xs bg-white">
              <SelectValue placeholder="Set Stage..." />
            </SelectTrigger>
            <SelectContent>
              {SEQUENCE_STAGES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-1" />
          {bulkUpdating && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8"
            onClick={bulkDelete}
            disabled={bulkUpdating}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Delete
          </Button>
        </div>
      )}

      {/* Enrichment error */}
      {enrichError && (
        <div className="flex items-center gap-2 mb-3 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm text-red-700">
          <span className="flex-1">{enrichError}</span>
          <button onClick={() => setEnrichError(null)} className="text-red-400 hover:text-red-600">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Prospect table */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="text-lg font-medium mb-1">No prospects found</p>
          <p className="text-sm">
            Add prospects or adjust your filters
          </p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-stone-50 text-left">
                  <th className="py-3 px-3 w-10">
                    <Checkbox
                      checked={allSelected}
                      ref={(el) => {
                        if (el) {
                          (el as unknown as HTMLInputElement).indeterminate = someSelected;
                        }
                      }}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th
                    className="py-3 px-4 font-medium text-stone-600 w-12 cursor-pointer hover:text-stone-900 select-none"
                    onClick={() => handleSort("priority_score")}
                  >
                    Score
                    <SortIcon column="priority_score" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th
                    className="py-3 px-4 font-medium text-stone-600 cursor-pointer hover:text-stone-900 select-none"
                    onClick={() => handleSort("company_name")}
                  >
                    Company
                    <SortIcon column="company_name" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th
                    className="py-3 px-4 font-medium text-stone-600 cursor-pointer hover:text-stone-900 select-none"
                    onClick={() => handleSort("vertical_name")}
                  >
                    Vertical
                    <SortIcon column="vertical_name" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th
                    className="py-3 px-4 font-medium text-stone-600 cursor-pointer hover:text-stone-900 select-none"
                    onClick={() => handleSort("location")}
                  >
                    Location
                    <SortIcon column="location" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className="py-3 px-4 font-medium text-stone-600">
                    Decision Maker
                  </th>
                  <th
                    className="py-3 px-4 font-medium text-stone-600 cursor-pointer hover:text-stone-900 select-none"
                    onClick={() => handleSort("sequence_stage")}
                  >
                    Stage
                    <SortIcon column="sequence_stage" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th
                    className="py-3 px-4 font-medium text-stone-600 cursor-pointer hover:text-stone-900 select-none"
                    onClick={() => handleSort("enrichment_status")}
                  >
                    Intel
                    <SortIcon column="enrichment_status" sortKey={sortKey} sortDir={sortDir} />
                  </th>
                  <th className="py-3 px-4 font-medium text-stone-600 w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sorted.map((p) => {
                  const isEnriching = enrichingIds.has(p.id);
                  const isSelected = selectedIds.has(p.id);
                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-stone-50 cursor-pointer ${isSelected ? "bg-blue-50/50" : ""}`}
                      onClick={() =>
                        router.push(`/admin/prospects/${p.id}`)
                      }
                    >
                      <td className="py-3 px-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSelect(p.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <PriorityBadge score={p.priority_score} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-900">
                          {p.company_name}
                        </div>
                        <div className="text-xs text-stone-400">
                          {p.estimated_revenue || ""}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <TierBadge tier={p.vertical_tier} />
                          <span className="text-xs text-stone-500 truncate max-w-[120px]">
                            {p.vertical_name || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-stone-600">
                          {p.location || "—"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {p.decision_maker_name ? (
                          <div>
                            <div className="text-stone-900 flex items-center gap-1">
                              {p.decision_maker_name}
                              {p.linkedin_url && (
                                <a
                                  href={p.linkedin_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 hover:text-blue-700"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Linkedin className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                            {p.decision_maker_title && (
                              <div className="text-xs text-stone-400">
                                {p.decision_maker_title}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-stone-300">—</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <StageBadge stage={p.sequence_stage} />
                      </td>
                      <td className="py-3 px-4">
                        <EnrichmentBadge status={p.enrichment_status} />
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          disabled={isEnriching}
                          onClick={(e) => {
                            e.stopPropagation();
                            enrichProspect(p.id);
                          }}
                        >
                          {isEnriching ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <>
                              <Zap className="h-3 w-3 mr-1" />
                              Enrich
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ProspectSeedDialog
        open={seedDialogOpen}
        onOpenChange={setSeedDialogOpen}
      />
    </>
  );
}

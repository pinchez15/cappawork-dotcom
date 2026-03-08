"use client";

import { useState, useCallback } from "react";
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
  ExternalLink,
  Linkedin,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

export function ProspectDashboard({
  initialProspects,
  stats,
  verticals,
}: Props) {
  const router = useRouter();
  const [prospects, setProspects] = useState(initialProspects);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVertical, setFilterVertical] = useState<string>("all");
  const [filterStage, setFilterStage] = useState<string>("all");
  const [filterEnrichment, setFilterEnrichment] = useState<string>("all");
  const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set());
  const [batchEnriching, setBatchEnriching] = useState(false);

  const filtered = prospects.filter((p) => {
    if (
      searchQuery &&
      !p.company_name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !(p.decision_maker_name || "")
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

  const enrichProspect = useCallback(
    async (id: string) => {
      setEnrichingIds((prev) => new Set(prev).add(id));
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
        }
      } catch {
        // Silently handle
      }
      setEnrichingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    []
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
      // 2-second delay between calls
      await new Promise((r) => setTimeout(r, 2000));
    }

    setBatchEnriching(false);
    router.refresh();
  }, [filtered, enrichProspect, router]);

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
            placeholder="Search companies or contacts..."
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

      {/* Prospect table */}
      {filtered.length === 0 ? (
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
                  <th className="py-3 px-4 font-medium text-stone-600 w-12">
                    Score
                  </th>
                  <th className="py-3 px-4 font-medium text-stone-600">
                    Company
                  </th>
                  <th className="py-3 px-4 font-medium text-stone-600">
                    Vertical
                  </th>
                  <th className="py-3 px-4 font-medium text-stone-600">
                    Decision Maker
                  </th>
                  <th className="py-3 px-4 font-medium text-stone-600">
                    Stage
                  </th>
                  <th className="py-3 px-4 font-medium text-stone-600">
                    Trigger
                  </th>
                  <th className="py-3 px-4 font-medium text-stone-600">
                    Intel
                  </th>
                  <th className="py-3 px-4 font-medium text-stone-600 w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((p) => {
                  const isEnriching = enrichingIds.has(p.id);
                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-stone-50 cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/prospects/${p.id}`)
                      }
                    >
                      <td className="py-3 px-4">
                        <PriorityBadge score={p.priority_score} />
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-900">
                          {p.company_name}
                        </div>
                        <div className="text-xs text-stone-400 flex items-center gap-2">
                          {p.location && <span>{p.location}</span>}
                          {p.estimated_revenue && (
                            <span>· {p.estimated_revenue}</span>
                          )}
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
                        {p.trigger_event ? (
                          <div className="max-w-[200px]">
                            <div className="text-xs text-stone-600 truncate">
                              {p.trigger_event}
                            </div>
                            <Badge
                              className={`text-[9px] mt-0.5 ${
                                p.trigger_event_source === "ai_generated"
                                  ? "bg-stone-100 text-stone-500"
                                  : "bg-green-100 text-green-700"
                              }`}
                            >
                              {p.trigger_event_source}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-xs text-stone-300">—</span>
                        )}
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
    </>
  );
}

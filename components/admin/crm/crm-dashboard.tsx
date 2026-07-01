"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Target,
  Search,
  ListFilter,
  ArrowUp,
  ArrowDown,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type GtmAccountWithVertical,
  GTM_STAGES,
} from "@/server/repos/gtm-accounts";
import type { Vertical } from "@/server/repos/verticals";

type Stats = {
  total: number;
  outreachReady: number;
  auditBooked: number;
  closedWon: number;
  highFit: number;
  avgFit: number;
};

type Props = {
  initialAccounts: GtmAccountWithVertical[];
  stats: Stats;
  verticals: Vertical[];
};

function StageBadge({ stage }: { stage: string }) {
  const s = GTM_STAGES.find((x) => x.value === stage);
  return (
    <Badge className={`text-[10px] ${s?.color || "bg-stone-100"}`}>
      {s?.label || stage}
    </Badge>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-green-100 text-green-700"
    : score >= 50 ? "bg-blue-100 text-blue-700"
    : score >= 30 ? "bg-amber-100 text-amber-700"
    : "bg-stone-100 text-stone-600";
  return <Badge className={`text-[10px] tabular-nums ${color}`}>{score}</Badge>;
}

export function CrmDashboard({ initialAccounts, stats, verticals }: Props) {
  const router = useRouter();
  const [accounts] = useState(initialAccounts);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");
  const [filterVertical, setFilterVertical] = useState("all");

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      if (filterStage !== "all" && a.gtm_stage !== filterStage) return false;
      if (filterVertical !== "all" && a.vertical_id !== filterVertical) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !a.company_name.toLowerCase().includes(q) &&
          !(a.domain || "").includes(q) &&
          !(a.primary_contact_name || "").toLowerCase().includes(q)
        ) return false;
      }
      return true;
    });
  }, [accounts, search, filterStage, filterVertical]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Accounts, contacts, pipeline stages, hypotheses, and outreach.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/list-builder">
            <ListFilter className="h-4 w-4 mr-2" />
            List Builder
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Accounts", value: stats.total, icon: Building2 },
          { label: "High Fit (70+)", value: stats.highFit, icon: Target },
          { label: "Outreach Ready", value: stats.outreachReady, icon: Target },
          { label: "Audits Booked", value: stats.auditBooked, icon: Target },
          { label: "Closed Won", value: stats.closedWon, icon: Target },
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
        <Select value={filterStage} onValueChange={setFilterStage}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Stage" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            {GTM_STAGES.map((s) => (
              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterVertical} onValueChange={setFilterVertical}>
          <SelectTrigger className="w-[180px]"><SelectValue placeholder="Vertical" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All verticals</SelectItem>
            {verticals.map((v) => (
              <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Vertical</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="text-center">Fit</TableHead>
              <TableHead className="text-center">Pain</TableHead>
              <TableHead>Case Study</TableHead>
              <TableHead>Next Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                  No accounts yet.{" "}
                  <Link href="/admin/list-builder/new" className="underline">
                    Create a list
                  </Link>{" "}
                  to start prospecting.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((account) => (
                <TableRow
                  key={account.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => router.push(`/admin/crm/${account.id}`)}
                >
                  <TableCell>
                    <div className="font-medium text-sm">{account.company_name}</div>
                    {account.domain && (
                      <div className="text-xs text-muted-foreground">{account.domain}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">
                    {account.primary_contact_name || "—"}
                    {account.primary_contact_title && (
                      <div className="text-muted-foreground">{account.primary_contact_title}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{account.vertical_name || "—"}</TableCell>
                  <TableCell><StageBadge stage={account.gtm_stage} /></TableCell>
                  <TableCell className="text-center"><ScoreBadge score={account.fit_score} /></TableCell>
                  <TableCell className="text-center"><ScoreBadge score={account.pain_score} /></TableCell>
                  <TableCell className="text-xs">{account.case_study_match || "—"}</TableCell>
                  <TableCell className="text-xs max-w-[160px] truncate">
                    {account.next_action || "—"}
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

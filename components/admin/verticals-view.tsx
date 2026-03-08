"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { VerticalWithCounts } from "@/server/repos/verticals";

type Props = {
  verticals: VerticalWithCounts[];
};

function TierBadge({ tier }: { tier: number }) {
  const colors: Record<number, string> = {
    1: "bg-green-100 text-green-700",
    2: "bg-blue-100 text-blue-700",
    3: "bg-stone-100 text-stone-600",
  };
  return (
    <Badge className={`text-[10px] font-bold ${colors[tier] || colors[3]}`}>
      Tier {tier}
    </Badge>
  );
}

export function VerticalsView({ verticals }: Props) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    tier: "2",
    close_speed: "5",
    ai_awareness: "5",
    automation_pain: "5",
    rationale: "",
    sales_nav_boolean: "",
  });

  const set = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await fetch("/api/admin/verticals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          tier: parseInt(form.tier),
          close_speed: parseInt(form.close_speed),
          ai_awareness: parseInt(form.ai_awareness),
          automation_pain: parseInt(form.automation_pain),
          rationale: form.rationale || null,
          sales_nav_boolean: form.sales_nav_boolean || null,
        }),
      });
      setDialogOpen(false);
      setForm({
        name: "",
        tier: "2",
        close_speed: "5",
        ai_awareness: "5",
        automation_pain: "5",
        rationale: "",
        sales_nav_boolean: "",
      });
      router.refresh();
    } catch {
      // handled
    }
    setSaving(false);
  }

  return (
    <>
      <Link
        href="/admin/prospects"
        className="text-sm text-stone-400 hover:text-stone-600 flex items-center gap-1 mb-3"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Prospects
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-stone-900">
            Vertical Rankings
          </h1>
          <p className="text-stone-600 mt-1">
            Ranked by composite score (close speed + AI awareness + automation
            pain)
          </p>
        </div>
        <Button
          onClick={() => setDialogOpen(true)}
          className="rounded-full bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-1" /> Add Vertical
        </Button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-stone-50 text-left">
              <th className="py-3 px-4 font-medium text-stone-600 w-8">#</th>
              <th className="py-3 px-4 font-medium text-stone-600">Vertical</th>
              <th className="py-3 px-4 font-medium text-stone-600">Tier</th>
              <th className="py-3 px-4 font-medium text-stone-600">Close Speed</th>
              <th className="py-3 px-4 font-medium text-stone-600">AI Awareness</th>
              <th className="py-3 px-4 font-medium text-stone-600">Auto Pain</th>
              <th className="py-3 px-4 font-medium text-stone-600">Composite</th>
              <th className="py-3 px-4 font-medium text-stone-600">Prospects</th>
              <th className="py-3 px-4 font-medium text-stone-600">Pipeline $</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {verticals.map((v, i) => {
              const expanded = expandedId === v.id;
              return (
                <>
                  <tr
                    key={v.id}
                    className="hover:bg-stone-50 cursor-pointer"
                    onClick={() =>
                      setExpandedId(expanded ? null : v.id)
                    }
                  >
                    <td className="py-3 px-4 text-stone-400 font-medium">
                      {i + 1}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-900">
                      {v.name}
                    </td>
                    <td className="py-3 px-4">
                      <TierBadge tier={v.tier} />
                    </td>
                    <td className="py-3 px-4">
                      <ScoreBar value={v.close_speed} />
                    </td>
                    <td className="py-3 px-4">
                      <ScoreBar value={v.ai_awareness} />
                    </td>
                    <td className="py-3 px-4">
                      <ScoreBar value={v.automation_pain} />
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-stone-900">
                        {Number(v.composite_score).toFixed(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-stone-900">
                        {v.prospect_count}
                      </span>
                      {v.enriched_count > 0 && (
                        <span className="text-xs text-stone-400 ml-1">
                          ({v.enriched_count} enriched)
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-900">
                      ${(v.prospect_count * 30000).toLocaleString()}
                    </td>
                  </tr>
                  {expanded && v.rationale && (
                    <tr key={`${v.id}-detail`}>
                      <td colSpan={9} className="px-4 pb-3">
                        <div className="bg-stone-50 rounded-lg p-4 text-sm">
                          <div className="font-medium text-stone-500 text-xs uppercase tracking-wider mb-2">
                            Rationale
                          </div>
                          <p className="text-stone-700">{v.rationale}</p>
                          {v.sales_nav_boolean && (
                            <>
                              <div className="font-medium text-stone-500 text-xs uppercase tracking-wider mt-3 mb-1">
                                Sales Nav Boolean
                              </div>
                              <code className="text-xs text-stone-600 bg-white px-2 py-1 rounded border">
                                {v.sales_nav_boolean}
                              </code>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Vertical Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Vertical</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Name</Label>
              <Input
                placeholder="Staffing & Recruiting"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div>
              <Label>Tier</Label>
              <Select value={form.tier} onValueChange={(v) => set("tier", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Tier 1 — Fastest Close</SelectItem>
                  <SelectItem value="2">Tier 2 — Medium</SelectItem>
                  <SelectItem value="3">Tier 3 — Longer Cycle</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Close Speed (1-10)</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={form.close_speed}
                  onChange={(e) => set("close_speed", e.target.value)}
                />
              </div>
              <div>
                <Label>AI Awareness (1-10)</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={form.ai_awareness}
                  onChange={(e) => set("ai_awareness", e.target.value)}
                />
              </div>
              <div>
                <Label>Automation Pain (1-10)</Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={form.automation_pain}
                  onChange={(e) => set("automation_pain", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Rationale</Label>
              <Textarea
                placeholder="Why this vertical closes fast..."
                rows={3}
                value={form.rationale}
                onChange={(e) => set("rationale", e.target.value)}
              />
            </div>
            <div>
              <Label>Sales Nav Boolean</Label>
              <Input
                placeholder="LinkedIn search string"
                value={form.sales_nav_boolean}
                onChange={(e) => set("sales_nav_boolean", e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={handleSave}
                disabled={saving || !form.name.trim()}
              >
                {saving ? "Saving..." : "Add Vertical"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function ScoreBar({ value }: { value: number }) {
  const pct = (value / 10) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-stone-600 tabular-nums">{value}</span>
    </div>
  );
}

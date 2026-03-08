"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Zap,
  Loader2,
  Linkedin,
  Globe,
  Mail,
  Copy,
  Check,
  Plus,
  ChevronDown,
  AlertTriangle,
  Sparkles,
  Send,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  type ProspectWithVertical,
  SEQUENCE_STAGES,
  ENRICHMENT_STATUSES,
} from "@/server/repos/prospects";
import type { OutreachActivity } from "@/server/repos/outreach-activities";
import { CHANNELS, ACTIVITY_STATUSES } from "@/server/repos/outreach-activities";
import type { SignalEvent } from "@/server/repos/signal-events";
import { SIGNAL_TYPES } from "@/server/repos/signal-events";

type Props = {
  prospect: ProspectWithVertical;
  activities: OutreachActivity[];
  signals: SignalEvent[];
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="text-stone-400 hover:text-stone-600 transition-colors"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function SourceBadge({ source }: { source: string | null }) {
  if (!source) return null;
  const isAI = source === "ai_generated";
  return (
    <Badge
      className={`text-[9px] ${
        isAI ? "bg-stone-100 text-stone-500" : "bg-green-100 text-green-700"
      }`}
    >
      {source.replace("_", " ")}
    </Badge>
  );
}

export function ProspectDetail({ prospect: initial, activities: initialActivities, signals: initialSignals }: Props) {
  const router = useRouter();
  const [prospect, setProspect] = useState(initial);
  const [activities, setActivities] = useState(initialActivities);
  const [signals, setSignals] = useState(initialSignals);
  const [enriching, setEnriching] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [signalDialogOpen, setSignalDialogOpen] = useState(false);

  const handleEnrich = useCallback(async () => {
    setEnriching(true);
    try {
      const res = await fetch("/api/admin/prospects/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect_id: prospect.id }),
      });
      if (res.ok) {
        router.refresh();
        const { prospect: updated } = await res.json();
        setProspect((prev) => ({ ...prev, ...updated }));
      }
    } catch {
      // handled
    }
    setEnriching(false);
  }, [prospect.id, router]);

  const handleAdvanceStage = useCallback(
    async (newStage: string) => {
      try {
        const res = await fetch(`/api/admin/prospects/${prospect.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sequence_stage: newStage }),
        });
        if (res.ok) {
          setProspect((prev) => ({ ...prev, sequence_stage: newStage }));
          router.refresh();
        }
      } catch {
        // handled
      }
    },
    [prospect.id, router]
  );

  const handleLogActivity = useCallback(
    async (data: Record<string, string | null>) => {
      try {
        const res = await fetch(
          `/api/admin/prospects/${prospect.id}/activities`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...data,
              status: "sent",
              sent_at: new Date().toISOString(),
            }),
          }
        );
        if (res.ok) {
          const activity = await res.json();
          setActivities((prev) => [...prev, activity]);
          setActivityDialogOpen(false);
        }
      } catch {
        // handled
      }
    },
    [prospect.id]
  );

  const handleLogSignal = useCallback(
    async (data: Record<string, string | number | null>) => {
      try {
        const res = await fetch(
          `/api/admin/prospects/${prospect.id}/signals`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
          }
        );
        if (res.ok) {
          const signal = await res.json();
          setSignals((prev) => [signal, ...prev]);
          setSignalDialogOpen(false);
        }
      } catch {
        // handled
      }
    },
    [prospect.id]
  );

  const stageInfo = SEQUENCE_STAGES.find(
    (s) => s.value === prospect.sequence_stage
  );
  const enrichmentInfo = ENRICHMENT_STATUSES.find(
    (e) => e.value === prospect.enrichment_status
  );

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/prospects"
          className="text-sm text-stone-400 hover:text-stone-600 flex items-center gap-1 mb-3"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Prospects
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-semibold text-stone-900">
                {prospect.company_name}
              </h1>
              <Badge
                className={`text-xs font-bold ${
                  prospect.priority_score >= 70
                    ? "bg-green-100 text-green-700"
                    : prospect.priority_score >= 50
                      ? "bg-blue-100 text-blue-700"
                      : "bg-amber-100 text-amber-700"
                }`}
              >
                Score: {prospect.priority_score}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              {prospect.vertical_name && (
                <Badge className="bg-stone-100 text-stone-600 text-xs">
                  {prospect.vertical_name}
                </Badge>
              )}
              {prospect.vertical_tier && (
                <Badge
                  className={`text-xs ${
                    prospect.vertical_tier === 1
                      ? "bg-green-100 text-green-700"
                      : prospect.vertical_tier === 2
                        ? "bg-blue-100 text-blue-700"
                        : "bg-stone-100 text-stone-600"
                  }`}
                >
                  Tier {prospect.vertical_tier}
                </Badge>
              )}
              <Badge className={`text-xs ${stageInfo?.color || ""}`}>
                {stageInfo?.label || prospect.sequence_stage}
              </Badge>
              <Badge className={`text-xs ${enrichmentInfo?.color || ""}`}>
                {enrichmentInfo?.label || prospect.enrichment_status}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleEnrich}
              disabled={enriching}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {enriching ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-1" />
              )}
              {prospect.enrichment_status === "stale"
                ? "Re-Enrich"
                : "Enrich"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left column — Company info + Intelligence */}
        <div className="col-span-2 space-y-6">
          {/* Company info */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">
                Company Info
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-stone-400 text-xs">Revenue</div>
                  <div className="text-stone-900 font-medium">
                    {prospect.estimated_revenue || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-stone-400 text-xs">Location</div>
                  <div className="text-stone-900 font-medium">
                    {prospect.location || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-stone-400 text-xs">Decision Maker</div>
                  <div className="text-stone-900 font-medium flex items-center gap-2">
                    {prospect.decision_maker_name || "—"}
                    {prospect.linkedin_url && (
                      <a
                        href={prospect.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                  {prospect.decision_maker_title && (
                    <div className="text-xs text-stone-400">
                      {prospect.decision_maker_title}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-stone-400 text-xs">Website</div>
                  {prospect.website ? (
                    <a
                      href={prospect.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {prospect.website.replace(/^https?:\/\//, "")}
                    </a>
                  ) : (
                    <div className="text-stone-900 font-medium">—</div>
                  )}
                </div>
                {prospect.email_verified && (
                  <div>
                    <div className="text-stone-400 text-xs">Email</div>
                    <div className="text-stone-900 font-medium flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-stone-400" />
                      {prospect.email_verified}
                      <CopyButton text={prospect.email_verified} />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Intelligence */}
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider mb-4">
                <Sparkles className="h-3.5 w-3.5 inline mr-1" />
                AI Intelligence
              </h2>

              {prospect.enrichment_status === "raw" ? (
                <div className="text-center py-8 text-stone-400">
                  <Zap className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">
                    Click &quot;Enrich&quot; to research this company with AI
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {prospect.key_pain_point && (
                    <div>
                      <div className="text-xs text-stone-400 font-medium mb-1">
                        Key Pain Point
                      </div>
                      <p className="text-sm text-stone-700">
                        {prospect.key_pain_point}
                      </p>
                    </div>
                  )}
                  {prospect.why_closes_fast && (
                    <div>
                      <div className="text-xs text-stone-400 font-medium mb-1">
                        Why They Close Fast
                      </div>
                      <p className="text-sm text-stone-700">
                        {prospect.why_closes_fast}
                      </p>
                    </div>
                  )}
                  {prospect.trigger_event && (
                    <div>
                      <div className="text-xs text-stone-400 font-medium mb-1 flex items-center gap-2">
                        Trigger Event
                        <SourceBadge source={prospect.trigger_event_source} />
                      </div>
                      <p className="text-sm text-stone-700">
                        {prospect.trigger_event}
                      </p>
                    </div>
                  )}
                  {prospect.tech_stack_signal && (
                    <div>
                      <div className="text-xs text-stone-400 font-medium mb-1 flex items-center gap-2">
                        Tech Stack
                        <SourceBadge source={prospect.tech_stack_source} />
                      </div>
                      <p className="text-sm text-stone-700">
                        {prospect.tech_stack_signal}
                      </p>
                    </div>
                  )}

                  {/* Copyable outreach content */}
                  {prospect.personalized_first_line && (
                    <div className="bg-stone-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-stone-400 font-medium">
                          Personalized First Line
                        </div>
                        <CopyButton text={prospect.personalized_first_line} />
                      </div>
                      <p className="text-sm text-stone-700 italic">
                        &quot;{prospect.personalized_first_line}&quot;
                      </p>
                    </div>
                  )}
                  {prospect.cold_email_hook && (
                    <div className="bg-stone-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-stone-400 font-medium">
                          Cold Email Hook
                        </div>
                        <CopyButton text={prospect.cold_email_hook} />
                      </div>
                      <p className="text-sm text-stone-700 italic">
                        &quot;{prospect.cold_email_hook}&quot;
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Outreach Timeline */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider">
                  Outreach Timeline
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActivityDialogOpen(true)}
                >
                  <Plus className="h-3 w-3 mr-1" /> Log Activity
                </Button>
              </div>

              {activities.length === 0 ? (
                <p className="text-sm text-stone-400 py-4 text-center">
                  No outreach activity yet
                </p>
              ) : (
                <div className="space-y-3">
                  {activities.map((a) => {
                    const ch = CHANNELS.find((c) => c.value === a.channel);
                    const st = ACTIVITY_STATUSES.find(
                      (s) => s.value === a.status
                    );
                    return (
                      <div
                        key={a.id}
                        className="flex items-start gap-3 text-sm border-l-2 border-stone-200 pl-4 py-1"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-stone-900">
                              {a.action_type || ch?.label || "Activity"}
                            </span>
                            <Badge className="text-[9px] bg-stone-100 text-stone-600">
                              {st?.label || a.status}
                            </Badge>
                          </div>
                          {a.content && (
                            <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                              {a.content}
                            </p>
                          )}
                          {a.response_text && (
                            <div className="mt-1 bg-green-50 rounded p-2 text-xs text-green-700">
                              Reply: {a.response_text}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-stone-400 shrink-0">
                          {a.sent_at
                            ? new Date(a.sent_at).toLocaleDateString()
                            : new Date(a.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Signal Events */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-stone-500 uppercase tracking-wider">
                  Signal Events
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSignalDialogOpen(true)}
                >
                  <Plus className="h-3 w-3 mr-1" /> Log Signal
                </Button>
              </div>

              {signals.length === 0 ? (
                <p className="text-sm text-stone-400 py-4 text-center">
                  No signals detected yet
                </p>
              ) : (
                <div className="space-y-3">
                  {signals.map((s) => {
                    const st = SIGNAL_TYPES.find(
                      (t) => t.value === s.signal_type
                    );
                    return (
                      <div
                        key={s.id}
                        className="flex items-start gap-3 text-sm"
                      >
                        <AlertTriangle
                          className={`h-4 w-4 mt-0.5 shrink-0 ${
                            s.signal_strength >= 7
                              ? "text-green-500"
                              : s.signal_strength >= 4
                                ? "text-amber-500"
                                : "text-stone-300"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge className="text-[9px] bg-stone-100 text-stone-600">
                              {st?.label || s.signal_type}
                            </Badge>
                            <span className="text-[10px] text-stone-400">
                              Strength: {s.signal_strength}/10
                            </span>
                          </div>
                          <p className="text-stone-700 mt-0.5">
                            {s.signal_description}
                          </p>
                          {s.signal_url && (
                            <a
                              href={s.signal_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1 mt-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              View source
                            </a>
                          )}
                        </div>
                        <div className="text-xs text-stone-400 shrink-0">
                          {new Date(s.detected_at).toLocaleDateString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right sidebar — Actions */}
        <div className="space-y-4">
          {/* Advance Stage */}
          <Card>
            <CardContent className="pt-5 pb-4">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                Advance Stage
              </h3>
              <Select
                value={prospect.sequence_stage}
                onValueChange={handleAdvanceStage}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEQUENCE_STAGES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Score Breakdown */}
          <Card>
            <CardContent className="pt-5 pb-4">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                Score Breakdown
              </h3>
              <div className="space-y-1.5">
                {Object.entries(prospect.score_breakdown || {}).map(
                  ([key, val]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="text-stone-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                      <span className="font-bold text-stone-700">
                        +{val as number}
                      </span>
                    </div>
                  )
                )}
                <div className="border-t pt-1.5 flex items-center justify-between text-sm font-bold">
                  <span className="text-stone-700">Total</span>
                  <span className="text-stone-900">
                    {prospect.priority_score}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="pt-5 pb-4 space-y-2">
              <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h3>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setActivityDialogOpen(true)}
              >
                <Send className="h-3.5 w-3.5 mr-2" /> Log Activity
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                onClick={() => setSignalDialogOpen(true)}
              >
                <AlertTriangle className="h-3.5 w-3.5 mr-2" /> Log Signal
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => handleAdvanceStage("disqualified")}
              >
                Disqualify
              </Button>
            </CardContent>
          </Card>

          {/* Enrichment Log */}
          {prospect.ai_enrichment_log &&
            prospect.ai_enrichment_log.length > 0 && (
              <Card>
                <CardContent className="pt-5 pb-4">
                  <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                    Enrichment History
                  </h3>
                  <div className="space-y-2">
                    {(prospect.ai_enrichment_log as { timestamp: string }[])
                      .slice(-3)
                      .reverse()
                      .map((log, i) => (
                        <div key={i} className="text-xs text-stone-400">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {new Date(log.timestamp).toLocaleDateString()}{" "}
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>

      {/* Log Activity Dialog */}
      <ActivityDialog
        open={activityDialogOpen}
        onOpenChange={setActivityDialogOpen}
        onSave={handleLogActivity}
      />

      {/* Log Signal Dialog */}
      <SignalDialog
        open={signalDialogOpen}
        onOpenChange={setSignalDialogOpen}
        onSave={handleLogSignal}
      />
    </>
  );
}

function ActivityDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (data: Record<string, string | null>) => void;
}) {
  const [channel, setChannel] = useState("linkedin_dm");
  const [actionType, setActionType] = useState("");
  const [content, setContent] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Activity</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Channel</Label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHANNELS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Action Type</Label>
            <Input
              placeholder="e.g., connection_request, cold_email_1"
              value={actionType}
              onChange={(e) => setActionType(e.target.value)}
            />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea
              placeholder="What did you send?"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                onSave({
                  channel,
                  action_type: actionType || null,
                  content: content || null,
                });
                setChannel("linkedin_dm");
                setActionType("");
                setContent("");
              }}
            >
              Log
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SignalDialog({
  open,
  onOpenChange,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSave: (data: Record<string, string | number | null>) => void;
}) {
  const [signalType, setSignalType] = useState("linkedin_post");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [strength, setStrength] = useState("5");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Log Signal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Signal Type</Label>
            <Select value={signalType} onValueChange={setSignalType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SIGNAL_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="What did you observe?"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>URL (optional)</Label>
            <Input
              placeholder="Link to the signal"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <div>
            <Label>Strength (1-10)</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                onSave({
                  signal_type: signalType,
                  signal_description: description || null,
                  signal_url: url || null,
                  signal_strength: parseInt(strength) || 5,
                });
                setSignalType("linkedin_post");
                setDescription("");
                setUrl("");
                setStrength("5");
              }}
            >
              Log
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

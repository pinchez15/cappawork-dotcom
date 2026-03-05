"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Minus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Flame,
  MessageSquare,
  UserPlus,
  Send,
  MessageCircle,
  Reply,
  Phone,
  Pencil,
  Target,
} from "lucide-react";
import {
  createGoalAction,
  updateGoalAction,
  updateCounterAction,
  updateTargetsAction,
  toggleEodCheckAction,
  updateGratitudeAction,
} from "@/server/actions/outreach";
import { OutreachOverview } from "@/components/admin/outreach-overview";
import type {
  OutreachGoal,
  OutreachEntry,
  OutreachTarget,
  OutreachCounts,
  OutreachEodChecks,
} from "@/server/repos/outreach";

// ── Config ──────────────────────────────────────────────────────

type CounterConfig = {
  id: string;
  label: string;
  target: number;
  icon: typeof MessageSquare;
  noTarget?: boolean;
};

const COUNTERS: CounterConfig[] = [
  { id: "referral", label: "Referral Partner Messages", target: 5, icon: MessageSquare },
  { id: "connect", label: "Connection Requests", target: 20, icon: UserPlus },
  { id: "dms", label: "DMs Sent", target: 10, icon: Send },
  { id: "comments", label: "Comments on ICP Posts", target: 10, icon: MessageCircle },
  { id: "replies", label: "Replies Handled", target: 0, icon: Reply, noTarget: true },
  { id: "calls", label: "Calls Booked", target: 0, icon: Phone, noTarget: true },
];

const EOD_ITEMS = [
  { label: "Did I hit my volume targets?", sub: "If no — real obstacle or avoidance?" },
  { label: "Real work or busywork?", sub: "Tweaking your site is not outreach. Reading about sales is not sales." },
  { label: "Did I hold price and frame?", sub: "If you softened — write down what happened." },
  { label: "Any side quests?", sub: "Parking lot list. Review monthly." },
  { label: "Tomorrow's targets identified?", sub: "Don't start tomorrow with \"who should I message?\"" },
];

const TEMPLATES = {
  referral: [
    {
      label: "People You Know Well",
      text: `Hey [name] — I work with founder-led service companies in the $3M–$10M range on a specific problem: revenue growing, but profit not keeping pace. The operational model that works at $2M starts breaking down at $5M — best people buried in low-value work, margin compressing with every new hire, data scattered across a dozen tools.\n\nI've built a diagnostic that quantifies exactly where the leaks are and what the highest-leverage fix is. In one recent engagement we helped a founder go from $45K to $225K in annual profit — same team, same market — by identifying and removing the constraint.\n\nGiven the clients you work with, I'd love to compare notes. Are you seeing this pattern? Would be worth a quick conversation.`,
    },
    {
      label: "People You Half-Know",
      text: `Hey [name] — we're connected but haven't talked in a while. I work with founder-led service companies in the $3M–$10M range on a problem I think you see constantly: revenue growing, but profit not keeping pace. The operational model that works at $2M starts breaking down at $5M.\n\nI'd love to compare notes on what you're seeing. Worth a 15-minute call?`,
    },
    {
      label: "After a Good Conversation",
      text: `[name] — really appreciated the conversation. If you come across any founder-led service companies in the $3M–$10M range where revenue is growing but margin isn't following — that's exactly who I help. Happy to be a resource anytime. And same goes the other way — if I run into anyone who needs [what they do], you're my first call.`,
    },
  ],
  icp: [
    {
      label: "Connection Request (300 char max)",
      text: `[name] — I work with founder-led service companies in the $3M–$10M range on profit optimization. Noticed you're running [company] in [industry]. Would love to connect.`,
    },
    {
      label: "DM to New or Existing Connection",
      text: `Hey [name] — I noticed you're running [company] in [industry]. I work with founder-led service businesses in your revenue range on a specific problem: the gap between revenue growth and profit growth.\n\nMost companies at your stage are running 15–30 tools, with the best people spending 60% of their time on work that could be automated. Revenue goes up, headcount goes up, but margin stays flat or shrinks.\n\nWe built a diagnostic that puts exact dollar figures on where that's happening. Would it be worth a 15-minute conversation to see if the pattern fits?`,
    },
    {
      label: "When They Reply With Interest",
      text: `Appreciate you getting back to me. The short version: I run a diagnostic for founder-led service companies that quantifies where profit leaks as you scale — workflow inefficiency, software sprawl, labor on tasks that should be automated. Every finding comes with a dollar figure.\n\nIn a recent engagement, we helped a founder go from $45K annual profit to $225K. Same team. Same market.\n\nWould a 15-minute call this week make sense? I can share what we typically find in [their industry] and you can decide if it's relevant.`,
    },
  ],
  followup: [
    {
      label: "No Reply After 5-7 Days",
      text: `[name] — just bumping this up. No pressure at all — I know the inbox is relentless. If the timing isn't right, happy to reconnect down the road. But if the margin compression pattern resonates, the conversation is worth the 15 minutes.`,
    },
    {
      label: "Referral Partner Check-in (Monthly)",
      text: `Hey [name] — hope things are going well. Quick update: just wrapped another diagnostic where we found [$ amount] in margin recovery for a [industry] company. Keeps reinforcing the pattern. If any of your clients are bumping up against that revenue-grows-but-profit-doesn't ceiling, happy to be a resource.`,
    },
  ],
};

// ── Types ────────────────────────────────────────────────────────

type Props = {
  goal: OutreachGoal | null;
  entry: OutreachEntry | null;
  entries: OutreachEntry[];
  currentDate: string;
};

// ── Component ───────────────────────────────────────────────────

export function OutreachPlanner({ goal, entry, entries, currentDate }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const isToday = selectedDate === today;

  // Local state derived from entry
  const [counts, setCounts] = useState<OutreachCounts>(
    (entry?.counts as OutreachCounts) || {}
  );
  const [targets, setTargets] = useState<OutreachTarget[]>(
    (entry?.targets as OutreachTarget[]) || [
      { text: "", completed: false },
      { text: "", completed: false },
      { text: "", completed: false },
    ]
  );
  const [eodChecks, setEodChecks] = useState<OutreachEodChecks>(
    (entry?.eod_checks as OutreachEodChecks) || {}
  );
  const [gratitude, setGratitude] = useState<string[]>(
    (entry?.gratitude as string[]) || ["", "", ""]
  );

  // Goal dialog
  const [goalDialogOpen, setGoalDialogOpen] = useState(false);
  const [goalInput, setGoalInput] = useState(goal?.goal_text || "");
  const [goalSaving, setGoalSaving] = useState(false);

  // Template copy
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null);

  // Collapsibles
  const [convictionOpen, setConvictionOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<string | null>(null);

  // Debounce refs
  const counterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const targetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const gratitudeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state when date changes via props
  useEffect(() => {
    setCounts((entry?.counts as OutreachCounts) || {});
    setTargets(
      (entry?.targets as OutreachTarget[]) || [
        { text: "", completed: false },
        { text: "", completed: false },
        { text: "", completed: false },
      ]
    );
    setEodChecks((entry?.eod_checks as OutreachEodChecks) || {});
    setGratitude((entry?.gratitude as string[]) || ["", "", ""]);
  }, [entry]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  // ── Date navigation ─────────────────────────────────────────

  function navigateDate(offset: number) {
    const d = new Date(selectedDate + "T12:00:00");
    d.setDate(d.getDate() + offset);
    const newDate = d.toISOString().slice(0, 10);
    // Navigate by changing the URL
    window.location.href = `/admin/outreach?date=${newDate}`;
  }

  function goToToday() {
    window.location.href = "/admin/outreach";
  }

  // ── Counter handlers ────────────────────────────────────────

  function updateCounter(id: string, delta: number) {
    setCounts((prev) => {
      const newVal = Math.max(0, (prev[id] || 0) + delta);
      const next = { ...prev, [id]: newVal };

      // Check if target hit
      if (delta > 0) {
        const counter = COUNTERS.find((c) => c.id === id);
        if (counter && !counter.noTarget && newVal === counter.target) {
          showToast(`${counter.label} — TARGET HIT`);
        }
      }

      // Debounce save
      if (counterTimerRef.current) clearTimeout(counterTimerRef.current);
      counterTimerRef.current = setTimeout(() => {
        updateCounterAction(selectedDate, id, next[id]);
      }, 200);

      return next;
    });
  }

  // ── Target handlers ─────────────────────────────────────────

  function updateTargetText(index: number, text: string) {
    setTargets((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], text };
      if (targetTimerRef.current) clearTimeout(targetTimerRef.current);
      targetTimerRef.current = setTimeout(() => {
        updateTargetsAction(selectedDate, next);
      }, 1000);
      return next;
    });
  }

  function toggleTarget(index: number) {
    setTargets((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], completed: !next[index].completed };
      updateTargetsAction(selectedDate, next);
      return next;
    });
  }

  // ── EOD handler ─────────────────────────────────────────────

  function toggleEod(index: number, checked: boolean) {
    setEodChecks((prev) => {
      const next = { ...prev, [String(index)]: checked };
      toggleEodCheckAction(selectedDate, index, checked);
      return next;
    });
  }

  // ── Gratitude handler ───────────────────────────────────────

  function updateGratitudeItem(index: number, text: string) {
    setGratitude((prev) => {
      const next = [...prev];
      next[index] = text;
      if (gratitudeTimerRef.current) clearTimeout(gratitudeTimerRef.current);
      gratitudeTimerRef.current = setTimeout(() => {
        updateGratitudeAction(selectedDate, next);
      }, 1000);
      return next;
    });
  }

  // ── Goal handler ────────────────────────────────────────────

  async function saveGoal() {
    if (!goalInput.trim()) return;
    setGoalSaving(true);
    if (goal) {
      await updateGoalAction(goal.id, goalInput.trim());
    } else {
      await createGoalAction(goalInput.trim());
    }
    setGoalSaving(false);
    setGoalDialogOpen(false);
    window.location.reload();
  }

  // ── Copy template ───────────────────────────────────────────

  function copyTemplate(key: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(key);
      setTimeout(() => setCopiedIdx(null), 2000);
    });
  }

  // ── Compute totals ──────────────────────────────────────────

  let totalDone = 0;
  let totalTarget = 0;
  COUNTERS.forEach((c) => {
    if (!c.noTarget) {
      totalDone += Math.min(counts[c.id] || 0, c.target);
      totalTarget += c.target;
    }
  });
  const totalPct = totalTarget > 0 ? Math.round((totalDone / totalTarget) * 100) : 0;
  const allComplete = totalPct >= 100;

  // ── Goal info ──────────────────────────────────────────────

  let dayOfGoal = 0;
  let weekOfGoal = 0;
  if (goal) {
    const start = new Date(goal.start_date + "T00:00:00");
    const current = new Date(selectedDate + "T00:00:00");
    dayOfGoal = Math.max(1, Math.ceil((current.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    weekOfGoal = Math.ceil(dayOfGoal / 7);
  }

  // ── Date display ───────────────────────────────────────────

  const displayDate = new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
          {toast}
        </div>
      )}

      {/* Header with tabs */}
      <Tabs defaultValue="today">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Outreach Planner
            </h1>
            <p className="text-muted-foreground mt-1">{displayDate}</p>
          </div>
          <TabsList>
            <TabsTrigger value="today">Today</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
        </div>

        {/* ── Today Tab ──────────────────────────────────────────── */}
        <TabsContent value="today" className="space-y-6">
          {/* Date navigation */}
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateDate(-1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {!isToday && (
              <Button variant="outline" size="sm" onClick={goToToday}>
                Today
              </Button>
            )}
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateDate(1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Goal banner */}
          <Card className="border-blue-200 bg-blue-50/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-blue-600" />
                  <div>
                    {goal ? (
                      <>
                        <p className="text-sm font-semibold text-blue-900">
                          {goal.goal_text}
                        </p>
                        <p className="text-xs text-blue-600 mt-0.5">
                          Day {dayOfGoal} of 90 — Week {weekOfGoal}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No active goal. Set a 90-day goal to start tracking.
                      </p>
                    )}
                  </div>
                </div>
                <Dialog open={goalDialogOpen} onOpenChange={setGoalDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setGoalInput(goal?.goal_text || "")}
                    >
                      <Pencil className="mr-1 h-3 w-3" />
                      {goal ? "Edit" : "Set Goal"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {goal ? "Edit 90-Day Goal" : "Set 90-Day Goal"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                      <Input
                        placeholder="e.g., Book 10 diagnostic calls"
                        value={goalInput}
                        onChange={(e) => setGoalInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveGoal()}
                      />
                      <Button onClick={saveGoal} disabled={goalSaving || !goalInput.trim()}>
                        {goalSaving ? "Saving..." : "Save Goal"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Daily Targets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">3 Daily Targets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {targets.map((target, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Checkbox
                    checked={target.completed}
                    onCheckedChange={() => toggleTarget(idx)}
                  />
                  <Input
                    placeholder={`Target ${idx + 1}`}
                    value={target.text}
                    onChange={(e) => updateTargetText(idx, e.target.value)}
                    className={target.completed ? "line-through text-muted-foreground" : ""}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Conviction Ritual */}
          <Collapsible open={convictionOpen} onOpenChange={setConvictionOpen}>
            <Card className="border-blue-200 bg-blue-50/50">
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-blue-50/80 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-blue-600" />
                      <CardTitle className="text-base text-blue-900">
                        Conviction Ritual — Read Before You Start
                      </CardTitle>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 text-blue-600 transition-transform duration-200 ${
                        convictionOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pt-0 space-y-4 text-sm text-stone-700">
                  <p className="font-medium text-blue-800">Read out loud:</p>
                  <blockquote className="border-l-2 border-blue-300 pl-4 italic">
                    &ldquo;$1.5M revenue, $45K profit &rarr; $1.8M revenue, $225K profit. Same team. Same market. 5x in 12 months.&rdquo;
                  </blockquote>
                  <blockquote className="border-l-2 border-blue-300 pl-4 italic">
                    &ldquo;I work with founder-led service companies doing $3M-$10M where revenue is growing but profit isn&rsquo;t following. I find where the margin leaks and I fix it.&rdquo;
                  </blockquote>
                  <blockquote className="border-l-2 border-blue-300 pl-4 italic">
                    &ldquo;The diagnostic is $30,000. It&rsquo;s worth 10x that. The implementation starts at $50,000. It pays for itself in the first quarter.&rdquo;
                  </blockquote>
                  <p className="font-semibold text-red-600 text-xs border-t pt-3">
                    Closing % = Sales Skill x Belief&sup2;. Your belief is squared.
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* Counter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {COUNTERS.map((c) => {
              const count = counts[c.id] || 0;
              const isComplete = !c.noTarget && count >= c.target;
              const pct = c.noTarget ? 0 : Math.min(100, (count / c.target) * 100);
              const Icon = c.icon;

              return (
                <Card
                  key={c.id}
                  className={`transition-all ${
                    isComplete ? "border-green-300 bg-green-50/50" : ""
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Icon
                          className={`h-4 w-4 ${
                            isComplete ? "text-green-600" : "text-muted-foreground"
                          }`}
                        />
                        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {c.label}
                        </span>
                      </div>
                      {isComplete && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Done
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-4">
                      <span
                        className={`text-4xl font-bold tabular-nums ${
                          isComplete ? "text-green-600" : "text-foreground"
                        }`}
                      >
                        {count}
                      </span>
                      {!c.noTarget && (
                        <span className="text-lg text-muted-foreground font-medium">
                          / {c.target}
                        </span>
                      )}
                    </div>

                    {!c.noTarget && (
                      <Progress
                        value={pct}
                        className="h-2 mb-4"
                        variant={isComplete ? "success" : "default"}
                        animated={false}
                      />
                    )}

                    {!c.noTarget && c.target <= 10 && (
                      <div className="flex justify-center gap-1.5 mb-4">
                        {Array.from({ length: c.target }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-2.5 w-2.5 rounded-full transition-all ${
                              i < count
                                ? isComplete
                                  ? "bg-green-500 scale-110"
                                  : "bg-blue-500 scale-110"
                                : "bg-stone-200"
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => updateCounter(c.id, -1)}
                        disabled={count <= 0}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        className={`px-6 ${
                          isComplete
                            ? "bg-green-600 hover:bg-green-700"
                            : ""
                        }`}
                        onClick={() => updateCounter(c.id, 1)}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        1
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Total Progress */}
          <Card className={allComplete ? "border-green-300" : ""}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Total Daily Actions
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {totalDone} / {totalTarget}
                </span>
              </div>
              <Progress
                value={totalPct}
                className="h-4"
                size="lg"
                variant={allComplete ? "success" : "default"}
                animated={false}
              />
              <p
                className={`text-center text-sm font-semibold mt-2 ${
                  allComplete ? "text-green-600" : "text-muted-foreground"
                }`}
              >
                {totalPct}%{allComplete ? " — All targets hit" : ""}
              </p>
            </CardContent>
          </Card>

          {/* Message Templates */}
          <Collapsible open={templatesOpen} onOpenChange={setTemplatesOpen}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-stone-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Message Templates</CardTitle>
                    <ChevronDown
                      className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                        templatesOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <Tabs defaultValue="referral">
                    <TabsList className="mb-4">
                      <TabsTrigger value="referral">Referral Partners</TabsTrigger>
                      <TabsTrigger value="icp">Direct to ICP</TabsTrigger>
                      <TabsTrigger value="followup">Follow-ups</TabsTrigger>
                    </TabsList>

                    {Object.entries(TEMPLATES).map(([tabKey, templates]) => (
                      <TabsContent key={tabKey} value={tabKey} className="space-y-4">
                        {templates.map((tmpl, idx) => {
                          const key = `${tabKey}-${idx}`;
                          const isCopied = copiedIdx === key;

                          return (
                            <div key={key}>
                              <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
                                {tmpl.label}
                              </p>
                              <div
                                className="relative group rounded-lg border bg-stone-50 p-4 text-sm leading-relaxed text-stone-700 cursor-pointer hover:border-blue-300 transition-colors"
                                onClick={() => copyTemplate(key, tmpl.text)}
                              >
                                <div className="whitespace-pre-line">{tmpl.text}</div>
                                <div
                                  className={`absolute top-2 right-2 flex items-center gap-1 text-xs font-medium transition-opacity ${
                                    isCopied
                                      ? "text-green-600 opacity-100"
                                      : "text-muted-foreground opacity-0 group-hover:opacity-100"
                                  }`}
                                >
                                  {isCopied ? (
                                    <>
                                      <Check className="h-3 w-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3 w-3" /> Click to copy
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          {/* End of Day Check */}
          <Card className="border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="text-base text-amber-900">
                End of Day — Honest Check
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {EOD_ITEMS.map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-start gap-3 rounded-lg p-3 hover:bg-amber-50 transition-colors cursor-pointer"
                >
                  <Checkbox
                    checked={eodChecks[String(idx)] || false}
                    onCheckedChange={(checked) => toggleEod(idx, !!checked)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Gratitude */}
          <Card className="border-purple-200 bg-purple-50/30">
            <CardHeader>
              <CardTitle className="text-base text-purple-900">
                3 Things I&apos;m Grateful For
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {gratitude.map((item, idx) => (
                <Input
                  key={idx}
                  placeholder={`${idx + 1}.`}
                  value={item}
                  onChange={(e) => updateGratitudeItem(idx, e.target.value)}
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Overview Tab ───────────────────────────────────────── */}
        <TabsContent value="overview">
          <OutreachOverview goal={goal} entries={entries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

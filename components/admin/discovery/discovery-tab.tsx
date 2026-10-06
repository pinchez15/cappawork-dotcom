"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Check,
  CircleDashed,
  Copy,
  Loader2,
  Pencil,
  Phone,
  Plus,
  Star,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type {
  ComputedValue,
  DiscoveryAnswer,
  DiscoveryConstraint,
  DiscoveryQuestion,
  DiscoveryRun,
  DiscoveryView,
} from "@/server/repos/discovery";
import { CallMode } from "./call-mode";
import {
  DECISION_LABELS,
  LIST_FIELDS,
  SENTINELS,
  TIER_LABELS,
  answersFor,
  fieldFilled,
  groupByStage,
  humanize,
  isFilled,
} from "./shared";

type Props = { dealId: string; companyName: string; initialView: DiscoveryView };

const RUNNING = new Set(["queued", "extracting", "writing", "recap", "gating", "brief"]);

export function DiscoveryTab({ dealId, companyName, initialView }: Props) {
  const [view, setView] = useState(initialView);
  const [callMode, setCallMode] = useState(false);
  const base = `/api/admin/bd-deals/${dealId}/discovery`;

  const refresh = useCallback(async () => {
    const res = await fetch(base, { cache: "no-store" });
    if (res.ok) setView(await res.json());
  }, [base]);

  const patch = useCallback(
    async (body: Record<string, unknown>) => {
      const res = await fetch(base, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(typeof data.error === "string" ? data.error : "Could not save");
        return false;
      }
      setView(data);
      return true;
    },
    [base]
  );

  const latestRun = view.runs[0];
  useEffect(() => {
    if (!latestRun || !RUNNING.has(latestRun.status)) return;
    const id = setInterval(refresh, 4000);
    return () => clearInterval(id);
  }, [latestRun, refresh]);

  if (!view.bank) {
    return (
      <Card>
        <CardContent className="py-6 text-sm text-muted-foreground">
          No question bank imported. Run{" "}
          <code className="rounded bg-muted px-1">node --env-file=.env.local scripts/import-discovery-bank.mjs</code>.
        </CardContent>
      </Card>
    );
  }

  const stages = groupByStage(view.bank.questions);
  const mustFieldList = [
    ...new Set(view.bank.questions.filter((q) => q.tier === "must").flatMap((q) => q.fields)),
  ];
  const mustFilled = mustFieldList.filter((f) => fieldFilled(view, f)).length;
  const decision = view.deal?.decision ? DECISION_LABELS[view.deal.decision] : null;

  return (
    <div className="space-y-6 max-w-4xl">
      {callMode && (
        <CallMode
          dealId={dealId}
          companyName={companyName}
          view={view}
          onClose={() => setCallMode(false)}
          onRefresh={setView}
        />
      )}

      {/* Summary */}
      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={() => setCallMode(true)}>
          <Phone className="h-4 w-4 mr-2" /> Call mode
        </Button>
        <Badge variant="outline" className="tabular-nums">
          Must {mustFilled}/{mustFieldList.length}
        </Badge>
        {view.deal?.coverage != null && (
          <Badge variant="outline">Coverage {Math.round(view.deal.coverage * 100)}%</Badge>
        )}
        {decision && <Badge className={decision.className}>{decision.label}</Badge>}
        {view.deal?.hypothesis_result && (
          <Badge variant="outline">Hypothesis {view.deal.hypothesis_result}</Badge>
        )}
        <span className="ml-auto text-xs text-muted-foreground">Bank {view.bank.version}</span>
      </div>

      <PreCall view={view} onPatch={patch} />

      <RunPanel dealId={dealId} run={latestRun} priceUsd={view.deal?.price_usd ?? 35000} onQueued={refresh} />

      {view.deal && <ComputedSummary view={view} />}

      {/* Deal fields by stage */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold">Deal</h2>
        {stages.map(({ stage, questions }) => {
          const fields = [
            ...new Set(questions.flatMap((q) => q.fields).filter((f) => f.startsWith("deal."))),
          ];
          if (fields.length === 0) return null;
          return (
            <Card key={stage}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{stage}</CardTitle>
              </CardHeader>
              <CardContent className="divide-y">
                {fields.map((field) => {
                  const q = questions.find((x) => x.fields.includes(field))!;
                  return (
                    <FieldRow
                      key={field}
                      field={field}
                      cue={q.cue}
                      tier={q.tier}
                      answers={answersFor(view.answers, field, null)}
                      onSave={(items) => patch({ action: "set_field", field, items })}
                    />
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Constraints */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold">Constraints ({view.constraints.length}/3)</h2>
          <Button
            size="sm"
            variant="outline"
            disabled={view.constraints.length >= 3}
            onClick={() => patch({ action: "add_constraint" })}
          >
            <Plus className="h-3.5 w-3.5 mr-1" /> Add constraint
          </Button>
        </div>
        {view.constraints.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No constraints yet. The post-call pass creates them, or add one by hand.
          </p>
        )}
        {view.constraints.map((c) => (
          <ConstraintCard
            key={c.id}
            constraint={c}
            questions={view.bank!.questions.filter((q) => q.fields.some((f) => f.startsWith("constraint.")))}
            answers={view.answers}
            onSave={(field, items) => patch({ action: "set_field", field, items, constraint_id: c.id })}
            onConfirmPrimary={() => patch({ action: "confirm_primary", constraint_id: c.id })}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Pre-call: hypothesis and price ─────────────────────────────────────────

function PreCall({
  view,
  onPatch,
}: {
  view: DiscoveryView;
  onPatch: (body: Record<string, unknown>) => Promise<boolean>;
}) {
  const [hypothesis, setHypothesis] = useState(view.deal?.hypothesis ?? "");
  const [price, setPrice] = useState(String(view.deal?.price_usd ?? 35000));
  const dirty = hypothesis !== (view.deal?.hypothesis ?? "");

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Before the call</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="text-xs text-muted-foreground">
            Hypothesis: where demand exceeds capacity, the likely constraint, rough monthly value
          </label>
          <div className="flex gap-2 mt-1">
            <Input value={hypothesis} onChange={(e) => setHypothesis(e.target.value)} maxLength={500} />
            <Button
              variant="outline"
              disabled={!dirty}
              onClick={() => onPatch({ action: "set_hypothesis", hypothesis })}
            >
              Save
            </Button>
          </div>
        </div>
        <div className="flex items-end gap-2">
          <div>
            <label className="text-xs text-muted-foreground">Likely price (USD)</label>
            <Input
              className="w-36 mt-1"
              inputMode="numeric"
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
            />
          </div>
          <Button
            variant="outline"
            disabled={!price || Number(price) === view.deal?.price_usd}
            onClick={() => onPatch({ action: "set_price", price_usd: Number(price) })}
          >
            Save
          </Button>
          <span className="text-xs text-muted-foreground pb-2">
            Gate needs ${Math.round((Number(price) * 3) / 12).toLocaleString("en-US")}/mo unlocked
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Post-call run ──────────────────────────────────────────────────────────

function RunPanel({
  dealId,
  run,
  priceUsd,
  onQueued,
}: {
  dealId: string;
  run: DiscoveryRun | undefined;
  priceUsd: number;
  onQueued: () => void;
}) {
  const [open, setOpen] = useState(!run);
  const [transcript, setTranscript] = useState("");
  const [research, setResearch] = useState("");
  const [constraintMap, setConstraintMap] = useState("");
  const [closeRate, setCloseRate] = useState("");
  const [margin, setMargin] = useState("");
  const [ownerRate, setOwnerRate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    try {
      const pct = (v: string) => (v ? Number(v) / 100 : undefined);
      const res = await fetch(`/api/admin/bd-deals/${dealId}/discovery/runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          research: research || undefined,
          constraint_map: constraintMap || undefined,
          price_usd: priceUsd,
          defaults: {
            close_rate: pct(closeRate),
            margin: pct(margin),
            owner_revenue_per_hour: ownerRate ? Number(ownerRate) : undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = typeof data.error === "string" ? data.error : data.error?.fieldErrors?.transcript?.[0];
        toast.error(msg ?? "Could not start the run");
        return;
      }
      toast.success("Post-call pass queued");
      setTranscript("");
      setOpen(false);
      onQueued();
    } finally {
      setSubmitting(false);
    }
  }

  const running = run && RUNNING.has(run.status);

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm">After the call</CardTitle>
        {run && (
          <Button size="sm" variant="ghost" onClick={() => setOpen((o) => !o)}>
            {open ? "Hide" : "New transcript"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {open && (
          <div className="space-y-3">
            <Textarea
              placeholder="Paste the transcript: the text of the Meet transcript Doc works. Meet calls titled “discovery” arrive on their own."
              rows={8}
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="font-mono text-xs"
            />
            <Textarea
              placeholder="Extra research notes (the account record is added automatically)"
              rows={2}
              value={research}
              onChange={(e) => setResearch(e.target.value)}
              className="text-xs"
            />
            <Textarea
              placeholder="Constraint map: the 3 to 5 places work piles up in firms like this"
              rows={3}
              value={constraintMap}
              onChange={(e) => setConstraintMap(e.target.value)}
              className="text-xs"
            />
            <div className="flex flex-wrap gap-2 text-xs">
              <Input className="w-32" placeholder="Close rate %" inputMode="decimal" value={closeRate} onChange={(e) => setCloseRate(e.target.value)} />
              <Input className="w-32" placeholder="Margin %" inputMode="decimal" value={margin} onChange={(e) => setMargin(e.target.value)} />
              <Input className="w-40" placeholder="Owner $/hour" inputMode="decimal" value={ownerRate} onChange={(e) => setOwnerRate(e.target.value)} />
              <Button className="ml-auto" disabled={submitting || transcript.trim().length < 200} onClick={submit}>
                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Run post-call pass
              </Button>
            </div>
          </div>
        )}

        {run && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {running && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span className="capitalize">{run.status}</span>
              <span>· {new Date(run.created_at).toLocaleString()}</span>
              {run.model && <span>· {run.model}</span>}
            </div>
            {run.error && <p className="text-xs text-red-600">{run.error}</p>}

            {run.hypothesis_check && (
              <p className="text-sm">
                <strong className="capitalize">Hypothesis {run.hypothesis_check.result}.</strong>{" "}
                {run.hypothesis_check.evidence}
              </p>
            )}

            {run.gate && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide">Gate</h3>
                  {DECISION_LABELS[run.gate.decision] && (
                    <Badge className={DECISION_LABELS[run.gate.decision].className}>
                      {DECISION_LABELS[run.gate.decision].label}
                    </Badge>
                  )}
                </div>
                <ol className="space-y-1 text-xs">
                  {run.gate.tests.map((t) => (
                    <li key={t.n} className="flex gap-2">
                      {t.passed ? (
                        <Check className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                      )}
                      <span>
                        <strong>{t.n}. {t.test}</strong>{" "}
                        <span className="text-muted-foreground">{t.detail}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {run.recap_body && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wide">Recap draft</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(`Subject: ${run.recap_subject}\n\n${run.recap_body}`);
                      toast.success("Recap copied");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                </div>
                <p className="text-sm font-medium mb-1">{run.recap_subject}</p>
                <Textarea readOnly value={run.recap_body} rows={14} className="text-sm" />
              </div>
            )}

            {run.proposal_brief && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xs font-semibold uppercase tracking-wide">Proposal brief</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(run.proposal_brief ?? "");
                      toast.success("Proposal brief copied");
                    }}
                  >
                    <Copy className="h-3.5 w-3.5 mr-1" /> Copy
                  </Button>
                </div>
                {run.pricing && (
                  <p className="text-xs text-muted-foreground mb-2">
                    Target ${run.pricing.price_target.toLocaleString("en-US")} (range $
                    {run.pricing.price_low.toLocaleString("en-US")}–${run.pricing.price_high.toLocaleString("en-US")})
                    {" · "}cap {run.pricing.hours_cap} hours
                    {run.pricing.payback_months != null && ` · pays back in ${run.pricing.payback_months} months`}
                  </p>
                )}
                <pre className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-xs font-sans">
                  {run.proposal_brief}
                </pre>
              </div>
            )}

            {run.demo_brief && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide mb-1">Demo brief</h3>
                <pre className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-xs font-sans">
                  {run.demo_brief}
                </pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Computed fields ────────────────────────────────────────────────────────

function ComputedLine({ label, value }: { label: string; value: ComputedValue | null }) {
  if (!value) return null;
  return (
    <div className="text-sm">
      <span className="text-muted-foreground">{label}:</span> <strong>{value.value}</strong>
      <div className="text-xs text-muted-foreground">{value.math}</div>
      {value.assumptions.length > 0 && (
        <div className="text-xs text-amber-700">Assumes: {value.assumptions.join("; ")}</div>
      )}
    </div>
  );
}

function ComputedSummary({ view }: { view: DiscoveryView }) {
  const d = view.deal!;
  if (!d.case_summary && !d.unserved_value_monthly) return null;
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Case</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {d.case_summary && <p className="text-sm">{d.case_summary}</p>}
        <ComputedLine label="Unserved value / month" value={d.unserved_value_monthly} />
        <ComputedLine label="Unlocked value / month" value={d.unlocked_value_monthly} />
        <ComputedLine label="Change risk" value={d.change_risk} />
      </CardContent>
    </Card>
  );
}

// ─── Field row with inline edit ─────────────────────────────────────────────

type Item = { value: string; quote?: string; at?: string };

function FieldRow({
  field,
  cue,
  tier,
  answers,
  onSave,
}: {
  field: string;
  cue: string;
  tier: keyof typeof TIER_LABELS;
  answers: DiscoveryAnswer[];
  onSave: (items: Item[]) => Promise<boolean>;
}) {
  const [editing, setEditing] = useState(false);
  const list = LIST_FIELDS.has(field);
  const filled = isFilled(answers);
  const [value, setValue] = useState("");
  const [quote, setQuote] = useState("");
  const [at, setAt] = useState("");

  function startEdit() {
    setValue(list ? answers.map((a) => a.value).join("\n") : (answers[0]?.value ?? ""));
    setQuote(list ? "" : (answers[0]?.quote ?? ""));
    setAt(list ? "" : (answers[0]?.transcript_at ?? ""));
    setEditing(true);
  }

  async function save() {
    const items: Item[] = list
      ? value.split("\n").map((v) => v.trim()).filter(Boolean).map((v) => ({ value: v }))
      : [{ value: value.trim(), quote: quote.trim() || undefined, at: at.trim() || undefined }];
    if (items.length === 0 || !items[0].value) return;
    if (await onSave(items)) setEditing(false);
  }

  return (
    <div className="py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-start gap-2">
        {filled ? (
          <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
        ) : (
          <CircleDashed className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{humanize(field)}</span>
            {tier !== "must" && <span className="text-[10px] uppercase text-muted-foreground">{TIER_LABELS[tier]}</span>}
            <span className="text-xs text-muted-foreground truncate">{cue}</span>
          </div>

          {editing ? (
            <div className="mt-2 space-y-2">
              <Textarea
                rows={list ? 3 : 2}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={list ? "One per line" : 'Value, or "not covered" / "no answer"'}
                className="text-sm"
              />
              {!list && (
                <div className="flex gap-2">
                  <Input value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="Verbatim quote" className="text-xs" />
                  <Input value={at} onChange={(e) => setAt(e.target.value)} placeholder="00:12:41" className="w-28 text-xs" />
                </div>
              )}
              <div className="flex gap-2">
                <Button size="sm" onClick={save}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ) : answers.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">not covered</p>
          ) : (
            <ul className="mt-0.5 space-y-1">
              {answers.map((a) => (
                <li key={a.id} className="text-sm">
                  <span className={SENTINELS.has(a.value.toLowerCase()) ? "italic text-muted-foreground" : ""}>
                    {a.value}
                  </span>
                  {a.quote && <span className="block text-xs text-muted-foreground">“{a.quote}”{a.transcript_at && ` · ${a.transcript_at}`}</span>}
                  <span className="block text-[10px] text-muted-foreground/70">
                    {a.source} · {new Date(a.recorded_at).toLocaleDateString()} · bank {a.bank_version}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {!editing && (
          <Button size="icon" variant="ghost" className="h-7 w-7" onClick={startEdit} aria-label={`Edit ${humanize(field)}`}>
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Constraint card ────────────────────────────────────────────────────────

function ConstraintCard({
  constraint: c,
  questions,
  answers,
  onSave,
  onConfirmPrimary,
}: {
  constraint: DiscoveryConstraint;
  questions: DiscoveryQuestion[];
  answers: DiscoveryAnswer[];
  onSave: (field: string, items: Item[]) => Promise<boolean>;
  onConfirmPrimary: () => void;
}) {
  const fields = [...new Set(questions.flatMap((q) => q.fields).filter((f) => f.startsWith("constraint.")))];
  const title = answersFor(answers, "constraint.constraint", c.id)[0]?.value;

  return (
    <Card className={c.is_primary ? "border-amber-300" : undefined}>
      <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0 gap-2">
        <div>
          <CardTitle className="text-sm">
            Constraint {c.position}
            {title && !SENTINELS.has(title.toLowerCase()) && <span className="font-normal text-muted-foreground"> · {title}</span>}
          </CardTitle>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {c.fixable && <Badge variant="outline">Fixable: {c.fixable}</Badge>}
            {c.tied_to_capacity != null && (
              <Badge variant="outline">{c.tied_to_capacity ? "Caps delivery" : "Annoyance only"}</Badge>
            )}
            {c.profit_lever && <Badge variant="outline">Lever: {humanize(c.profit_lever)}</Badge>}
          </div>
        </div>
        {c.is_primary && c.primary_confirmed_at ? (
          <Badge className="bg-amber-100 text-amber-800"><Star className="h-3 w-3 mr-1" />Primary</Badge>
        ) : (
          <Button size="sm" variant={c.is_primary ? "default" : "outline"} onClick={onConfirmPrimary}>
            <Star className="h-3.5 w-3.5 mr-1" />
            {c.is_primary ? "Confirm primary" : "Make primary"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <ComputedLine label="Capacity unlocked" value={c.capacity_unlocked} />
        <ComputedLine label="Impact / month" value={c.impact_monthly} />
        <div className="divide-y">
          {fields.map((field) => {
            const q = questions.find((x) => x.fields.includes(field))!;
            return (
              <FieldRow
                key={field}
                field={field}
                cue={q.cue}
                tier={q.tier}
                answers={answersFor(answers, field, c.id)}
                onSave={(items) => onSave(field, items)}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

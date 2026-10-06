"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, X } from "lucide-react";
import type { DiscoveryView } from "@/server/repos/discovery";
import { TIER_LABELS, fieldFilled, groupByStage, PPPP_STAGES } from "./shared";

// Minute each block should end by, from the playbook's 30-minute call card.
const STAGE_ENDS_BY: Record<string, number> = {
  Frame: 1,
  Trigger: 3,
  Profit: 8,
  Possibility: 13,
  Pain: 23,
  Proof: 25,
  Playback: 30,
  "Next step": 30,
};

const POLL_MS = 5000;

type Props = {
  dealId: string;
  companyName: string;
  view: DiscoveryView;
  onClose: () => void;
  onRefresh: (view: DiscoveryView) => void;
};

function formatClock(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function CallMode({ dealId, companyName, view, onClose, onRefresh }: Props) {
  const bank = view.bank!;
  const stages = useMemo(
    () => [{ stage: "Frame", questions: [] }, ...groupByStage(bank.questions)],
    [bank.questions]
  );
  const [index, setIndex] = useState(1);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  // Cues you've asked, by question id. Local only: a tap is not evidence.
  const storageKey = `discovery-asked:${dealId}`;
  const [asked, setAsked] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(sessionStorage.getItem(storageKey) ?? "[]"));
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify([...asked]));
    } catch {}
  }, [asked, storageKey]);

  // Fields fill from MCP, manual edits and the post-call pass; pick them up while the call runs.
  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch(`/api/admin/bd-deals/${dealId}/discovery`, { cache: "no-store" });
      if (res.ok) onRefresh(await res.json());
    }, POLL_MS);
    return () => clearInterval(id);
  }, [dealId, onRefresh]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Keep the screen awake for the length of the call.
  useEffect(() => {
    let lock: { release: () => Promise<void> } | undefined;
    const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<typeof lock> } };
    nav.wakeLock?.request("screen").then((l) => (lock = l)).catch(() => {});
    return () => {
      lock?.release().catch(() => {});
    };
  }, []);

  const go = useCallback(
    (i: number) => setIndex(Math.max(0, Math.min(stages.length - 1, i))),
    [stages.length]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
      else if (/^[1-9]$/.test(e.key)) go(Number(e.key) - 1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, index, onClose]);

  const mustDone = (questions: typeof bank.questions) => {
    const must = questions.filter((q) => q.tier === "must");
    const done = must.filter((q) => q.fields.every((f) => fieldFilled(view, f)));
    return { done: done.length, total: must.length };
  };

  const current = stages[index];
  const elapsed = Math.floor((now - startedAt) / 1000);
  const endsBy = STAGE_ENDS_BY[current.stage];
  const behind = endsBy != null && elapsed > endsBy * 60;
  const many = current.questions.length > 6;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-navy text-white" role="dialog" aria-label="Call mode">
      {/* Stage strip */}
      <div className="flex items-center gap-2 border-b border-white/10 px-6 py-3">
        <span className="mr-2 text-sm text-white/50">{companyName}</span>
        <nav className="flex flex-1 flex-wrap gap-1.5">
          {stages.map((s, i) => {
            const { done, total } = mustDone(s.questions);
            const complete = total > 0 && done === total;
            return (
              <button
                key={s.stage}
                onClick={() => go(i)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  i === index
                    ? "bg-gold text-navy"
                    : complete
                      ? "bg-white/10 text-gold"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {s.stage}
                {total > 0 && (
                  <span className={`ml-1.5 tabular-nums ${i === index ? "text-navy/70" : "text-white/40"}`}>
                    {done}/{total}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
        <button
          onClick={() => setStartedAt(Date.now())}
          title="Reset the call clock"
          className={`font-mono text-2xl tabular-nums ${behind ? "text-amber-400" : "text-white/80"}`}
        >
          {formatClock(elapsed)}
        </button>
        <button onClick={onClose} className="ml-3 rounded-full p-2 text-white/60 hover:bg-white/10" aria-label="Exit call mode">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Cues */}
      <div className="flex-1 overflow-y-auto px-8 py-8 lg:px-16">
        <div className="mb-8 flex items-baseline gap-4">
          <h2 className="font-display text-6xl tracking-tight text-gold">{current.stage}</h2>
          {PPPP_STAGES.has(current.stage) && <span className="text-sm uppercase tracking-widest text-white/40">PPPP</span>}
          {endsBy != null && <span className="text-lg text-white/40">by {endsBy}:00</span>}
        </div>

        {current.stage === "Frame" ? (
          <p className="max-w-5xl text-4xl leading-snug text-white/90">{bank.frame}</p>
        ) : (
          <ul className={many ? "grid gap-x-12 gap-y-6 xl:grid-cols-2" : "max-w-5xl space-y-7"}>
            {current.questions.map((q) => {
              const filled = q.fields.every((f) => fieldFilled(view, f));
              const wasAsked = asked.has(q.question_id);
              const primaryTier = q.tier === "must";
              return (
                <li key={q.question_id}>
                  <button
                    onClick={() =>
                      setAsked((prev) => {
                        const next = new Set(prev);
                        if (next.has(q.question_id)) next.delete(q.question_id);
                        else next.add(q.question_id);
                        return next;
                      })
                    }
                    className="flex w-full items-start gap-5 text-left"
                  >
                    <span
                      className={`mt-1.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                        filled
                          ? "border-gold bg-gold text-navy"
                          : wasAsked
                            ? "border-white/60"
                            : primaryTier
                              ? "border-white/25"
                              : "border-dashed border-white/15"
                      }`}
                    >
                      {filled && <Check className="h-6 w-6" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0">
                      <span
                        className={`block ${many ? "text-3xl" : "text-4xl"} leading-tight ${
                          filled ? "text-white/40" : primaryTier ? "text-white" : "text-white/55"
                        }`}
                      >
                        {q.cue}
                        {!primaryTier && (
                          <span className="ml-3 align-middle text-sm font-semibold uppercase tracking-widest text-gold/70">
                            {TIER_LABELS[q.tier]}
                          </span>
                        )}
                      </span>
                      {q.follow_up && !filled && (
                        <span className="mt-1 block text-xl text-white/45">↳ {q.follow_up}</span>
                      )}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Hypothesis and guardrails */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-1 border-t border-white/10 px-6 py-3 text-base text-white/50">
        {view.deal?.hypothesis && (
          <span>
            <span className="font-semibold uppercase tracking-widest text-gold/80 text-xs mr-2">Hypothesis</span>
            {view.deal.hypothesis}
          </span>
        )}
        <span className="ml-auto">{bank.guardrails.join(" · ")}</span>
      </div>
    </div>
  );
}

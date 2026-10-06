"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import type { DiscoveryView } from "@/server/repos/discovery";
import { TIER_LABELS, fieldFilled, groupByStage } from "./shared";

// Call mode reads like notes, not a script: one narrow column under the webcam, scrolled
// slowly with the mouse wheel, fading out below the top third so your eyes stay near the camera.

// Minute each block should end by, from the playbook's 30-minute call card.
const STAGE_ENDS_BY: Record<string, number> = {
  Trigger: 3,
  Profit: 8,
  Possibility: 13,
  Pain: 23,
  Proof: 25,
  Playback: 30,
  "Next step": 30,
};

const POLL_MS = 5000;
const WHEEL_SPEED = [0.15, 0.25, 0.4, 0.6]; // fraction of native wheel distance
const EASE = 0.1; // share of the remaining distance covered each frame

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
  const stages = useMemo(() => groupByStage(bank.questions), [bank.questions]);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [speedIndex, setSpeedIndex] = useState(1);

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

  // ─── Slow, eased scrolling ────────────────────────────────────────────────
  const scroller = useRef<HTMLDivElement>(null);
  const target = useRef(0);
  const frame = useRef<number | null>(null);
  const speed = useRef(WHEEL_SPEED[speedIndex]);
  speed.current = WHEEL_SPEED[speedIndex];

  const animate = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const remaining = target.current - el.scrollTop;
    if (Math.abs(remaining) < 0.5) {
      el.scrollTop = target.current;
      frame.current = null;
      return;
    }
    el.scrollTop += remaining * EASE;
    frame.current = requestAnimationFrame(animate);
  }, []);

  const scrollTo = useCallback(
    (top: number) => {
      const el = scroller.current;
      if (!el) return;
      target.current = Math.max(0, Math.min(el.scrollHeight - el.clientHeight, top));
      if (frame.current == null) frame.current = requestAnimationFrame(animate);
    },
    [animate]
  );

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    target.current = el.scrollTop;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? el!.clientHeight : 1;
      const base = frame.current == null ? el!.scrollTop : target.current;
      scrollTo(base + e.deltaY * unit * speed.current);
    }
    // Scrollbar drags and touch scrolling: follow them instead of fighting them.
    function onScroll() {
      if (frame.current == null) target.current = el!.scrollTop;
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", onScroll);
      if (frame.current != null) cancelAnimationFrame(frame.current);
    };
  }, [scrollTo]);

  const stageRefs = useRef<Record<string, HTMLElement | null>>({});
  const jumpToStage = useCallback(
    (i: number) => {
      const stage = stages[i];
      const node = stage && stageRefs.current[stage.stage];
      if (node) scrollTo(node.offsetTop - 24);
    },
    [scrollTo, stages]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") scrollTo(target.current + 60);
      else if (e.key === "ArrowUp") scrollTo(target.current - 60);
      else if (e.key === "-") setSpeedIndex((i) => Math.max(0, i - 1));
      else if (e.key === "=" || e.key === "+") setSpeedIndex((i) => Math.min(WHEEL_SPEED.length - 1, i + 1));
      else if (/^[1-9]$/.test(e.key)) jumpToStage(Number(e.key) - 1);
      else return;
      e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jumpToStage, onClose, scrollTo]);

  // ─── Progress ─────────────────────────────────────────────────────────────
  const mustDone = (questions: typeof bank.questions) => {
    const must = questions.filter((q) => q.tier === "must");
    const done = must.filter((q) => q.fields.every((f) => fieldFilled(view, f)));
    return { done: done.length, total: must.length };
  };
  const overall = mustDone(bank.questions);
  const elapsed = Math.floor((now - startedAt) / 1000);

  // Fade lines below the top of the window so the eye stays near the camera.
  const fade =
    "linear-gradient(to bottom, transparent 0, black 2.5rem, black 38%, rgba(0,0,0,0.25) 70%, transparent 92%)";

  return (
    <div className="fixed inset-0 z-50 bg-navy text-white" role="dialog" aria-label="Call mode">
      {/* Corner marks: quiet enough to ignore */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-4 py-3 text-xs text-white/30">
        <span className="tabular-nums">
          {companyName} · Must {overall.done}/{overall.total}
        </span>
        <span className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={() => setStartedAt(Date.now())}
            title="Reset the call clock"
            className="font-mono tabular-nums hover:text-white/70"
          >
            {formatClock(elapsed)}
          </button>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white/10 hover:text-white/70" aria-label="Exit call mode">
            <X className="h-4 w-4" />
          </button>
        </span>
      </div>

      <div
        ref={scroller}
        className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <div className="mx-auto max-w-xl px-6 pt-10 pb-[80vh]">
          {view.deal?.hypothesis && (
            <p className="mb-8 text-lg leading-snug text-white/45">{view.deal.hypothesis}</p>
          )}
          {bank.frame && (
            <section className="mb-12">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gold/70">Frame</h2>
              <p className="text-2xl leading-snug text-white/80">{bank.frame}</p>
            </section>
          )}

          {stages.map(({ stage, questions }) => {
            const { done, total } = mustDone(questions);
            const endsBy = STAGE_ENDS_BY[stage];
            const behind = endsBy != null && elapsed > endsBy * 60 && done < total;
            return (
              <section key={stage} ref={(n) => { stageRefs.current[stage] = n; }} className="mb-12">
                <h2 className="mb-4 flex items-baseline gap-3 text-xs font-semibold uppercase tracking-widest text-gold/70">
                  {stage}
                  {total > 0 && <span className="tabular-nums text-white/30">{done}/{total}</span>}
                  {endsBy != null && (
                    <span className={`font-normal normal-case tracking-normal ${behind ? "text-amber-400/80" : "text-white/25"}`}>
                      by {endsBy}:00
                    </span>
                  )}
                </h2>
                <ul className="space-y-5">
                  {questions.map((q) => {
                    const filled = q.fields.every((f) => fieldFilled(view, f));
                    const wasAsked = asked.has(q.question_id);
                    const must = q.tier === "must";
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
                          className="flex w-full items-start gap-4 text-left"
                        >
                          <span
                            className={`mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              filled
                                ? "border-gold bg-gold text-navy"
                                : wasAsked
                                  ? "border-white/50"
                                  : must
                                    ? "border-white/20"
                                    : "border-dashed border-white/15"
                            }`}
                          >
                            {filled && <Check className="h-4 w-4" strokeWidth={3} />}
                          </span>
                          <span className="min-w-0">
                            <span
                              className={`block text-2xl leading-snug ${
                                filled ? "text-white/30" : must ? "text-white/90" : "text-white/50"
                              }`}
                            >
                              {q.cue}
                              {!must && (
                                <span className="ml-2 align-middle text-[11px] font-semibold uppercase tracking-widest text-gold/50">
                                  {TIER_LABELS[q.tier]}
                                </span>
                              )}
                            </span>
                            {q.follow_up && !filled && (
                              <span className="mt-1 block text-base leading-snug text-white/40">↳ {q.follow_up}</span>
                            )}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}

          <p className="text-sm leading-relaxed text-white/30">{bank.guardrails.join(" · ")}</p>
          <p className="mt-6 text-xs text-white/20">
            Scroll slowly with the wheel · − / + scroll speed · 1–8 jump to a stage · Esc to exit
          </p>
        </div>
      </div>
    </div>
  );
}

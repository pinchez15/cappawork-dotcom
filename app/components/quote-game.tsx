"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Play, RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  AI_STEPS,
  REDESIGNED,
  TODAY,
  schedule,
  type Schedule,
  type Segment,
} from "@/lib/quote-process"
import { FadeInUp } from "./motion-wrapper"
import { OrbStation } from "./glyphs"
import { ComputerWorkTerm } from "./work-term"

/** The timeline runs to the end of the third working week. */
const SCALE = 16
const WEEK = 5
const DAY_SECONDS = 0.9

const ALL_ON = AI_STEPS.map(() => true)

const COMPUTER_WORK = [
  "Status updates",
  "Formulas run",
  "Data compiled",
  "Summaries written",
  "Meetings scheduled",
  "Forms filled in",
  "Records reconciled",
  "Documents formatted",
  "Reminders sent",
]

function d1(n: number) {
  return n.toFixed(1)
}

export default function QuoteGame() {
  const [ai, setAi] = useState<boolean[]>(ALL_ON)

  const today = useMemo(() => schedule(TODAY), [])
  const redesigned = useMemo(() => schedule(REDESIGNED), [])
  const assisted = useMemo(
    () =>
      schedule(TODAY, (id) => {
        const at = AI_STEPS.findIndex((step) => step.id === id)
        return at >= 0 && ai[at] ? AI_STEPS[at].boost : 1
      }),
    [ai]
  )

  const count = ai.filter(Boolean).length

  // Desktop only. On a phone this is too much scroll.
  return (
    <section id="quote-game" className="hidden md:block py-28 bg-card-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="mb-4 flex items-center gap-3">
            <OrbStation kind="agent" label="One request for a quote" />
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold">One request for a quote</p>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] max-w-3xl text-balance">
            Why most AI pilots fail.
          </h2>
        </FadeInUp>

        <div className="mt-12">
          <Timeline
            lanes={[
              { title: "The original process", plan: today },
              { title: "The original process, with AI", plan: assisted },
            ]}
          />

          <Divider />

          {/* What AI can do when the process stays the same */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
              <h3 className="font-display text-xl sm:text-2xl tracking-tight text-navy">
                What AI can do inside the process you have
              </h3>
              <button
                type="button"
                onClick={() => setAi(AI_STEPS.map(() => count === 0))}
                className="rounded-full border border-stone-300 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-600 transition-colors hover:border-gold hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {count === 0 ? "Turn all on" : "Turn all off"}
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-2 sm:gap-3">
              {AI_STEPS.map((step, i) => (
                <button
                  key={step.id}
                  type="button"
                  aria-pressed={ai[i]}
                  aria-label={`${step.tool}, for ${step.name}, ${step.boost} times faster`}
                  onClick={() => setAi((prev) => prev.map((on, j) => (j === i ? !on : on)))}
                  className={cn(
                    "flex items-center gap-2.5 rounded-full border py-2 pl-4 pr-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-card-light",
                    ai[i]
                      ? "border-gold bg-gold/20 text-navy"
                      : "border-stone-300 text-stone-500 hover:border-stone-400 hover:text-navy"
                  )}
                >
                  {step.tool}
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] tabular-nums",
                      ai[i] ? "bg-gold text-navy" : "bg-stone-200 text-stone-500"
                    )}
                  >
                    {step.boost}×
                  </span>
                </button>
              ))}
            </div>
          </div>

          <Divider />

          {/* What the AI above is speeding up */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl tracking-tight text-navy text-balance">
              <ComputerWorkTerm tone="light" />
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {COMPUTER_WORK.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-stone-300 bg-warm-white px-3 py-1 text-xs font-medium text-stone-700"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <FadeInUp>
          <h2 className="mt-24 font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] max-w-3xl text-balance">
            Redesigned, with the waiting removed.
          </h2>
        </FadeInUp>

        <div className="mt-12">
          <Timeline
            lanes={[
              { title: "The original process", plan: today },
              { title: "The redesigned process", plan: redesigned },
            ]}
          />

          <p className="mt-8 text-[11px] text-stone-400">
            An illustrative model, not a forecast. Days are working days.
          </p>
        </div>
      </div>
    </section>
  )
}

function Divider() {
  return <div className="my-8 h-px bg-card-border" />
}

type LaneDef = { title: string; plan: Schedule }

/** Runs of the same request against one clock. */
function Timeline({ lanes }: { lanes: LaneDef[] }) {
  // Rendered complete until the clock starts, so the result reads without motion.
  const [clock, setClock] = useState(SCALE)
  const [played, setPlayed] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const play = useCallback(() => {
    cancelAnimationFrame(frame.current)
    setPlayed(true)
    setClock(0)

    let at = 0
    let last = 0
    const tick = (time: number) => {
      const seconds = last === 0 ? 0 : Math.max(0, Math.min(0.1, (time - last) / 1000))
      at += seconds / DAY_SECONDS
      last = time
      setClock(Math.min(at, SCALE))
      if (at < SCALE) frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    // With reduced motion on, nothing moves until Play is pressed.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    setClock(0)
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        play()
      },
      { threshold: 0.6 }
    )
    observer.observe(root)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame.current)
    }
  }, [play])

  return (
    <div ref={rootRef}>
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <Key className="h-[3px] w-4 rounded-full bg-stone-400" label="Waiting" />
          <Key className="h-3 w-1.5 rounded-[2px] bg-navy" label="Computer work" />
          <Key className="h-3 w-1.5 rounded-[2px] bg-gold" label="Human work" />
          <Key className="h-3 w-1.5 rounded-[2px] bg-[#D4472B]" label="Rework" />
        </div>
        <div className="flex items-center gap-4">
          <span className="tabular-nums">Day {Math.min(Math.floor(clock) + 1, SCALE)}</span>
          <button
            type="button"
            onClick={play}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-1.5 font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:bg-gold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
          >
            {played ? <RotateCcw aria-hidden className="h-3 w-3" /> : <Play aria-hidden className="h-3 w-3 fill-current" />}
            {played ? "Replay" : "Play"}
          </button>
        </div>
      </div>

      <div className="mt-7 space-y-6">
        {lanes.map((lane) => (
          <Lane key={lane.title} lane={lane} clock={clock} />
        ))}

        <div className="md:grid md:grid-cols-[14rem_1fr] md:gap-6">
          <div />
          <div className="relative h-4 text-[10px] font-medium uppercase tracking-[0.14em] text-stone-400">
            {[1, 2, 3].map((week) => (
              <span
                key={week}
                className="absolute -translate-x-full whitespace-nowrap pr-1.5"
                style={{ left: `${((week * WEEK) / SCALE) * 100}%` }}
              >
                Week {week}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function Key({ className, label }: { className: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden className={className} />
      {label}
    </span>
  )
}

function Lane({ lane, clock }: { lane: LaneDef; clock: number }) {
  const { plan, title } = lane
  const at = Math.min(clock, plan.lead)
  const done = clock >= plan.lead
  const active = plan.segments
    .filter((segment) => segment.start <= at && at < segment.end)
    .sort((a, b) => a.track - b.track)[0]
  const sameDay = plan.lead < 1
  const status = done
    ? sameDay
      ? "Quote sent the same day"
      : `Quote sent on day ${d1(plan.lead)}`
    : (active?.label ?? "")

  return (
    <div className="md:grid md:grid-cols-[14rem_1fr] md:items-center md:gap-6">
      <div>
        <p className="text-sm font-semibold leading-tight text-navy">{title}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-2 text-stone-500">
          <span className="font-display text-3xl leading-none text-navy tabular-nums">
            {d1(sameDay ? plan.lead * 8 : plan.lead)}
          </span>
          <span className="text-xs">{sameDay ? "hours to quote" : "days to quote"}</span>
        </p>
        <p className="mt-1 text-[11px] leading-snug text-stone-500 tabular-nums">
          {Math.round(plan.hours)} team hours, {Math.round(plan.humanShare * 100)}% on Human Work
        </p>
      </div>

      <div className="mt-3 md:mt-0">
        <div className="relative h-10">
          {[1, 2, 3].map((week) => (
            <span
              key={week}
              aria-hidden
              className="absolute inset-y-0 w-px bg-navy/10"
              style={{ left: `${((week * WEEK) / SCALE) * 100}%` }}
            />
          ))}
          <Bars segments={plan.segments} className="opacity-25" />
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - (at / SCALE) * 100}% 0 0)` }}
          >
            <Bars segments={plan.segments} />
          </div>
          <span
            aria-hidden
            className={cn(
              "absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-gold",
              done ? "bg-gold shadow-[0_0_14px_rgba(212,168,83,0.45)]" : "bg-card-light"
            )}
            style={{ left: `${(at / SCALE) * 100}%` }}
          />
        </div>
        <p
          aria-hidden
          className={cn("mt-1.5 h-4 truncate text-[11px]", done ? "font-semibold text-navy" : "text-stone-500")}
        >
          {status}
        </p>
      </div>
    </div>
  )
}

const BAR_STYLE = {
  wait: "bg-stone-400",
  computer: "bg-navy",
  human: "bg-gold",
  rework: "bg-[#D4472B]",
}

/** One run drawn to scale. Side-by-side work splits the lane into tracks. */
function Bars({ segments, className }: { segments: Segment[]; className?: string }) {
  return (
    <div aria-hidden className={cn("absolute inset-0", className)}>
      {segments.map((segment, i) => (
        <span
          key={i}
          className="absolute flex items-center"
          style={{
            left: `${(segment.start / SCALE) * 100}%`,
            width: `${((segment.end - segment.start) / SCALE) * 100}%`,
            top: `${(segment.track / segment.of) * 100}%`,
            height: `${100 / segment.of}%`,
          }}
        >
          <span
            className={cn(
              "w-full shrink-0",
              BAR_STYLE[segment.kind],
              segment.idle
                ? cn("h-[3px] rounded-full", segment.kind === "rework" && "opacity-60")
                : "h-[calc(100%-2px)] min-w-[2px] rounded-[2px]"
            )}
          />
        </span>
      ))}
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"
import { FadeInUp } from "./motion-wrapper"
import { ComputerWorkTerm, HumanWorkTerm } from "./work-term"
import { GlyphPath, OrbStation } from "./glyphs"

type WorkKind = {
  name: string
  label: string
  pills: string[]
  line: string
  examples: string[]
  tone: "dark" | "light"
  orbs: ("agent" | "human")[]
}

const workKinds: WorkKind[] = [
  {
    name: "Groundwork",
    label: "AI runs it",
    pills: ["Speed", "Scale", "Capability"],
    line: "Rules-based work no licensed person should be doing by hand.",
    examples: [
      "Eligibility checks and prior auth packets",
      "Regulatory binders and start-up documents kept current",
      "Enrollment, referral, and refill data reconciled overnight",
    ],
    tone: "dark",
    orbs: ["agent"],
  },
  {
    name: "Teamwork",
    label: "People and AI together",
    pills: ["Draft", "Check", "Decide"],
    line: "AI drafts and checks. A qualified person decides and signs.",
    examples: [
      "Draft 0 protocols, reports, and medical content",
      "Pre-MLR checks against approved claims",
      "Site feasibility and enrollment forecasts",
    ],
    tone: "dark",
    orbs: ["agent", "human"],
  },
  {
    name: "Lifework",
    label: "Never AI",
    pills: ["Truth", "Joy", "Relationships"],
    line: "The work only your people can do.",
    examples: [
      "The consent conversation and the hard news",
      "A clinician’s judgment at the bedside",
      "The sponsor and investigator relationships that win the next study",
    ],
    tone: "light",
    orbs: ["human"],
  },
]

function WorkKindCard({ kind }: { kind: WorkKind }) {
  const dark = kind.tone === "dark"
  return (
    <div
      className={cn(
        "h-full rounded-2xl p-5 sm:p-7",
        dark ? "border border-white/10 bg-card-dark" : "border border-gold/40 bg-warm-white"
      )}
    >
      <div className="flex items-center gap-1.5 mb-4">
        {kind.orbs.map((orb) => (
          <OrbStation key={orb} kind={orb} label={orb === "agent" ? "AI" : "People"} />
        ))}
      </div>
      <p className={cn("font-display text-2xl sm:text-[1.65rem] tracking-tight", dark ? "text-white" : "text-navy")}>
        {kind.name}
      </p>
      <p
        className={cn(
          "mt-1 text-xs font-semibold tracking-[0.16em] uppercase",
          dark ? "text-white/50" : "text-gold"
        )}
      >
        {kind.label}
      </p>
      <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
        {kind.pills.map((pill) => (
          <span
            key={pill}
            className={cn(
              "text-[11px] sm:text-xs font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full",
              dark
                ? "border border-stone-500/40 text-stone-400 bg-stone-500/10"
                : "border border-gold/40 text-gold bg-gold/10"
            )}
          >
            {pill}
          </span>
        ))}
      </div>
      <p className={cn("mt-5 text-sm leading-relaxed", dark ? "text-white/60" : "text-stone-500")}>
        {kind.line}
      </p>
      <ul className="mt-4 space-y-2">
        {kind.examples.map((item) => (
          <li
            key={item}
            className={cn(
              "flex items-start gap-2.5 text-sm sm:text-[0.95rem] leading-relaxed",
              dark ? "text-white/75" : "text-stone-600"
            )}
          >
            <span
              className={cn(
                "mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full",
                dark ? "bg-stone-500" : "bg-gold"
              )}
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="py-16 sm:py-20 lg:py-24 bg-navy">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gold block mb-5 sm:mb-8">
            The Belief
          </span>
          <h2 className="font-display text-[1.65rem] sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-white leading-[1.15] sm:leading-tight max-w-4xl text-balance">
            Let computers do the <ComputerWorkTerm />, so care teams can do the{" "}
            <HumanWorkTerm />.
          </h2>
          <p className="mt-6 sm:mt-8 max-w-3xl text-base sm:text-lg text-white/70 leading-relaxed">
            AI is for speed, scale, and capability. It is never for truth, joy, or relationships. In
            healthcare that line runs through the exam room: the clinician and the patient stay human,
            and everything that keeps them apart is fair game.
          </p>
        </FadeInUp>

        <div className="relative mt-10 sm:mt-14 mb-10 sm:mb-12">
          <GlyphPath
            d="M300 6 V26 M300 26 C300 48 110 58 100 70 M300 26 V70 M300 26 C300 48 490 58 500 70"
            viewBox="0 0 600 76"
            className="mx-auto mb-4 hidden h-14 w-full max-w-3xl md:block"
          />
          <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
            {workKinds.map((kind) => (
              <FadeInUp key={kind.name} className="h-full">
                <WorkKindCard kind={kind} />
              </FadeInUp>
            ))}
          </div>
        </div>

        <FadeInUp>
          <p className="font-display text-xl sm:text-2xl text-white/90 leading-snug max-w-3xl text-balance">
            AI never sits between a clinician and a patient. It clears the paperwork that keeps them apart.
          </p>
        </FadeInUp>
      </div>
    </section>
  )
}

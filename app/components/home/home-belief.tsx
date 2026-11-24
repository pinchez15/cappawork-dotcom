import { Reveal } from "./reveal"

const kinds = [
  {
    name: "Groundwork",
    label: "AI runs it",
    line: "Rules-based work no licensed person should be doing by hand.",
    examples: [
      "Eligibility checks and prior auth packets",
      "Regulatory binders and start-up documents kept current",
      "EDC and safety database records reconciled overnight",
    ],
  },
  {
    name: "Teamwork",
    label: "AI drafts, a person decides",
    line: "AI drafts and checks. A qualified person decides and signs.",
    examples: [
      "SAE case narratives drafted for medical review",
      "Site queries prepared for sponsor sign-off",
      "Site feasibility packets and start-up tracking",
    ],
  },
  {
    name: "Lifework",
    label: "Never AI",
    line: "The work only your people can do.",
    examples: [
      "The consent conversation and the hard news",
      "A clinician’s judgment at the bedside",
      "Reportability decisions and the sponsor relationships that win the next study",
    ],
  },
]

export default function HomeBelief() {
  return (
    <section id="philosophy" className="bg-navy py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal as="h2" className="max-w-5xl font-display text-[2.25rem] leading-[1.1] tracking-[-0.015em] text-white sm:text-5xl lg:text-[3.5rem]">
          We make work more human.
        </Reveal>

        <Reveal index={1} className="mt-8 max-w-2xl">
          <p className="font-display text-2xl leading-snug text-white sm:text-[1.75rem]">
            Let computers do the <em className="text-gold">groundwork</em>, so care teams can do the{" "}
            <em className="text-gold">lifework</em>.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            AI is for speed, scale, and capability. It is never for truth, joy, or relationships. In
            healthcare that line runs through the exam room: the clinician and the patient stay
            human, and everything that keeps them apart is fair game.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 sm:mt-24 md:grid-cols-3 md:gap-10">
          {kinds.map((kind, i) => (
            <Reveal key={kind.name} index={i} className="border-t border-white/15 pt-6">
              <h3
                className={`font-display text-[2rem] leading-none ${
                  kind.name === "Lifework" ? "text-gold" : "text-white"
                }`}
              >
                {kind.name}
              </h3>
              <p className="mt-3 text-[13px] font-medium uppercase tracking-[0.1em] text-white/50">
                {kind.label}
              </p>
              <p className="mt-5 leading-relaxed text-white/80">{kind.line}</p>
              <ul className="mt-5 space-y-2.5 text-[15px] leading-relaxed text-white/55">
                {kind.examples.map((ex) => (
                  <li key={ex}>{ex}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

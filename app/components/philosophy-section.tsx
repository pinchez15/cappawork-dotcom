"use client"

import { FadeInUp } from "./motion-wrapper"
import {
  ComputerWorkTerm,
  HumanWorkTerm,
  WorkTermCard,
} from "./work-term"

const computerWorkExamples = [
  "Copying data between systems",
  "Chasing status and rebuilding reports",
  "Routing work that should run overnight",
]

const humanWorkExamples = [
  "Truth with clients when judgment matters",
  "Relationships that win the next deal",
  "Leadership your team trusts",
]

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="py-16 sm:py-20 lg:py-24 bg-navy">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gold block mb-5 sm:mb-8">
            The Belief
          </span>
          <h2 className="font-display text-[1.65rem] sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-white leading-[1.15] sm:leading-tight mb-6 sm:mb-8 text-balance">
            Let computers do the <ComputerWorkTerm />, so humans can do the{" "}
            <HumanWorkTerm />.
          </h2>
          <p className="text-white/60 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl leading-relaxed">
            AI should not replace your team&rsquo;s judgment. It should clear the path for it.
          </p>
        </FadeInUp>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 mb-10 sm:mb-12">
          <FadeInUp>
            <WorkTermCard
              term="computer"
              variant="computer"
              pillars={["Speed", "Scale", "Capability"]}
              tagline="What software does best."
              examples={computerWorkExamples}
            />
          </FadeInUp>

          <FadeInUp>
            <WorkTermCard
              term="human"
              variant="human"
              pillars={["Joy", "Truth", "Relationships"]}
              tagline="What only your people can do."
              examples={humanWorkExamples}
            />
          </FadeInUp>
        </div>

        <FadeInUp>
          <p className="font-display text-lg sm:text-xl text-white/90 leading-snug max-w-2xl text-balance">
            Most software records work. Great software removes it.
          </p>
        </FadeInUp>
      </div>
    </section>
  )
}

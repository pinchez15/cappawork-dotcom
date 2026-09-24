"use client"

import { FadeInUp } from "./motion-wrapper"
import { GlyphPath, OrbStation } from "./glyphs"
import { ComputerWorkTerm, HumanWorkTerm } from "./work-term"

export default function TransformSection() {
  return (
    <section id="transform" className="py-20 sm:py-28 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeInUp>
          <div className="relative mb-6 flex justify-center">
            <GlyphPath
              d="M8 12 H392"
              viewBox="0 0 400 24"
              className="absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2"
            />
            <OrbStation kind="agent" label="How the work runs" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-navy leading-[1.05] text-balance">
            We don&rsquo;t just automate tasks. We change how the work runs.
          </h2>
          <p className="mt-8 text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            A single automation that answers an email is not a transformation. We architect the workflow from intake through the decision, and we use an agent when that is the right instrument. The result is an operation where people do{" "}
            <HumanWorkTerm tone="light" className="text-base sm:text-lg" /> and software does the{" "}
            <ComputerWorkTerm tone="light" className="text-base sm:text-lg" />.
          </p>
        </FadeInUp>
      </div>
    </section>
  )
}

"use client"

import { FadeInUp } from "./motion-wrapper"
import { OrbStation } from "./glyphs"

const useAgent = [
  "The steps are known.",
  "People are the copy between systems.",
  "A miss can be caught.",
]

const keepHuman = [
  "A customer will feel the judgment.",
  "The relationship is the product.",
  "Someone stands behind the decision.",
]

export default function AiJudgmentSection() {
  return (
    <section id="judgment" className="py-20 sm:py-28 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold mb-4">
            Where an agent belongs
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-white leading-[1.05] max-w-3xl text-balance">
            We use agents when the work calls for them.
          </h2>
        </FadeInUp>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-3 text-sm font-semibold tracking-[0.16em] uppercase text-white">
              <OrbStation kind="agent" label="Use an agent" />
              Use an agent
            </h3>
            <ul className="mt-6 space-y-4">
              {useAgent.map((item) => (
                <li key={item} className="border-t border-white/10 pt-4 text-white/75 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="flex items-center gap-3 text-sm font-semibold tracking-[0.16em] uppercase text-gold">
              <OrbStation kind="human" label="Keep it human" />
              Keep it human
            </h3>
            <ul className="mt-6 space-y-4">
              {keepHuman.map((item) => (
                <li key={item} className="border-t border-white/10 pt-4 text-white/75 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

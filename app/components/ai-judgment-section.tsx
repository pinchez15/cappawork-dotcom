"use client"

import { FadeInUp } from "./motion-wrapper"
import { OrbStation } from "./glyphs"

const useAgent = [
  "The steps are written down: a protocol, a payer rule, an SOP.",
  "Licensed staff are re-keying between the EHR, the portal, and the spreadsheet.",
  "A miss is caught by a person before it reaches a patient.",
]

const keepHuman = [
  "A patient will feel it: consent, a diagnosis, hard news.",
  "The relationship is the care: clinician, investigator, sponsor.",
  "A licensed person signs their name to the decision.",
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
            Agents in the workflow. Never in the exam room.
          </h2>
        </FadeInUp>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="flex items-center gap-3 text-sm font-semibold tracking-[0.16em] uppercase text-white">
              <OrbStation kind="agent" label="Use an agent" />
              Use an agent when
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
              Keep it human when
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

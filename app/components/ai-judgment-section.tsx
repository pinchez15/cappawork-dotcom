"use client"

import { FadeInUp } from "./motion-wrapper"

const useAgent = [
  "The steps are known, and the same work happens every day.",
  "People are copying information between systems that should already talk.",
  "A miss can be reviewed before it leaves the company.",
]

const keepHuman = [
  "The moment needs judgment a customer will feel.",
  "The relationship is the thing they are paying for.",
  "Someone has to stand behind the truth of the decision.",
]

export default function AiJudgmentSection() {
  return (
    <section id="judgment" className="py-20 sm:py-28 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#7AA2FF] mb-4">
            Where an agent belongs
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-white leading-[1.05] max-w-3xl text-balance">
            We use agents when the work calls for them.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-white/60 max-w-2xl leading-relaxed">
            The engagement is a change in how work gets done. An agent is one of the tools. It is not the default, and it is not a person we staff into your org chart.
          </p>
        </FadeInUp>

        <div className="mt-14 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold tracking-[0.16em] uppercase text-white">Use an agent</h3>
            <ul className="mt-6 space-y-4">
              {useAgent.map((item) => (
                <li key={item} className="border-t border-white/10 pt-4 text-white/75 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-[0.16em] uppercase text-[#7AA2FF]">Keep it human</h3>
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

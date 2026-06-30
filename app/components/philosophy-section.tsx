"use client"

import { FadeInUp } from "./motion-wrapper"

const humanWork = [
  "Judgment calls with clients",
  "Relationships that win the next deal",
  "Operational decisions only your team can make",
  "Service that requires empathy",
  "Leadership that cannot be automated",
]

const computerWork = [
  "Copying data between systems that do not talk",
  "Chasing status updates",
  "Drafting, routing, and summarizing by hand",
  "Rebuilding the same reports every week",
  "Asking the same person where everything lives",
]

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="py-24 bg-navy">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            The Belief
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight mb-8">
            Let computers do the computer work, so humans can do the human work.
          </h2>
          <p className="text-white/70 leading-relaxed text-lg mb-2 max-w-3xl">
            Most founder-led businesses are full of capable people feeding disconnected tools. AI should not replace their judgment.
          </p>
          <p className="text-white/50 text-base mb-12 max-w-3xl">
            It should remove the repetitive work crowding it out.
          </p>
        </FadeInUp>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <FadeInUp>
            <div className="h-full rounded-2xl border border-white/10 bg-card-dark p-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-4">
                Computer work
              </p>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                Repetitive work that drains your best people.
              </p>
              <ul className="space-y-3">
                {computerWork.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/70 leading-relaxed">
                    <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-stone-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInUp>

          <FadeInUp>
            <div className="h-full rounded-2xl border border-gold/30 bg-warm-white p-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-4">
                Human work
              </p>
              <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                The work your customers actually pay for.
              </p>
              <ul className="space-y-3">
                {humanWork.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-stone-600 leading-relaxed">
                    <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInUp>
        </div>

        <FadeInUp>
          <p className="font-display text-xl sm:text-2xl text-white/90 leading-snug max-w-3xl">
            Most software records work. Great software removes it.
          </p>
          <p className="text-white/45 text-sm mt-4 max-w-2xl">
            Every business has computer work hiding inside human jobs. We help you find it.
          </p>
        </FadeInUp>
      </div>
    </section>
  )
}

"use client"

import { FadeInUp } from "./motion-wrapper"

const costs = [
  "$30K–$50K in subscriptions that almost work",
  "Hundreds of hours of copying and chasing",
  "Growth capped by processes that live in one person’s head",
  "A business worth less than it should be — because a buyer can see the duct tape too",
]

export default function StakesSection() {
  return (
    <section id="stakes" className="py-24 bg-warm-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            The Stakes
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy leading-tight mb-10">
            What the workaround costs you.
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg mb-8">
            Every year on the current path:
          </p>
          <ul className="space-y-4">
            {costs.map((cost) => (
              <li key={cost} className="flex items-start gap-4">
                <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gold" />
                <span className="text-stone-600 leading-relaxed text-lg">{cost}</span>
              </li>
            ))}
          </ul>
        </FadeInUp>
      </div>
    </section>
  )
}

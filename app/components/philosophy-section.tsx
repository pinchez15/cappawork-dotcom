"use client"

import { FadeInUp } from "./motion-wrapper"

const humanWork = [
  "Judgment calls with a client who's on the fence",
  "Relationship-building that wins the next deal",
  "Operational decisions only your team can make",
  "Customer service that requires empathy, not templates",
]

const computerWork = [
  "Copying data between systems that don't talk",
  "Chasing status updates that should live on a screen",
  "Drafting, routing, and summarizing at machine speed",
  "Following up on the busywork that eats the week",
]

export default function PhilosophySection() {
  return (
    <section id="philosophy" className="py-24 bg-warm-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            The Belief
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy leading-tight mb-8">
            Let computers do the computer work, so humans can do the human work.
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg mb-12 max-w-3xl">
            We modernize founder-led organizations with AI so daily work shifts toward judgment, relationships, and service.
          </p>
          <p className="text-stone-500 text-sm mb-12 max-w-3xl">
            Less copying. More of the work that matters.
          </p>
        </FadeInUp>

        <div className="grid md:grid-cols-2 gap-6">
          <FadeInUp>
            <div className="h-full rounded-2xl border border-card-border bg-card-light p-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-4">
                Computer work
              </p>
              <p className="text-stone-500 text-sm mb-6 leading-relaxed">
                Repetitive work that drains your best people.
              </p>
              <ul className="space-y-3">
                {computerWork.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-stone-600 leading-relaxed">
                    <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-stone-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInUp>

          <FadeInUp>
            <div className="h-full rounded-2xl border border-gold/30 bg-navy p-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-4">
                Human work
              </p>
              <p className="text-white/50 text-sm mb-6 leading-relaxed">
                What your business is built on. What AI should protect.
              </p>
              <ul className="space-y-3">
                {humanWork.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/80 leading-relaxed">
                    <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  )
}

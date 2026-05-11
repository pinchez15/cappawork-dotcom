"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const systemAdvantages = [
  {
    title: "Built around your workflow",
    text: "Your process becomes the product, not a workaround.",
  },
  {
    title: "Agents inside the system",
    text: "Research, draft, route, summarize, and follow up where work already happens.",
  },
  {
    title: "People doing human work",
    text: "Less copying, chasing, and updating. More judgment, service, and sales.",
  },
]

export default function SoftwareWeBuild() {
  return (
    <section id="software-we-build" className="py-24 bg-card-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Custom Systems + Agents
          </span>
          <div className="max-w-5xl">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-6">
              Replace the software that almost works.
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-10">
              Most $5M-$50M businesses are paying $30K-$50K a year for software that still needs spreadsheets, manual handoffs, and workarounds. CappaWork builds the system around how your business actually runs, then builds the agents that work inside it.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-4 md:grid-cols-3">
          {systemAdvantages.map((advantage) => (
            <StaggerItem key={advantage.title}>
              <div className="h-full rounded-2xl border border-stone-200 bg-warm-white p-6 shadow-sm">
                <h3 className="font-display text-xl text-navy mb-3">
                  {advantage.title}
                </h3>
                <p className="leading-relaxed text-stone-600">
                  {advantage.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp delay={0.2}>
          <div className="mt-8 rounded-2xl border border-gold/30 bg-warm-white p-6">
            <p className="text-lg font-medium leading-relaxed text-navy">
              The target: replace two or three high-cost subscriptions, remove the busywork around them, and create 10x value over two years.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

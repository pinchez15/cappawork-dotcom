"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const pillars = [
  {
    title: "We come to you.",
    body: "We watch how work gets done before we design anything.",
  },
  {
    title: "Same person, start to finish.",
    body: "The one who maps your operations builds the software.",
  },
  {
    title: "AI where work already happens.",
    body: "Drafting, routing, and follow-up live inside your workflow.",
  },
  {
    title: "You own it.",
    body: "Full IP transfer. We stay available to keep it running.",
  },
]

export default function SoftwareWeBuild() {
  return (
    <section id="how-we-work" className="py-16 sm:py-20 lg:py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gold block mb-3 sm:mb-4">
            Your Guide
          </span>
          <div className="max-w-2xl mb-10 sm:mb-14">
            <h2 className="font-display text-[1.65rem] sm:text-3xl md:text-4xl tracking-tight text-navy leading-[1.15] sm:leading-tight mb-4 text-balance">
              The person who maps the work builds the system.
            </h2>
            <p className="text-base text-stone-500">
              No handoffs. No decks. Just someone inside your business who ships.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <div className="h-full rounded-2xl border border-card-border bg-card-light p-5 sm:p-6">
                <h3 className="font-display text-lg sm:text-xl text-navy mb-2">
                  {pillar.title}
                </h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {pillar.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

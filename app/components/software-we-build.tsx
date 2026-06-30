"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const pillars = [
  {
    title: "We come to you.",
    body: "We join your team and watch how work actually gets done before we design anything.",
    note: "The best systems come from doing the job.",
  },
  {
    title: "Strategy and shipping, same person.",
    body: "The person who maps your operations builds the software, from diagnosis through launch.",
    note: "No handoffs. No deck-and-disappear.",
  },
  {
    title: "AI where the work already happens.",
    body: "We build automation into your systems so drafting, routing, and follow-up happen where your team already works.",
    note: "Your people stay in the loop for what matters.",
  },
  {
    title: "You own it. We keep it running.",
    body: "Production software, trained users, and full IP transfer, with CappaWork hosting and maintaining what we ship.",
    note: "The system keeps improving instead of rotting.",
  },
]

export default function SoftwareWeBuild() {
  return (
    <section id="how-we-work" className="py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Why CappaWork
          </span>
          <div className="max-w-3xl mb-16">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-6">
              An embed partner who ships.
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed">
              Fortune 500s pay $300K a year for embedded engineers; we bring that model to founder-led companies.
            </p>
            <p className="text-base text-stone-500 mt-2">
              Operations fluency. Production AI systems. Adoption that sticks.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <div className="h-full rounded-2xl border border-card-border bg-card-light p-6">
                <h3 className="font-display text-xl text-navy mb-3">
                  {pillar.title}
                </h3>
                <p className="leading-relaxed text-stone-600 mb-2">
                  {pillar.body}
                </p>
                <p className="text-sm text-stone-500">
                  {pillar.note}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

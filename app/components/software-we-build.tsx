"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const pillars = [
  {
    title: "We come to you.",
    body: "We watch how work actually gets done before designing anything.",
    note: "The best systems come from doing the job.",
  },
  {
    title: "Strategy and shipping, same person.",
    body: "The person who maps your operations builds the software from diagnosis through launch.",
    note: "No handoff from strategist to developer.",
  },
  {
    title: "AI where the work already happens.",
    body: "We build AI into your existing workflows so drafting, routing, follow-up, and summaries happen inside the system.",
    note: "Your people stay in the loop for what matters.",
  },
  {
    title: "You own it. We keep it running.",
    body: "Production software, trained users, full IP transfer, with CappaWork available to maintain and improve what we ship.",
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
              The person who maps the work builds the system.
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-2">
              No handoff from strategist to designer to developer. We come inside the business, understand how work actually happens, and ship software that fits the way your team operates.
            </p>
            <p className="text-base text-stone-500">
              Every founder has a spreadsheet that&rsquo;s secretly running the company.
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

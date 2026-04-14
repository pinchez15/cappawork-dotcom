"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const timeline = [
  {
    phase: "Month 1",
    title: "Diagnose",
    description:
      "We audit your workflows, map where AI can move the needle, and build a prioritized roadmap. You get a clear plan — what to build, in what order, and why.",
  },
  {
    phase: "Months 2\u20135",
    title: "Build and ship",
    description:
      "One AI initiative per month. Custom builds, workflow automation, process redesign — whatever the diagnosis says matters most. Working software, not presentations.",
  },
  {
    phase: "Throughout",
    title: "Coach and train",
    description:
      "Ongoing coaching for you on AI decisions. Team training woven into each build so your people learn by doing.",
  },
  {
    phase: "Month 6",
    title: "Handoff",
    description:
      "Final builds ship, documentation complete, team trained. You own everything. Optional retainer available for ongoing support.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white leading-tight mb-16">
            Six months. Strategy through execution.
          </h2>
        </FadeInUp>

        <StaggerContainer className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-12">
            {timeline.map((item) => (
              <StaggerItem key={item.phase}>
                <div className="relative pl-12 md:pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-2 md:left-4 top-1 w-4 h-4 rounded-full bg-gold border-2 border-navy" />

                  <p className="text-sm font-semibold tracking-widest uppercase text-gold mb-2">
                    {item.phase}
                  </p>
                  <h3 className="font-display text-2xl text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>
      </div>
    </section>
  )
}

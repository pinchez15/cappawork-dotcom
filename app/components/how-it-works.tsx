"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const timeline = [
  {
    phase: "Month 1",
    title: "Find the money",
    description:
      "Full profit diagnostic. I audit your workflows, map where margin is leaking, and identify the highest-leverage AI opportunities. You get a written diagnosis with exactly what to build, in what order, and the expected P&L impact. This isn't a strategy deck — it's a build plan with dollar signs on it.",
  },
  {
    phase: "Months 2–5",
    title: "Build and ship",
    description:
      "One initiative per month. Custom AI products, workflow automation, process redesign — whatever the diagnosis says will move the most profit. Each build ships to production. Working software, not presentations.",
  },
  {
    phase: "Throughout",
    title: "Coach and train",
    description:
      "Ongoing coaching for you on AI decisions — what to invest in, what to skip, how to evaluate what your competitors are doing. Team training woven into each build cycle so your people learn by doing, not by sitting through lectures.",
  },
  {
    phase: "Month 6",
    title: "Transition and handoff",
    description:
      "Final builds ship, documentation complete, team trained. I hand you the keys. Optional $1K/month maintenance retainer available if you want ongoing support, but you won't need me to keep the lights on.",
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
            Six months. Start to finish.
          </h2>
        </FadeInUp>

        <StaggerContainer className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-12">
            {timeline.map((item, i) => (
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

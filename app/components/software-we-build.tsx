"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const pillars = [
  {
    title: "We come to you.",
    text: "We join your team for a week. If you shovel dirt, we shovel dirt. We ride along to job sites, help your customers, and watch the work get done — because the best tools come from doing the job, not hearing about it in a kickoff call.",
  },
  {
    title: "Tool agnostic, never opinion agnostic.",
    text: "We’re not married to any vendor or stack. We are opinionated about what works: different jobs deserve different models, and we’ll build with whatever serves your business best — then tell you why.",
  },
  {
    title: "We keep no secrets from you.",
    text: "Consulting and operating backgrounds mean we see more than the software. If we spot an opportunity outside scope, we call it out. Clients have told us the conversations alone were worth the fee.",
  },
  {
    title: "We’re in it for the long haul.",
    text: "We build, test, and deploy. You own it. We host and maintain it — so the system keeps getting better instead of quietly rotting.",
  },
]

export default function SoftwareWeBuild() {
  return (
    <section id="how-we-work" className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            How We Work
          </span>
          <div className="max-w-3xl mb-16">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white leading-tight mb-6">
              Forward-deployed engineering, for Main Street.
            </h2>
            <p className="text-lg text-white/70 leading-relaxed">
              The big AI labs figured out that great software gets built by engineers who embed inside the customer&rsquo;s business &mdash; they call it forward-deployed engineering. Fortune 500s pay $300K a year per engineer for it. CappaWork brings the same model to the businesses that actually keep the country running &mdash; embed, work alongside the team, map the real process, build, stabilize, then build the next thing &mdash; for $90K, outcome included.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <div className="h-full rounded-2xl border border-white/10 bg-card-dark p-6">
                <h3 className="font-display text-xl text-white mb-3">
                  {pillar.title}
                </h3>
                <p className="leading-relaxed text-white/70">
                  {pillar.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

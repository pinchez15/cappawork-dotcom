"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"
import { GlyphKey, OrbStation } from "./process-orb"

const steps = [
  {
    range: "Days 1–30",
    title: "Embed and freeze the plan.",
    body: "A week working inside the business, then the modernization strategy: ROI, success metrics, board-deck ready — delivered inside your 100-day reporting window. The founder's-head process, mapped — not how the CIM said it worked.",
  },
  {
    range: "Days 30–100",
    title: "Ship the change while change is expected.",
    body: "Core system live by day 100. Tribal knowledge becomes software. Duct tape becomes an operating platform.",
  },
  {
    range: "Days 100–180",
    title: "Refreeze around the new system.",
    body: "Harden against the edge cases, train the team, stabilize. Key-person risk becomes owned IP — an asset at exit instead of a diligence finding.",
  },
]

export default function PathwayAcquirers() {
  const { open } = useInquiry()

  return (
    <section id="acquirers" className="py-24 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <OrbStation kind="agent" label="First 100 days" />
            <span className="text-sm font-semibold tracking-widest uppercase text-gold">
              Pathway: Acquirers
            </span>
          </div>
          <GlyphKey className="mb-8" />
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy leading-tight mb-6">
            Just bought a business? The first 100 days decide the next five years.
          </h2>
          <div className="space-y-5 text-stone-600 leading-relaxed text-lg mb-8">
            <p>
              You acquired a company that runs on the founder&rsquo;s memory and a stack of duct-taped tools. The value-creation plan is on the clock, and the systems can&rsquo;t carry it.
            </p>
            <p>
              Here&rsquo;s what most buyers miss: the acquisition itself is the unfreeze. Day one post-close, everything is fluid &mdash; habits are loose, the team expects change. That window decays fast. By day 90, the old workarounds have refrozen under new ownership. The decisive work has to happen while the organization still expects change.
            </p>
          </div>

          <p className="text-navy font-medium text-lg mb-10">
            The work is mapped to the reporting window. Scope is set on a discovery call.
          </p>
        </FadeInUp>

        <StaggerContainer className="space-y-8 mb-12">
          {steps.map((step) => (
            <StaggerItem key={step.range}>
              <div className="flex gap-6">
                <div className="flex-shrink-0 pt-1">
                  <OrbStation kind="agent" label={step.title} />
                </div>
                <div className="flex-shrink-0 pt-1">
                  <span className="inline-block bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                    {step.range}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-navy mb-2">{step.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{step.body}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp>
          <p className="text-stone-600 leading-relaxed text-lg mb-10">
            By day 100, the core system is live. By day 180, it&rsquo;s yours.
          </p>
          <div className="mb-4">
            <OrbStation kind="human" label="Discovery call" />
          </div>
          <button
            onClick={() => open()}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Talk About Your Acquisition
            <ArrowRight size={18} />
          </button>
        </FadeInUp>
      </div>
    </section>
  )
}

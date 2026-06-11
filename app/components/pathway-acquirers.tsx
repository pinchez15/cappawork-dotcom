"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

const steps = [
  {
    number: "1",
    title: "Embed (weeks 1–4):",
    body: "Map how the business actually operates — not how the CIM said it did. Your investors get a modernization strategy with ROI and success metrics they can put in a board deck.",
  },
  {
    number: "2",
    title: "Build (months 2–6):",
    body: "The founder's tribal knowledge becomes software. The duct tape becomes an operating platform. Key-person risk becomes owned IP.",
  },
  {
    number: "3",
    title: "Own:",
    body: "Clean handoff, trained team, maintained system — an asset at exit instead of a diligence finding.",
  },
]

export default function PathwayAcquirers() {
  const { open } = useInquiry()

  return (
    <section id="acquirers" className="py-24 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            Pathway: Acquirers
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy leading-tight mb-6">
            Just bought a business? The first 100 days decide the next five years.
          </h2>
          <p className="text-stone-600 leading-relaxed text-lg mb-10">
            You acquired a company that runs on the founder&rsquo;s memory and a stack of duct-taped tools. The value-creation plan is on the clock, and the systems can&rsquo;t carry it.
          </p>

          <div className="rounded-2xl border border-gold/30 bg-card-light p-6 mb-10">
            <p className="text-navy font-semibold text-lg">
              The First 100 Days Build &mdash; $15K/month, six months
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="space-y-8 mb-12">
          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                  <span className="text-navy font-semibold text-sm">{step.number}</span>
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

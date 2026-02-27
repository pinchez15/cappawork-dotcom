"use client"

import { Check, ArrowRight } from "lucide-react"
import { FadeInUp } from "./motion-wrapper"

export default function EngagementSection() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="engagement" className="py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="max-w-3xl mb-16">
            <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
              How We Work
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy leading-tight">
              Two phases. Clarity first, then implementation.
            </h2>
          </div>
        </FadeInUp>

        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Phase 1 */}
          <FadeInUp delay={0.1}>
            <div className="flex flex-col p-8 sm:p-10 rounded-2xl border-2 border-gold bg-white shadow-xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">
                Start Here
              </div>
              <span className="text-sm font-semibold tracking-widest uppercase text-gold mb-2">
                Phase 1
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-navy mb-2">
                AI & Operations Diagnostic
              </h3>
              <div className="text-4xl font-semibold tracking-tight text-navy mb-1">
                $30,000
              </div>
              <p className="text-sm text-stone-500 mb-6">4–6 weeks</p>

              <div className="text-stone-600 leading-relaxed space-y-4 mb-6">
                <p>
                  Before rebuilding anything, we quantify where profit is leaking — and where AI and automation will create the highest leverage.
                </p>
                <p className="font-medium text-navy">Over 4–6 weeks, we:</p>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  "Map end-to-end workflows against actual cost",
                  "Identify repetitive tasks ripe for AI automation",
                  "Analyze revenue and margin by segment",
                  "Model revenue per employee and scale economics toward $10M",
                  "Quantify specific automation opportunities with dollar impact",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-stone-700">
                    <Check size={16} className="text-gold flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="text-stone-600 leading-relaxed space-y-4 mb-8">
                <p>
                  <span className="font-medium text-navy">Deliverable:</span> A prioritized roadmap identifying material margin leverage — with specific dollar impact tied to each opportunity.
                </p>
                <p>
                  This engagement stands alone. You can execute internally, work with us, or choose another partner. Our job is clarity before capital allocation.
                </p>
              </div>

              <button
                onClick={handleBookCall}
                className="w-full bg-gold text-navy py-3 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Book Diagnostic Call
                <ArrowRight size={16} />
              </button>
            </div>
          </FadeInUp>

          {/* Phase 2 */}
          <FadeInUp delay={0.2}>
            <div className="flex flex-col p-8 sm:p-10 rounded-2xl border border-card-border bg-card-light">
              <span className="text-sm font-semibold tracking-widest uppercase text-stone-500 mb-2">
                Phase 2
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-navy mb-2">
                AI Implementation
              </h3>
              <div className="text-4xl font-semibold tracking-tight text-navy mb-1">
                $50,000+
              </div>
              <p className="text-sm text-stone-500 mb-6">Scoped by Phase 1 findings</p>

              <div className="text-stone-600 leading-relaxed space-y-4 mb-6">
                <p>
                  Once the highest-ROI constraint is identified, we remove it.
                </p>
                <p>
                  We do not rebuild everything. We implement the smallest system required to permanently increase profit per employee.
                </p>
                <p className="font-medium text-navy">That may involve:</p>
              </div>

              <ul className="space-y-3 mb-6">
                {[
                  "AI-assisted workflows that eliminate repetitive labor",
                  "Custom internal platforms designed around your actual workflow",
                  "Automation layers that increase throughput without headcount",
                  "Tool consolidation that reduces software sprawl",
                  "Reporting infrastructure that replaces guesswork with visibility",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-stone-700">
                    <Check size={16} className="text-gold flex-shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="text-stone-600 leading-relaxed space-y-4 mb-8">
                <p>
                  Modern AI-assisted development allows us to deploy production-grade systems in weeks, not quarters — dramatically accelerating time to ROI.
                </p>
                <p className="font-medium text-navy">
                  We are tool-agnostic. The only metric that matters: does this increase profitability at scale?
                </p>
              </div>

              <button
                onClick={handleBookCall}
                className="w-full bg-gold text-navy py-3 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Book Diagnostic Call
                <ArrowRight size={16} />
              </button>
            </div>
          </FadeInUp>

        </div>
      </div>
    </section>
  )
}

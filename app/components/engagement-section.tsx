"use client"

import { Check, ArrowRight } from "lucide-react"

export default function EngagementSection() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="engagement" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-start">

          {/* Phase 1 */}
          <div className="flex flex-col p-8 sm:p-10 rounded-2xl border-2 border-blue-500 bg-white shadow-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">
              Start Here
            </div>
            <span className="text-sm font-semibold tracking-wide uppercase text-blue-600 mb-2">
              Phase 1
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 mb-2">
              Scale & Margin Diagnostic
            </h3>
            <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-1">
              $30,000
            </div>
            <p className="text-sm text-stone-500 mb-6">4–6 weeks</p>

            <div className="text-stone-600 leading-relaxed space-y-4 mb-6">
              <p>
                Before rebuilding anything, we quantify where profit is leaking — and where automation will create the highest leverage.
              </p>
              <p className="font-medium text-stone-900">Over 4–6 weeks, we:</p>
            </div>

            <ul className="space-y-3 mb-6">
              {[
                "Map end-to-end workflows against actual cost",
                "Analyze revenue and margin by segment",
                "Model revenue per employee and scale economics toward $10M",
                "Identify operational bottlenecks and software stack ROI",
                "Quantify specific automation opportunities with dollar impact",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-stone-700">
                  <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="text-stone-600 leading-relaxed space-y-4 mb-8">
              <p>
                <span className="font-medium text-stone-900">Deliverable:</span> A prioritized roadmap identifying material margin leverage — with specific dollar impact tied to each opportunity.
              </p>
              <p>
                This engagement stands alone. You can execute internally, work with us, or choose another partner. Our job is clarity before capital allocation.
              </p>
              <p className="text-stone-500 italic">
                If we don't identify meaningful margin leverage, we'll tell you — and advise against unnecessary implementation.
              </p>
            </div>

            <button
              onClick={handleBookCall}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Book Diagnostic Call
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Phase 2 */}
          <div className="flex flex-col p-8 sm:p-10 rounded-2xl border border-stone-200 bg-stone-50">
            <span className="text-sm font-semibold tracking-wide uppercase text-stone-500 mb-2">
              Phase 2
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 mb-2">
              Constraint Implementation
            </h3>
            <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-1">
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
              <p className="font-medium text-stone-900">That may involve:</p>
            </div>

            <ul className="space-y-3 mb-6">
              {[
                "Custom internal platforms designed around your actual workflow",
                "Automation layers that eliminate repetitive labor",
                "AI-assisted workflows that increase throughput without headcount",
                "Tool consolidation that reduces software sprawl",
                "Reporting infrastructure that replaces guesswork with visibility",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-stone-700">
                  <Check size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="text-stone-600 leading-relaxed space-y-4 mb-8">
              <p>
                Modern AI-assisted development allows us to deploy production-grade systems in weeks, not quarters — dramatically accelerating time to ROI.
              </p>
              <p className="font-medium text-stone-900">
                We are tool-agnostic. The only metric that matters: does this increase profitability at scale?
              </p>
            </div>

            <button
              onClick={handleBookCall}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Book Diagnostic Call
              <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </section>
  )
}

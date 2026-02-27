"use client"

import { useState } from "react"
import { Check, ArrowRight, Shield, ChevronDown, ChevronUp } from "lucide-react"

export default function EngagementSection() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"
  const [expandedPhase, setExpandedPhase] = useState<string | null>(null)

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  const toggleDetails = (phase: string) => {
    setExpandedPhase(expandedPhase === phase ? null : phase)
  }

  return (
    <section id="engagement" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
            How We Work Together
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Two phases. Clear deliverables. No surprises.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Phase 1: Operational Intelligence */}
          <div className="flex flex-col">
            <div className="flex flex-col p-8 rounded-2xl border-2 border-blue-500 bg-white shadow-xl transition-all duration-300 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">
                Start Here
              </div>
              <div className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">
                Phase 1: Operational Intelligence
              </div>
              <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-1">
                $30,000
              </div>
              <p className="text-sm text-stone-500 mb-4">6 weeks</p>
              <p className="text-lg font-medium text-stone-900 mb-3">
                We diagnose your operations, build a live dashboard, and hand you a prioritized
                automation playbook.
              </p>

              {/* Guarantee */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  If we don't find at least $50K in recoverable inefficiency, we refund the
                  engagement.
                </p>
              </div>

              <button
                onClick={handleBookCall}
                className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Book a Discovery Call
                <ArrowRight size={16} />
              </button>
            </div>

            {/* What's Included Dropdown */}
            <div className="mt-4 border border-stone-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleDetails("phase1")}
                className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <span className="font-medium text-stone-900 text-sm">What's Included</span>
                {expandedPhase === "phase1" ? (
                  <ChevronUp className="w-5 h-5 text-stone-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-500" />
                )}
              </button>
              {expandedPhase === "phase1" && (
                <div className="p-5 bg-white border-t border-stone-200">
                  <h4 className="font-medium text-stone-900 mb-3 text-sm">Deliverables</h4>
                  <ul className="space-y-2 mb-5">
                    {[
                      "Full workflow mapping across your core operations",
                      "Data audit and system inventory",
                      "Bottleneck and inefficiency report",
                      "Live operational dashboard",
                      "Prioritized automation roadmap",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-stone-700">
                        <Check size={14} className="text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-stone-50 rounded-lg p-4">
                    <p className="text-sm text-stone-600">
                      <span className="font-medium text-stone-900">You walk away with:</span> A live
                      dashboard and a prioritized automation playbook — whether or not you continue
                      to Phase 2.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Phase 2: Custom Automation Build */}
          <div className="flex flex-col">
            <div className="flex flex-col p-8 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wide">
                Phase 2: Custom Automation Build
              </div>
              <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-1">
                $50,000+
              </div>
              <p className="text-sm text-stone-500 mb-4">8–12 weeks</p>
              <p className="text-lg font-medium text-stone-900 mb-3">
                We build the automations and integrations identified in Phase 1 — and train your
                team to own them.
              </p>
              <p className="text-stone-600 text-sm mb-4">
                For businesses that completed Phase 1 and are ready to act on the roadmap.
              </p>

              <button
                onClick={handleBookCall}
                className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Book a Discovery Call
                <ArrowRight size={16} />
              </button>
            </div>

            {/* What's Included Dropdown */}
            <div className="mt-4 border border-stone-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleDetails("phase2")}
                className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <span className="font-medium text-stone-900 text-sm">What's Included</span>
                {expandedPhase === "phase2" ? (
                  <ChevronUp className="w-5 h-5 text-stone-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-stone-500" />
                )}
              </button>
              {expandedPhase === "phase2" && (
                <div className="p-5 bg-white border-t border-stone-200">
                  <h4 className="font-medium text-stone-900 mb-3 text-sm">Deliverables</h4>
                  <ul className="space-y-2 mb-5">
                    {[
                      "Custom workflow automations",
                      "System integrations across your tools",
                      "Team training and documentation",
                      "30 days post-launch support",
                      "Ongoing optimization recommendations",
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-stone-700">
                        <Check size={14} className="text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="bg-stone-50 rounded-lg p-4">
                    <p className="text-sm text-stone-600">
                      <span className="font-medium text-stone-900">Pricing note:</span> Final scope
                      and pricing are based on the automation roadmap from Phase 1. Every dollar is
                      tied to a specific, measurable outcome.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

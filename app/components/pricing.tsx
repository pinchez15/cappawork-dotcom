"use client"

import { useState } from "react"
import { Check, ArrowRight, ExternalLink, Shield, ChevronDown, ChevronUp } from "lucide-react"

export default function Services() {
  const calendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"
  const [expandedTier, setExpandedTier] = useState<string | null>(null)

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  const toggleDetails = (tier: string) => {
    setExpandedTier(expandedTier === tier ? null : tier)
  }

  return (
    <section id="pricing" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
            Choose Your Path
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            From clarity to launch — pick the level of support you need.
          </p>
        </div>

        {/* Pricing Cards - Equal Height */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Tier 1: Strategic Blueprint */}
          <div className="group flex flex-col p-8 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wide">
              Strategic Blueprint
            </div>
            <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-4">
              $5,000
            </div>
            <p className="text-lg font-medium text-stone-900 mb-3">
              Find out if your idea is worth $500K — before you spend $50K building the wrong thing.
            </p>
            <p className="text-stone-600 text-sm mb-6 flex-grow">
              Not a PDF. A live web app you can share with investors, partners, and advisors.
            </p>
            <div className="text-sm text-stone-500 mb-4">
              <span className="font-medium">Timeline:</span> 2 weeks
            </div>
            <button
              onClick={handleBookCall}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Book Call
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Tier 2: Full Product Build */}
          <div className="group flex flex-col p-8 rounded-2xl border-2 border-blue-500 bg-white shadow-xl transition-all duration-300 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <div className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">
              Full Product Build
            </div>
            <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-1">
              $22,000
            </div>
            <p className="text-sm text-stone-500 mb-4">Includes Blueprint</p>
            <p className="text-lg font-medium text-stone-900 mb-3">
              From idea to paying customers in 8 weeks.
            </p>
            <p className="text-stone-600 text-sm mb-6 flex-grow">
              Everything in the Blueprint, plus a production-ready product your customers can pay for.
            </p>
            <div className="text-sm text-stone-500 mb-4">
              <span className="font-medium">Timeline:</span> 8 weeks
            </div>
            <button
              onClick={handleBookCall}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Book Call
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Tier 3: Legacy Rebuild */}
          <div className="group flex flex-col p-8 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-xl transition-all duration-300">
            <div className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wide">
              Legacy Rebuild
            </div>
            <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-4">
              $30,000+
            </div>
            <p className="text-lg font-medium text-stone-900 mb-3">
              Modernize your existing product without losing a single customer.
            </p>
            <p className="text-stone-600 text-sm mb-6 flex-grow">
              Already have a product running on outdated tech? I'll rebuild it on modern infrastructure with zero-downtime migration.
            </p>
            <div className="text-sm text-stone-500 mb-4">
              <span className="font-medium">Timeline:</span> 10-12 weeks
            </div>
            <button
              onClick={handleBookCall}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Get a Quote
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-12 flex items-start gap-4">
          <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 mb-1">Milestone-Based Guarantees</h3>
            <p className="text-stone-600 text-sm">
              <span className="font-medium">Blueprint:</span> If it doesn't give you clarity on whether to build, I'll refund 50%. {" "}
              <span className="font-medium">Full Build & Legacy:</span> If I miss any milestone by more than 7 days, your next payment drops 20%.
            </p>
          </div>
        </div>

        {/* Expandable Details Section */}
        <div className="space-y-4">
          {/* Strategic Blueprint Details */}
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleDetails('blueprint')}
              className="w-full flex items-center justify-between p-5 bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              <span className="font-medium text-stone-900">Strategic Blueprint — What's Included</span>
              {expandedTier === 'blueprint' ? (
                <ChevronUp className="w-5 h-5 text-stone-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-500" />
              )}
            </button>
            {expandedTier === 'blueprint' && (
              <div className="p-6 bg-white border-t border-stone-200">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-stone-900 mb-4">Deliverables</h4>
                    <ul className="space-y-3">
                      {[
                        "Market & competitive analysis",
                        "Interactive financial model",
                        "Product roadmap & feature priorities",
                        "Go-to-market strategy",
                        "Technical architecture spec"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-stone-700">
                          <Check size={16} className="text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-4">Payment Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="text-stone-600">Kickoff</span>
                        <span className="font-medium text-stone-900">$2,500</span>
                      </div>
                      <div className="flex justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="text-stone-600">On delivery</span>
                        <span className="font-medium text-stone-900">$2,500</span>
                      </div>
                    </div>
                    <a
                      href="https://reconstructing-wealth.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      See an example Blueprint <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Full Product Build Details */}
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleDetails('fullbuild')}
              className="w-full flex items-center justify-between p-5 bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              <span className="font-medium text-stone-900">Full Product Build — What's Included</span>
              {expandedTier === 'fullbuild' ? (
                <ChevronUp className="w-5 h-5 text-stone-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-500" />
              )}
            </button>
            {expandedTier === 'fullbuild' && (
              <div className="p-6 bg-white border-t border-stone-200">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-stone-900 mb-4">Strategy (Weeks 1-2)</h4>
                    <ul className="space-y-3 mb-6">
                      {[
                        "Everything in Strategic Blueprint",
                        "User research synthesis",
                        "Detailed feature specifications"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-stone-700">
                          <Check size={16} className="text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <h4 className="font-medium text-stone-900 mb-4">Build (Weeks 3-8)</h4>
                    <ul className="space-y-3">
                      {[
                        "Full-stack development",
                        "Stripe billing integration",
                        "Auth & user management",
                        "Production deployment",
                        "Documentation & handoff"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-stone-700">
                          <Check size={16} className="text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-4">Milestone Payments</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="text-stone-600">Kickoff: Blueprint + architecture</span>
                        <span className="font-medium text-stone-900">$5,000</span>
                      </div>
                      <div className="flex justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="text-stone-600">Week 3: Working prototype</span>
                        <span className="font-medium text-stone-900">$6,000</span>
                      </div>
                      <div className="flex justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="text-stone-600">Week 5: Feature-complete + billing</span>
                        <span className="font-medium text-stone-900">$6,000</span>
                      </div>
                      <div className="flex justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="text-stone-600">Launch: Deployed + documented</span>
                        <span className="font-medium text-stone-900">$5,000</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Legacy Rebuild Details */}
          <div className="border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleDetails('legacy')}
              className="w-full flex items-center justify-between p-5 bg-stone-50 hover:bg-stone-100 transition-colors"
            >
              <span className="font-medium text-stone-900">Legacy Rebuild — What's Included</span>
              {expandedTier === 'legacy' ? (
                <ChevronUp className="w-5 h-5 text-stone-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-stone-500" />
              )}
            </button>
            {expandedTier === 'legacy' && (
              <div className="p-6 bg-white border-t border-stone-200">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-stone-900 mb-4">Deliverables</h4>
                    <ul className="space-y-3">
                      {[
                        "Strangler fig migration strategy",
                        "Modern UI/UX redesign",
                        "Scalable architecture on Next.js + Supabase",
                        "Zero-downtime migration",
                        "Full documentation & handoff",
                        "30 days post-launch support"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-3 text-sm text-stone-700">
                          <Check size={16} className="text-green-500 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-stone-900 mb-4">Milestone Payments</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="text-stone-600">Kickoff: Audit + architecture</span>
                        <span className="font-medium text-stone-900">20%</span>
                      </div>
                      <div className="flex justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="text-stone-600">Week 4: Migration plan approved</span>
                        <span className="font-medium text-stone-900">20%</span>
                      </div>
                      <div className="flex justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="text-stone-600">Week 7: Core features rebuilt</span>
                        <span className="font-medium text-stone-900">30%</span>
                      </div>
                      <div className="flex justify-between p-3 bg-stone-50 rounded-lg">
                        <span className="text-stone-600">Launch: Full migration complete</span>
                        <span className="font-medium text-stone-900">30%</span>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-stone-500">
                      Final price depends on codebase complexity. Book a call for a custom quote.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { Check, ArrowRight, ExternalLink } from "lucide-react"

export default function Services() {
  const calendlyLink = process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
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

        <div className="grid md:grid-cols-3 gap-8">
          {/* Tier 1: Strategic Blueprint */}
          <div className="group flex flex-col p-8 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="mb-6">
              <div className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wide">
                Strategic Blueprint
              </div>
              <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-4">
                $5,000
              </div>
              <p className="text-lg font-medium text-stone-900 mb-2">
                Find out if your idea is worth $500K — before you spend $50K building the wrong thing.
              </p>
              <p className="text-stone-600 leading-relaxed text-sm">
                Not a PDF. A live web app you can share with investors, partners, and advisors.
              </p>
            </div>

            <div className="flex-grow mb-6">
              <ul className="space-y-3">
                {[
                  "Market & competitive analysis",
                  "Interactive financial model",
                  "Product roadmap & feature priorities",
                  "Go-to-market strategy",
                  "Technical architecture spec"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-stone-700">
                    <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-stone-700" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-6 p-4 bg-stone-100 rounded-xl border border-stone-200">
              <div className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-2">Timeline & Payment</div>
              <p className="text-sm text-stone-700 mb-2">2 weeks delivery</p>
              <p className="text-sm text-stone-600">$2,500 upfront, $2,500 on delivery</p>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Guarantee:</span> If the Blueprint doesn't give you clarity on whether to build, I'll refund 50%.
              </p>
            </div>

            <a
              href="https://reconstructing-wealth.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 justify-center"
            >
              See an example Blueprint <ExternalLink size={14} />
            </a>

            <button
              onClick={handleBookCall}
              className="w-full bg-blue-600 text-white py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Book Call
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Tier 2: Full Product Build */}
          <div className="group flex flex-col p-8 rounded-2xl border-2 border-blue-500 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wide">
              Most Popular
            </div>
            <div className="mb-6">
              <div className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wide">
                Full Product Build
              </div>
              <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-1">
                $22,000
              </div>
              <p className="text-sm text-stone-500 mb-4">Includes Blueprint</p>
              <p className="text-lg font-medium text-stone-900 mb-2">
                From idea to paying customers in 8 weeks.
              </p>
              <p className="text-stone-600 leading-relaxed text-sm">
                Everything in the Blueprint, plus a production-ready product your customers can pay for.
              </p>
            </div>

            <div className="flex-grow mb-6">
              <div className="mb-4">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Strategy (Weeks 1-2)</div>
                <ul className="space-y-2">
                  {[
                    "Everything in Strategic Blueprint",
                    "User research synthesis",
                    "Detailed feature specifications"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-stone-700">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-blue-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-3">Build (Weeks 3-8)</div>
                <ul className="space-y-2">
                  {[
                    "Full-stack development",
                    "Stripe billing integration",
                    "Auth & user management",
                    "Production deployment",
                    "Documentation & handoff"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-stone-700">
                      <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Check size={12} className="text-blue-600" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mb-6 p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-3">Milestone Payments</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-600">Kickoff: Blueprint + architecture</span>
                  <span className="font-medium text-stone-900">$5,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Week 3: Working prototype</span>
                  <span className="font-medium text-stone-900">$6,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Week 5: Feature-complete + billing</span>
                  <span className="font-medium text-stone-900">$6,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Launch: Deployed + documented</span>
                  <span className="font-medium text-stone-900">$5,000</span>
                </div>
              </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Guarantee:</span> If I miss any milestone by more than 7 days, your next payment drops 20%.
              </p>
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
          <div className="group flex flex-col p-8 rounded-2xl border border-stone-200 bg-stone-50 hover:bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="mb-6">
              <div className="text-sm font-semibold text-stone-500 mb-2 uppercase tracking-wide">
                Legacy Rebuild
              </div>
              <div className="text-4xl font-semibold tracking-tight text-stone-900 mb-4">
                Get a Quote
              </div>
              <p className="text-lg font-medium text-stone-900 mb-2">
                Modernize your existing product without losing a single customer.
              </p>
              <p className="text-stone-600 leading-relaxed text-sm">
                Already have a product running on outdated tech? I'll rebuild it on modern infrastructure with zero-downtime migration.
              </p>
            </div>

            <div className="flex-grow mb-8">
              <ul className="space-y-3">
                {[
                  "Strangler fig migration strategy",
                  "Modern UI/UX redesign",
                  "Scalable architecture",
                  "Full documentation & handoff"
                ].map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-sm text-stone-700">
                    <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-stone-700" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
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
      </div>
    </section>
  )
}

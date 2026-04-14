"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

export default function OfferCard() {
  const { open } = useInquiry()

  return (
    <section id="offer" className="py-24 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            How We Work Together
          </span>

          {/* Single dominant card */}
          <div className="bg-navy text-white rounded-2xl p-8 sm:p-12 lg:p-16">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white mb-8">
              Your fractional AI lead.
            </h2>

            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl">
              We embed alongside your leadership team to set your AI strategy and execute it. Strategy and build, together &mdash; so the roadmap doesn&apos;t end up in a drawer.
            </p>

            <div className="mb-10">
              <p className="text-sm font-semibold tracking-widest uppercase text-gold mb-4">
                What a month looks like
              </p>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1.5 text-xs">&bull;</span>
                  AI strategy session with leadership
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1.5 text-xs">&bull;</span>
                  Workflow audit and opportunity identification
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1.5 text-xs">&bull;</span>
                  One production AI build shipped
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1.5 text-xs">&bull;</span>
                  Team training on what we built
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1.5 text-xs">&bull;</span>
                  Executive coaching on AI decisions
                </li>
              </ul>
            </div>

            <p className="text-white/60 text-sm mb-10">
              When we&apos;re done, you keep everything &mdash; the products, the playbooks, and a team that knows what to do with them.
            </p>

            <button
              onClick={() => open()}
              className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
            >
              Get in Touch
              <ArrowRight size={18} />
            </button>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

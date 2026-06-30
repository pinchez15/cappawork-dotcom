"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

export default function ClosingCTA() {
  const { open } = useInquiry()

  return (
    <section id="cta" className="py-24 bg-card-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeInUp>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy mb-6 leading-tight">
            Bring us your messiest workflow.
          </h2>
          <p className="text-lg text-stone-600 mb-10 leading-relaxed">
            In one free Computer Work Audit, we will map where computer work is crowding out human work and tell you whether Discover, Build, or Modernize is the right next step.
          </p>
          <button
            onClick={() => open()}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Book a Free Computer Work Audit
            <ArrowRight size={18} />
          </button>
          <p className="text-sm text-stone-500 mt-8">
            No deck. No generic AI talk. Bring the real workflow.
          </p>
        </FadeInUp>
      </div>
    </section>
  )
}

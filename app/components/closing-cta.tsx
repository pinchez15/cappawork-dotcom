"use client"

import { FadeInUp } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"
import { ArrowRight } from "lucide-react"

export default function ClosingCTA() {
  const { open } = useInquiry()

  return (
    <section id="cta" className="py-16 sm:py-20 lg:py-24 bg-card-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeInUp>
          <h2 className="font-display text-[1.65rem] sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-navy mb-4 sm:mb-6 leading-[1.15] sm:leading-tight text-balance">
            Bring us your messiest workflow.
          </h2>
          <p className="text-base sm:text-lg text-stone-500 mb-8 sm:mb-10 max-w-md mx-auto">
            One free session. One clear next step.
          </p>
          <button
            onClick={() => open()}
            className="bg-gold text-navy w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center justify-center gap-2 text-base sm:text-lg"
          >
            Book a Free Computer Work Audit
            <ArrowRight size={18} />
          </button>
          <p className="text-xs sm:text-sm text-stone-400 mt-6 sm:mt-8">
            No deck. Bring the real workflow.
          </p>
        </FadeInUp>
      </div>
    </section>
  )
}

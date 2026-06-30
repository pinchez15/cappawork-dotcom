"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

export default function ClosingCTA() {
  const { open } = useInquiry()

  return (
    <section id="cta" className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeInUp>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-6 leading-tight">
            Start with a free working session.
          </h2>
          <p className="text-lg text-white/70 mb-4 leading-relaxed">
            Bring your messiest process and we will map where computer work is crowding out human work.
          </p>
          <p className="text-base text-white/50 mb-10">
            You will leave knowing whether Discover, Build, or Modernize fits.
          </p>
          <button
            onClick={() => open()}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Book a Free Working Session
            <ArrowRight size={18} />
          </button>
        </FadeInUp>
      </div>
    </section>
  )
}

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
            The Offer
          </span>

          {/* Single dominant card */}
          <div className="bg-navy text-white rounded-2xl p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-gold mb-4">
              Custom Software Build
            </p>
            <p className="text-white/60 text-sm mb-6">
              design &middot; build &middot; host &middot; secure &middot; maintain
            </p>

            <div className="font-display text-5xl md:text-6xl tracking-tight text-white mb-8">
              $100K<span className="text-2xl md:text-3xl text-white/60"> build target</span>
            </div>

            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl">
              One custom system built around how your business actually works, with AI agents inside it to remove repetitive work and increase team capacity.
            </p>

            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl">
              You own the IP. CappaWork hosts, secures, and maintains the software. <span className="text-white font-medium">The target is 10x value over two years.</span>
            </p>

            <button
              onClick={() => open("Custom Software Build")}
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

"use client"

import { ArrowRight } from "lucide-react"
import HeroField from "./hero-field"
import { GlyphKey, OrbStation } from "./glyphs"

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col bg-warm-white overflow-hidden pt-16">
      <HeroField />

      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-28 pb-16">
        <div className="max-w-3xl">
            <h1 className="font-display text-[2.75rem] sm:text-6xl lg:text-[4.5rem] tracking-tight text-navy leading-[0.98] text-balance">
              We make work more human.
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-stone-600">
              The embedded product team for healthcare and life sciences. We turn stuck initiatives into shipped products, so clinicians, coordinators, and care teams get their time back for patients.
            </p>
            <GlyphKey className="mt-8" />
        </div>

        <p className="mt-12 sm:mt-14 text-sm font-semibold text-navy">Stuck on an initiative?</p>
        <div className="mt-3 flex flex-col sm:flex-row gap-3">
          <a
            href="#discovery"
            className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-7 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-colors"
          >
            Book a Strategy Sprint
            <ArrowRight size={16} />
          </a>
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2 border border-navy/15 bg-warm-white/70 text-navy px-7 py-3.5 rounded-full font-medium hover:border-gold hover:text-gold transition-colors"
          >
            See the work
          </a>
        </div>

        <div className="mt-16 flex justify-center sm:mt-20">
          <OrbStation kind="agent" label="Thread resolves" />
        </div>
      </div>
    </section>
  )
}

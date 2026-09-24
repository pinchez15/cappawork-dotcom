"use client"

import { ArrowRight } from "lucide-react"
import HeroField from "./hero-field"
import { ComputerWorkTerm, HumanWorkTerm } from "./work-term"
import { GlyphKey, OrbStation } from "./process-orb"

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col bg-warm-white overflow-hidden pt-16">
      <HeroField />

      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-28 pb-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <h1 className="font-display text-[2.75rem] sm:text-6xl lg:text-[4.5rem] tracking-tight text-navy leading-[0.98] text-balance">
              We make work more human.
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-stone-600">
              AI transformations for complex organizations.
            </p>
            <GlyphKey className="mt-6" />
          </div>
          <p className="lg:col-span-5 lg:pt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-md lg:ml-auto">
            Let computers do the{" "}
            <ComputerWorkTerm tone="light" className="text-base sm:text-lg" /> so your team can do the{" "}
            <HumanWorkTerm tone="light" className="text-base sm:text-lg" />. We transform enterprises with agents — durable systems that stay on call. Not staffed seats. Not an 18-month program.
          </p>
        </div>

        <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row gap-3">
          <a
            href="#discovery"
            className="inline-flex items-center justify-center gap-2 bg-gold text-navy px-7 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-colors"
          >
            Book a Discovery Call
            <ArrowRight size={16} />
          </a>
          <a
            href="#work"
            className="inline-flex items-center justify-center gap-2 border border-navy/15 bg-warm-white/70 text-navy px-7 py-3.5 rounded-full font-medium hover:border-gold hover:text-gold transition-colors"
          >
            See the work
          </a>
        </div>

        <div className="mt-20 flex justify-center sm:mt-28">
          <OrbStation kind="agent" label="Thread resolves" />
        </div>
      </div>
    </section>
  )
}

"use client"

import { DiscoveryForm } from "./inquiry-modal"
import { GlyphPath, OrbStation } from "./glyphs"

export default function DiscoverySection() {
  return (
    <section id="discovery" className="py-20 sm:py-28 bg-navy">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/10 bg-warm-white p-7 sm:p-10">
          <GlyphPath d="M4 12 H148" viewBox="0 0 160 24" className="mb-4 h-5 w-36" />
          <div className="mb-3 flex items-center gap-3">
            <OrbStation kind="human" label="Discovery call" />
            <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gold">
              Discovery
            </p>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight">
            Book a discovery call
          </h2>
          <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">
            Tell us where the operation is slow. We will use it to route the conversation to the right working session.
          </p>
          <div className="mt-8">
            <DiscoveryForm />
          </div>
        </div>
      </div>
    </section>
  )
}

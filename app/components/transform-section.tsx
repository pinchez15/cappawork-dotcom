"use client"

import { FadeInUp } from "./motion-wrapper"
import { GlyphPath, OrbStation } from "./glyphs"

export default function TransformSection() {
  return (
    <section id="transform" className="py-20 sm:py-28 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeInUp>
          <div className="relative mb-6 flex justify-center">
            <GlyphPath
              d="M8 12 H392"
              viewBox="0 0 400 24"
              className="absolute inset-x-0 top-1/2 h-6 w-full -translate-y-1/2"
            />
            <OrbStation kind="agent" label="How the work runs" />
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-navy leading-[1.05] text-balance">
            We change how the work runs.
          </h2>
        </FadeInUp>
      </div>
    </section>
  )
}

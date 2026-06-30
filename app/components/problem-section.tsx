"use client"

import { FadeInUp } from "./motion-wrapper"

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            The Problem
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight mb-10">
            Your best people are doing computer work.
          </h2>

          <div className="space-y-6 text-white/70 leading-relaxed text-lg">
            <p>
              Off-the-shelf tools cover most of how you work; the rest lives in spreadsheets, duplicate entry, and &ldquo;just ask Sarah.&rdquo;
              <span className="block mt-2 text-white/50 text-base">Your team spends the week on busywork instead of judgment and relationships.</span>
            </p>
            <p className="text-white font-medium">
              Modernization frees your team for the human work your customers actually pay for.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

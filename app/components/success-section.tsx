"use client"

import { FadeInUp } from "./motion-wrapper"

export default function SuccessSection() {
  return (
    <section id="success" className="py-24 bg-card-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            What Changes
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy leading-tight mb-10">
            Work becomes more human.
          </h2>
          <div className="space-y-4 text-stone-600 leading-relaxed text-lg mb-10">
            <p>
              Your team stops feeding the tools and starts using judgment, with status on a screen instead of in a meeting and tribal knowledge captured in software you own.
            </p>
            <p className="text-stone-500 text-base">
              AI handles the repetitive work where it already happens.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/30 bg-warm-white p-6">
            <p className="text-lg font-medium leading-relaxed text-navy">
              Replace two or three expensive subscriptions, cut the busywork around them, and target 10x the engagement cost in value over two years.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

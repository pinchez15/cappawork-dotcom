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
            What changes when the system fits.
          </h2>
          <div className="space-y-5 text-stone-600 leading-relaxed text-lg mb-10">
            <p>
              Your team stops feeding the tools and starts using judgment. Status lives on a screen instead of in a meeting. The knowledge that lived in Sarah&rsquo;s head lives in software you own. And when you grow — or sell — the operating system comes with the business, as an asset instead of an apology.
            </p>
          </div>
          <div className="rounded-2xl border border-gold/30 bg-warm-white p-6">
            <p className="text-lg font-medium leading-relaxed text-navy">
              The target, in plain numbers: replace two or three high-cost subscriptions, remove the busywork around them, and create 10x the engagement cost in value over two years.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

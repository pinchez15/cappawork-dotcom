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
            The villain isn&rsquo;t your team. It&rsquo;s the workaround.
          </h2>

          <div className="space-y-6 text-white/70 leading-relaxed text-lg">
            <p>
              Off-the-shelf tools cover 70% of how you work. The other 30% lives in spreadsheets, duplicate entry, manual handoffs, and &ldquo;just ask Sarah.&rdquo; You pay $30K&ndash;$50K a year for software you still have to work around.
            </p>
            <p>
              You didn&rsquo;t build this company to spend your week chasing status updates and reconciling systems that don&rsquo;t talk. Somewhere along the way, the business started running you.
            </p>
            <p className="text-white font-medium">
              Software should adapt to the business — not the other way around. The businesses that keep America moving deserve systems built around how they actually work.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

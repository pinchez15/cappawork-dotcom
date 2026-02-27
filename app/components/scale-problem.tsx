"use client"

import { FadeInUp } from "./motion-wrapper"

export default function ScaleProblem() {
  return (
    <section id="problem" className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            The Problem After $3M
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight mb-8">
            You built a real business. Now it&apos;s buried.
          </h2>

          <div className="text-lg text-white/70 leading-relaxed space-y-6">
            <p>
              You crossed $3M. You hired the team. Revenue is growing. But somewhere between $3M and $10M, every dollar of growth got more expensive to produce.
            </p>
            <p>
              Your people are spending 60% of their time on tasks a machine should handle — copying data between systems, chasing approvals, building reports nobody reads, formatting the same spreadsheet for the fifth time this week.
            </p>
            <p>
              That&apos;s not a people problem. That&apos;s a systems problem. And it&apos;s costing you more than you think.
            </p>
            <p className="text-white font-medium">
              Revenue goes up. Margin doesn&apos;t follow. Your best people are stuck doing the worst work.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

"use client"

import { FadeInUp } from "./motion-wrapper"

export default function WhoThisIsFor() {
  return (
    <section className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            Who This Is For
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight mb-8">
            Founder-led service businesses doing $3M–$10M.
          </h2>

          <div className="text-lg text-white/70 leading-relaxed space-y-6 mb-16">
            <p>
              You have 5–50 employees. Revenue is growing, but margins aren&apos;t keeping pace. Your team is talented, but they&apos;re spending too much time on work that doesn&apos;t require their talent.
            </p>
            <p>
              Consulting firms, agencies, professional services, trades, staffing companies — the industry matters less than the pattern.
            </p>
            <p className="text-white font-medium">
              The pattern is: real revenue, real team, hidden inefficiency that compounds as you scale.
            </p>
          </div>

          {/* Differentiator */}
          <div className="border-t border-white/10 pt-12">
            <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-6">
              How We&apos;re Different
            </span>

            <div className="text-lg text-white/70 leading-relaxed space-y-6">
              <p>
                Most consultants deliver strategy decks. Most developers build what they&apos;re told. Most AI vendors sell chatbots.
              </p>
              <p className="text-white font-medium">
                We do the diagnosis and the implementation — same team, start to finish.
              </p>
              <p>
                Financial modeling rigor. Operational workflow mapping. AI and systems architecture. Hands-on implementation.
              </p>
              <p className="text-white font-medium">
                No handoff. No translation layer. No six-month discovery cycle.
              </p>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

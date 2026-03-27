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
            Leaders who know AI matters — and want to get it right.
          </h2>

          <div className="text-lg text-white/70 leading-relaxed space-y-6 mb-16">
            <p>
              Founders scaling service businesses. VPs of Engineering modernizing dev teams. Product leaders integrating AI into established products. Executives who need their organization AI-fluent — not just AI-curious.
            </p>
            <p>
              The industry matters less than the pattern: you have real revenue, a real team, and work that should be done by machines instead of people.
            </p>
            <p className="text-white font-medium">
              If your people are buried in busywork that a computer could handle, we can help.
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

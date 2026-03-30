"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp } from "./motion-wrapper"

export default function OfferCard() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="offer" className="py-24 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The Offer
          </span>

          {/* Single dominant card */}
          <div className="bg-navy text-white rounded-2xl p-8 sm:p-12 lg:p-16">
            <p className="text-sm font-semibold tracking-widest uppercase text-gold mb-4">
              Your AI Team
            </p>
            <p className="text-white/60 text-sm mb-6">
              audit &middot; build &middot; coach &middot; train &middot; 6 months
            </p>

            <div className="font-display text-5xl md:text-6xl tracking-tight text-white mb-8">
              $15,000<span className="text-2xl md:text-3xl text-white/60">/month</span>
            </div>

            <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-2xl">
              One engagement. Six months. I come alongside your business and operate as your AI team — finding where you&apos;re leaving money on the table, building the systems that fix it, coaching you on every decision, and training your people to own what I build.
            </p>

            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-2xl">
              When I leave, you keep everything: the products, the playbooks, and a team that knows what to do with them. <span className="text-white font-medium">$90K total. You&apos;ll make back ten times that.</span>
            </p>

            <button
              onClick={handleBookCall}
              className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
            >
              Book a Call
              <ArrowRight size={18} />
            </button>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

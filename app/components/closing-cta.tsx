"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp } from "./motion-wrapper"

export default function ClosingCTA() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <FadeInUp>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-6 leading-tight">
            Your people deserve better work. Let&apos;s build it that way.
          </h2>
          <p className="text-lg text-white/70 mb-10 leading-relaxed">
            Whether you need a single advisory hour or a full product build — it starts with a conversation. No pitch deck. Just your situation and what might help.
          </p>
          <button
            onClick={handleBookCall}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Start a Conversation
            <ArrowRight size={18} />
          </button>
        </FadeInUp>
      </div>
    </section>
  )
}

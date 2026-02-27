"use client"

import { ArrowRight } from "lucide-react"

export default function WhatsAtStake() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-24 bg-stone-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-6">
          You're going to grow.
        </h2>
        <p className="text-xl text-stone-300 mb-4 leading-relaxed">
          The question is whether your operations will keep up — or hold you back. Every month you
          wait, your team spends more hours on manual work, your data gets more fragmented, and the
          gap between where you are and where you could be gets wider.
        </p>
        <p className="text-lg text-stone-400 mb-10 leading-relaxed">
          A 30-minute call is all it takes to find out if we can help.
        </p>
        <button
          onClick={handleBookCall}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg shadow-blue-500/20"
        >
          Book a Discovery Call
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}

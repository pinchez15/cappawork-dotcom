"use client"

import { ArrowRight } from "lucide-react"

export default function ClosingCTA() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 mb-4 leading-snug">
          You didn't build a $3M+ business to stay on the treadmill.
        </p>
        <p className="text-lg text-stone-600 mb-10 leading-relaxed">
          Let's find out what your operations are really costing you — and what they could be earning instead.
        </p>
        <button
          onClick={handleBookCall}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg shadow-blue-500/20"
        >
          Book Diagnostic Call
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  )
}

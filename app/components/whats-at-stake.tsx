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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* What's At Stake */}
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-white mb-8">
          What's At Stake
        </h2>

        <p className="text-xl text-stone-300 mb-6">If nothing changes:</p>

        <ul className="space-y-4 mb-6">
          {[
            "Margin continues to compress as revenue grows",
            "Your best people burn out on manual work",
            "Hiring becomes your only growth lever",
            "Complexity compounds",
            "Competitors who automate gain structural advantage",
          ].map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-stone-300 text-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-xl font-medium text-white mb-16">
          The cost of drift compounds quietly.
        </p>

        {/* CTA */}
        <div className="border-t border-stone-700 pt-16 text-center">
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white mb-4">
            Book a Diagnostic Call
          </h3>
          <p className="text-lg text-stone-300 mb-2">
            30 minutes. Your numbers. No pitch deck.
          </p>
          <p className="text-stone-400 mb-10 max-w-xl mx-auto">
            We'll determine whether a Scale & Margin Diagnostic makes sense for your stage — or if you're not there yet.
          </p>
          <button
            onClick={handleBookCall}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 text-lg shadow-lg shadow-blue-500/20"
          >
            Book Diagnostic Call
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  )
}

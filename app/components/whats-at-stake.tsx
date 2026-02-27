"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp } from "./motion-wrapper"

export default function WhatsAtStake() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight mb-8">
            Your people are your advantage. But right now, they&apos;re buried.
          </h2>

          <div className="text-lg text-white/70 leading-relaxed space-y-6 mb-12">
            <p>
              Every hour your team spends on repetitive admin is an hour they&apos;re not spending with clients, improving your product, or solving the problems that actually grow the business.
            </p>
            <p>
              AI doesn&apos;t replace your people. It removes the work that&apos;s beneath them. The data entry. The status updates. The report formatting. The follow-up emails that could write themselves.
            </p>
            <p className="text-white font-medium">
              The companies that figure this out first will have a structural advantage that compounds every quarter.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={handleBookCall}
              className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
            >
              Book a Diagnostic Call
              <ArrowRight size={18} />
            </button>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

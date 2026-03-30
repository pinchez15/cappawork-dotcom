"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

const coachingOffers = [
  {
    id: "ai-strategy-advisor",
    name: "AI Strategy Advisor",
    subtitle: "retained · C-suite · under NDA",
    price: "$2,000/hour",
    inquiryKey: "AI Strategy Advisor",
    description:
      "A retained advisor in your corner — behind an NDA, embedded with your leadership team, looking for what you can't see. You get someone who builds AI products full-time and has spent a career in business strategy, with no incentive other than making you right. Typical engagement: 3–6 months.",
  },
  {
    id: "ai-vp-cohort",
    name: "AI VP Cohort",
    subtitle: "per person · 6 weeks · 10–15 per cohort",
    price: "$3,500",
    inquiryKey: "AI VP Cohort",
    description:
      "Six-week small-group program for leaders who don't build but need to understand what's being built. You'll learn what the models actually are, how they differ, what tools like Claude Code do, what's safe and what's not, and how to evaluate AI investments your team is making — so you stop nodding along in meetings and start making informed decisions.",
  },
]

export default function CoachingSection() {
  const { open } = useInquiry()

  return (
    <section id="coaching" className="py-24 bg-navy">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Coaching
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white leading-tight mb-4">
            Not ready for the full engagement?
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-16 max-w-3xl">
            As a leader, you need to be fluent in AI from top to bottom — so you can make great decisions quickly. I can coach you.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid md:grid-cols-2 gap-6">
          {coachingOffers.map((offer) => (
            <StaggerItem key={offer.id}>
              <button
                onClick={() => open(offer.inquiryKey)}
                className="group flex flex-col h-full w-full text-left p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-sm font-semibold tracking-widest uppercase text-gold mb-3">
                  {offer.price}
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-white mb-2">
                  {offer.name}
                </h3>
                <p className="text-sm text-white/60 mb-1">
                  {offer.subtitle}
                </p>
                <p className="mt-3 text-white/70 text-sm leading-relaxed flex-1">
                  {offer.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold group-hover:gap-3 transition-all">
                  Get in touch
                  <ArrowRight size={14} />
                </span>
              </button>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

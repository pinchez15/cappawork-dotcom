"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

const steps = [
  {
    number: "1",
    title: "Discover.",
    body: "We map where time is lost, which workflows deserve AI, and what to build vs. buy before any code gets written.",
    note: "Sprint in two weeks. Deep when the stakes are higher.",
  },
  {
    number: "2",
    title: "Build.",
    body: "We design and ship production software around how your team already works, with AI handling drafting, routing, and follow-up inside the system.",
    note: "Software you own. Users trained. Ready for the real world.",
  },
  {
    number: "3",
    title: "Modernize.",
    body: "We embed with your leadership team for six months, finding opportunities and shipping inside your environment as the business evolves.",
    note: "For transformations that outgrow a single project.",
  },
]

export default function HowItWorks() {
  const { open } = useInquiry()

  return (
    <section id="how-it-works" className="py-24 bg-navy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The Journey
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white leading-tight mb-4">
            Discover. Build. Modernize.
          </h2>
          <p className="text-lg text-white/60 leading-relaxed mb-16 max-w-2xl">
            One path to becoming AI-native, with a clear next step at every stage.
          </p>
        </FadeInUp>

        <StaggerContainer className="space-y-10 mb-16">
          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                  <span className="text-navy font-semibold text-sm">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-white mb-2">{step.title}</h3>
                  <p className="text-white/70 leading-relaxed">{step.body}</p>
                  <p className="text-white/45 text-sm mt-2">{step.note}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp>
          <button
            onClick={() => open()}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Book a Free Working Session
            <ArrowRight size={18} />
          </button>
        </FadeInUp>
      </div>
    </section>
  )
}

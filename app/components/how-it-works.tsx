"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

const steps = [
  {
    number: "1",
    title: "Embed.",
    body: "We work inside your operation for the first month — mapping how value actually moves, not how the org chart says it does. You get a build plan with ROI and success metrics in writing before anything gets built.",
  },
  {
    number: "2",
    title: "Build.",
    body: "Months two through six, working software ships in focused releases while your team uses it. Not a prototype. The production system, version one — with AI working invisibly inside it: drafting, routing, summarizing, following up where the work already happens.",
  },
  {
    number: "3",
    title: "Own.",
    body: "Your team is trained, the system is stable, and the IP is yours. CappaWork hosts, secures, and maintains it so it keeps getting better.",
  },
]

export default function HowItWorks() {
  const { open } = useInquiry()

  return (
    <section id="the-plan" className="py-24 bg-card-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The Plan
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-16">
            Three steps to a system you own.
          </h2>
        </FadeInUp>

        <StaggerContainer className="space-y-10 mb-16">
          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gold flex items-center justify-center">
                  <span className="text-navy font-semibold text-sm">{step.number}</span>
                </div>
                <div>
                  <h3 className="font-display text-xl text-navy mb-2">{step.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{step.body}</p>
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
            Book a Working Session
            <ArrowRight size={18} />
          </button>
        </FadeInUp>
      </div>
    </section>
  )
}

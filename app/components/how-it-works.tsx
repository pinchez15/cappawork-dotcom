"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

const steps = [
  {
    number: "1",
    title: "Audit",
    body: "We identify where computer work is crowding out human work.",
  },
  {
    number: "2",
    title: "Discover",
    body: "We turn the opportunity into a prioritized modernization roadmap.",
  },
  {
    number: "3",
    title: "Build",
    body: "We design and ship production software around how your team already works.",
  },
  {
    number: "4",
    title: "Modernize",
    body: "We embed inside your business to keep finding opportunities, shipping improvements, and helping adoption stick.",
  },
]

export default function HowItWorks() {
  const { open } = useInquiry()

  return (
    <section id="how-it-works" className="py-24 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The Modernization Journey
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-4">
            Audit. Roadmap. Build. Modernize.
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed mb-2 max-w-2xl">
            Most clients start with a free Computer Work Audit, then choose the right level of engagement.
          </p>
          <p className="text-base text-stone-500 mb-16 max-w-2xl">
            Modernization isn&rsquo;t adding AI. It&rsquo;s removing work.
          </p>
        </FadeInUp>

        <StaggerContainer className="space-y-8 mb-16">
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
            Book a Free Computer Work Audit
            <ArrowRight size={18} />
          </button>
        </FadeInUp>
      </div>
    </section>
  )
}

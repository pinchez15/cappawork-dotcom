"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"
import { ComputerWorkTerm, HumanWorkTerm } from "./work-term"

const steps = [
  {
    number: "0",
    title: "Audit",
    body: (
      <>
        $2,500 Computer Work Audit — credited to Transformation. Baseline hours, cycle time, and
        rework where <ComputerWorkTerm tone="light" className="text-sm sm:text-base" /> crowds out{" "}
        <HumanWorkTerm tone="light" className="text-sm sm:text-base" />.
      </>
    ),
  },
  {
    number: "1–2",
    title: "Discover",
    body: "Shadow, map, and sign a one-page scope for 2–4 workflows. Nothing built until signed.",
  },
  {
    number: "3–5",
    title: "Build",
    body: "Production in your environment. Parallel run from week 4 — live throughput, not a demo.",
  },
  {
    number: "6",
    title: "Adopt",
    body: "Cutover, train, runbook, and client-owned IP. Optional Modernize retainer after go-live.",
  },
]

export default function HowItWorks() {
  const { open } = useInquiry()

  return (
    <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gold block mb-3 sm:mb-4">
            Your Path Forward
          </span>
          <h2 className="font-display text-[1.65rem] sm:text-3xl md:text-4xl tracking-tight text-navy leading-[1.15] sm:leading-tight mb-4 sm:mb-6 text-balance">
            Audit. Discover. Build. Adopt.
          </h2>
          <p className="text-base sm:text-lg text-stone-500 mb-10 sm:mb-14 max-w-xl">
            Six weeks to production in one department — for businesses over ~$50M revenue.
          </p>
        </FadeInUp>

        <StaggerContainer className="space-y-5 sm:space-y-7 mb-10 sm:mb-14">
          {steps.map((step) => (
            <StaggerItem key={step.number}>
              <div className="flex gap-4 sm:gap-6">
                <div className="flex-shrink-0 min-w-9 h-9 sm:min-w-10 sm:h-10 px-2 rounded-full bg-gold flex items-center justify-center">
                  <span className="text-navy font-semibold text-xs sm:text-sm whitespace-nowrap">
                    {step.number}
                  </span>
                </div>
                <div className="min-w-0 pt-0.5">
                  <h3 className="font-display text-lg sm:text-xl text-navy mb-1">{step.title}</h3>
                  <p className="text-sm sm:text-base text-stone-600">{step.body}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp>
          <button
            onClick={() => open("6-Week AI Transformation")}
            className="bg-gold text-navy w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center justify-center gap-2 text-base sm:text-lg"
          >
            Start with a Computer Work Audit
            <ArrowRight size={18} />
          </button>
        </FadeInUp>
      </div>
    </section>
  )
}

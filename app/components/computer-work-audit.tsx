"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"
import { ComputerWorkTerm } from "./work-term"

const auditSignals = [
  "Spreadsheets running the business",
  "Duplicate entry between systems",
  "Status updates trapped in meetings",
  "Tribal knowledge in one person\u2019s head",
]

export default function ComputerWorkAudit() {
  const { open } = useInquiry()

  return (
    <section id="audit" className="py-16 sm:py-20 lg:py-24 bg-card-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gold block mb-3 sm:mb-4">
            Step One
          </span>
          <h2 className="font-display text-[1.65rem] sm:text-3xl md:text-4xl lg:text-5xl tracking-tight text-navy leading-[1.15] sm:leading-tight mb-4 sm:mb-6 text-balance">
            Start with a <ComputerWorkTerm tone="light" /> Audit.
          </h2>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed mb-8 sm:mb-10 max-w-2xl">
            Bring your messiest workflow. In one session, we find the{" "}
            <ComputerWorkTerm tone="light" className="text-sm sm:text-base" /> hiding inside it.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid gap-2.5 sm:gap-3 sm:grid-cols-2 mb-8 sm:mb-10">
          {auditSignals.map((item) => (
            <StaggerItem key={item}>
              <div className="rounded-xl border border-card-border bg-warm-white px-4 py-3.5 sm:px-5 sm:py-4 text-sm text-stone-600">
                {item}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp>
          <div className="rounded-2xl border border-gold/30 bg-warm-white p-5 sm:p-6 mb-8 sm:mb-10">
            <p className="text-base sm:text-lg font-medium text-navy">
              You leave knowing your next move: buy, build, automate, or modernize.
            </p>
          </div>

          <button
            onClick={() => open()}
            className="bg-gold text-navy w-full sm:w-auto px-6 sm:px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center justify-center gap-2 text-base sm:text-lg"
          >
            Book a Free Computer Work Audit
            <ArrowRight size={18} />
          </button>
        </FadeInUp>
      </div>
    </section>
  )
}

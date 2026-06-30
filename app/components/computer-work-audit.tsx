"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

const auditSignals = [
  "Duplicate entry between systems",
  "Spreadsheet workflows running the business",
  "Status updates trapped in meetings",
  "Manual follow-up and routing",
  "Tribal knowledge living in one person\u2019s head",
  "AI opportunities with clear ROI",
]

export default function ComputerWorkAudit() {
  const { open } = useInquiry()

  return (
    <section id="audit" className="py-24 bg-card-light">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Free Working Session
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy leading-tight mb-6">
            Start with a Computer Work Audit.
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed mb-2">
            Bring your messiest workflow. In one working session, we map where your team is doing computer work that software should handle.
          </p>
          <p className="text-base text-stone-500 mb-10">
            Your best people shouldn&rsquo;t spend their week doing computer work.
          </p>
        </FadeInUp>

        <FadeInUp>
          <p className="text-sm font-semibold tracking-widest uppercase text-gold mb-4">
            We look for
          </p>
        </FadeInUp>

        <StaggerContainer className="grid sm:grid-cols-2 gap-3 mb-10">
          {auditSignals.map((item) => (
            <StaggerItem key={item}>
              <div className="rounded-xl border border-card-border bg-warm-white px-5 py-4 text-stone-600 leading-relaxed">
                {item}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp>
          <div className="rounded-2xl border border-gold/30 bg-warm-white p-6 mb-10">
            <p className="text-lg font-medium text-navy leading-relaxed">
              You leave with a clear next step: buy, build, automate, or modernize.
            </p>
          </div>

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

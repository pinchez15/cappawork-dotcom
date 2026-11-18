"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { OrbStation } from "./glyphs"

const faqs = [
  {
    q: "Who do you work with?",
    a: "Healthcare and life sciences companies above about $30M in revenue: patient recruitment firms, agencies and medical communications, CROs and site networks, pharmacies, provider groups, and emerging biotech. Usually one initiative is stuck and an executive owns it.",
  },
  {
    q: "What is a sprint?",
    a: "One focused week of work with a defined output: strategy, product, UX, UI, or build. A full product is usually five or six sprints back to back.",
  },
  {
    q: "Where do most clients start?",
    a: "With a strategy sprint. In one week you get the product vision, what it is worth, and the plan for the sprints that follow.",
  },
  {
    q: "Can we keep you on retainer?",
    a: "Yes. The embedded team is $20,000 a month: SVP-level product and AI leadership that also builds, for about what one senior executive’s salary costs. We do not sell hours. AI-native work moves at a different speed, so we price on what ships. Retainer clients add sprints whenever they need a full week of focus.",
  },
  {
    q: "Do sprints happen on-site?",
    a: "They can. Some of the best work happens in a week in the room with your team.",
  },
  {
    q: "How do you handle PHI and HIPAA?",
    a: "When a build touches PHI, we work under a BAA and inside your environment. Access is scoped to the job, and every agent action is logged.",
  },
  {
    q: "Will AI talk to our patients?",
    a: "Not where truth, joy, or the relationship is the point. Consent, diagnosis, and hard news stay with your people.",
  },
  {
    q: "Will this replace our EHR or core systems?",
    a: "We build on what you already run. Replacing a legacy platform is your call, and we will model the cost either way.",
  },
  {
    q: "Who owns what you build?",
    a: "You do: all code, IP, and scaffolding.",
  },
  {
    q: "Do you work outside healthcare?",
    a: "Occasionally, when the operation looks like healthcare: regulated, document-heavy, and short on capacity.",
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 sm:py-28 bg-card-light">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-4 flex justify-center">
          <OrbStation kind="agent" label="Questions" />
        </div>
        <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] text-center">
          Frequently asked questions.
        </h2>

        <div className="mt-12 divide-y divide-card-border border-y border-card-border">
          {faqs.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-medium text-navy">{item.q}</span>
                  {isOpen ? (
                    <Minus size={18} className="mt-0.5 shrink-0 text-stone-400" />
                  ) : (
                    <Plus size={18} className="mt-0.5 shrink-0 text-stone-400" />
                  )}
                </button>
                {isOpen && (
                  <p className="pb-5 text-stone-600 leading-relaxed">{item.a}</p>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-10 text-center">
          <div className="mb-4 flex justify-center">
            <OrbStation kind="human" label="Strategy sprint" />
          </div>
          <a
            href="#discovery"
            className="inline-flex items-center bg-gold text-navy px-6 py-3 text-sm font-medium rounded-full hover:bg-gold/90 transition-colors"
          >
            Book a Strategy Sprint
          </a>
        </div>
      </div>
    </section>
  )
}

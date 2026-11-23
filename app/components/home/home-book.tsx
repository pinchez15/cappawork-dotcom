"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { DiscoveryForm } from "../inquiry-modal"
import { Reveal } from "./reveal"

const faqs = [
  {
    q: "Who do you work with?",
    a: "Healthcare and life sciences companies above about $30M in revenue: patient recruitment firms, agencies and medical communications, CROs and site networks, pharmacies, provider groups, and emerging biotech. Usually one initiative is stuck and an executive owns it.",
  },
  {
    q: "Where do most clients start?",
    a: "With a strategy sprint. In one week you get the product vision, what it is worth, and the plan for the sprints that follow.",
  },
  {
    q: "Can we keep you on retainer?",
    a: "Yes. The embedded team is $20,000 a month: SVP-level product and AI leadership that also builds. We do not sell hours. AI-native work moves at a different speed, so we price on what ships. Retainer clients add sprints whenever they need a full week of focus.",
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

function Faq() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <section id="faq" className="bg-card-light py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <Reveal as="h2" className="font-display text-[2.5rem] leading-[1.05] tracking-[-0.015em] text-navy sm:text-[3.25rem] lg:col-span-4">
          Questions, answered.
        </Reveal>
        <div className="border-b border-card-border lg:col-span-7 lg:col-start-6">
          {faqs.map((item, i) => {
            const isOpen = open === i
            const panelId = `faq-panel-${i}`
            return (
              <div key={item.q} className="border-t border-card-border">
                <button
                  type="button"
                  className="flex min-h-[64px] w-full items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="font-display text-[1.375rem] leading-snug text-navy">{item.q}</span>
                  {isOpen ? (
                    <Minus size={18} aria-hidden className="shrink-0 text-gold" />
                  ) : (
                    <Plus size={18} aria-hidden className="shrink-0 text-stone-400" />
                  )}
                </button>
                <div id={panelId} hidden={!isOpen}>
                  <p className="max-w-2xl pb-6 leading-relaxed text-stone-600">{item.a}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default function HomeBook() {
  return (
    <>
      <Faq />
      <section id="discovery" className="bg-navy py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
          <div className="lg:col-span-5">
            <Reveal as="h2" className="font-display text-[2.75rem] leading-[1.02] tracking-[-0.02em] text-white sm:text-[4rem]">
              Stuck on an initiative?
            </Reveal>
            <Reveal index={1} className="mt-6 max-w-md">
              <p className="text-lg leading-relaxed text-white/70">
                Tell us what is stuck. We will come back with how the first week would run and what
                it would produce.
              </p>
              <p className="mt-8 text-[15px] text-white/45">
                Strategy Sprint · one week · $7,500
              </p>
            </Reveal>
          </div>
          <Reveal index={2} className="lg:col-span-6 lg:col-start-7">
            <div className="rounded-2xl bg-warm-white p-6 sm:p-10">
              <DiscoveryForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

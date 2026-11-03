"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"

const faqs = [
  {
    q: "How does the build credit work?",
    a: "Send the intake form and 3 sample documents within 5 business days. Bring the decision-maker to discovery and the workflow owner to the walkthrough. Leave a short review. Sign a build within 60 days and the $1,500 comes off your invoices.",
  },
  {
    q: "What if we never build with you?",
    a: "You keep the roadmap. Any team can work from it.",
  },
  {
    q: "Do we need clean data first?",
    a: "Start with what you have. A recent quote, a drawing set and a weekly report are enough.",
  },
  {
    q: "We need an AI plan for a board or parent company. Is this fast enough?",
    a: "Yes. Discovery in week 1. Roadmap 1 to 2 weeks later.",
  },
  {
    q: "Is our information confidential?",
    a: "Yes. We will sign your NDA before discovery.",
  },
]

export default function RoadmapFaq() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="divide-y divide-card-border border-y border-card-border">
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
                <Minus size={18} className="mt-0.5 shrink-0 text-stone-400" aria-hidden />
              ) : (
                <Plus size={18} className="mt-0.5 shrink-0 text-stone-400" aria-hidden />
              )}
            </button>
            {isOpen && (
              <p className="pb-5 text-stone-600 leading-relaxed">{item.a}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

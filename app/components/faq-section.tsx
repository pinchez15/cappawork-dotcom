"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { OrbStation } from "./glyphs"

const faqs = [
  {
    q: "What happens on a discovery call?",
    a: "We look at one workflow with you. You leave knowing whether we should build it.",
  },
  {
    q: "How long does a deployment take?",
    a: "About six weeks for most systems. The workflow sets the clock.",
  },
  {
    q: "What kind of work do you take?",
    a: "Bring the work that is slow. The call is where we decide if it is ours.",
  },
  {
    q: "Will this replace our existing systems?",
    a: "We build on what you already run. Leaving a tool is your call.",
  },
  {
    q: "Do you staff people into our organization?",
    a: "No. You get a system. Your people keep the decisions.",
  },
  {
    q: "How much of our team’s time does this take?",
    a: "Enough to show how the work moves, and who signs off.",
  },
  {
    q: "How do you handle security?",
    a: "Inside the permissions you already have. Access is scoped. Actions are logged.",
  },
  {
    q: "Can this be specific to our workflows?",
    a: "Yes. It is built for your operation.",
  },
]

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-20 sm:py-28 bg-warm-white">
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
            <OrbStation kind="human" label="Discovery call" />
          </div>
          <a
            href="#discovery"
            className="inline-flex items-center bg-gold text-navy px-6 py-3 text-sm font-medium rounded-full hover:bg-gold/90 transition-colors"
          >
            Book a Discovery Call
          </a>
        </div>
      </div>
    </section>
  )
}

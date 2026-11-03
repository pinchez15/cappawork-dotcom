"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"

const faqs = [
  {
    q: "Is this just another AI vendor pitch?",
    a: "No. We are on your side and model-agnostic. We do not resell anyone's AI tools. If your real problem is a slow quote queue, key-person risk, or bad handoffs, that is what we map. If off-the-shelf software beats a custom build, the roadmap will say so.",
  },
  {
    q: "We already know quotes are slow. Why pay for a roadmap?",
    a: "Knowing the pain is not the same as knowing what to fix first, what each fix is worth, and what not to touch. The roadmap ranks the bottlenecks, sizes the impact, and gives you next steps you can defend to a board, a parent company, or your own team.",
  },
  {
    q: "What does \"free when you build\" mean?",
    a: "If you sign a CappaWork build within 60 days of the walkthrough, the full $1,500 is credited toward that build. The credit comes off build invoices. It is not paid out as cash. If you do not build, you keep the roadmap.",
  },
  {
    q: "What if the roadmap finds fewer than 3 opportunities?",
    a: "If the roadmap identifies fewer than 3 opportunities with a sized impact, you get a full refund. We are not here to pad a list so you feel busy.",
  },
  {
    q: "How much of my time does it take?",
    a: "A short booking call to start, about an hour for discovery, a few minutes for the intake form and sample documents, and 45 minutes for the walkthrough. We do the heavy analysis.",
  },
  {
    q: "Our pricing knowledge lives with one person. Can you still help?",
    a: "Yes. That is exactly the kind of risk the roadmap is built to surface. We work from how the business runs today, including the tribal knowledge, and flag what has to be captured before you can scale or hire safely.",
  },
  {
    q: "Do we need clean data or an IT team first?",
    a: "No. Bring the real workflow: a recent quote, a drawing set, a weekly report. We flag what data each step would need. You do not need a perfect stack to get a clear plan.",
  },
  {
    q: "We have a deadline or a parent company asking for an AI plan. Is this fast enough?",
    a: "Yes for a decision-grade plan. Discovery in week 1. Written roadmap and walkthrough usually 1 to 2 weeks after that. You leave with something concrete to act on or present, not another vague initiative.",
  },
  {
    q: "Is our information kept confidential?",
    a: "Yes. We are happy to sign your NDA before the discovery call.",
  },
]

export default function RoadmapFaq() {
  const [open, setOpen] = useState<number | null>(0)

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

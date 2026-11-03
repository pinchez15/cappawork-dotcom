"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"

const faqs = [
  {
    q: "Is this an AI sales pitch?",
    a: "No. We are on your side and model-agnostic. We do not resell anyone's AI tools. If off-the-shelf software beats a custom build, the roadmap will say so.",
  },
  {
    q: "What does \"free when you build\" mean?",
    a: "If you sign a CappaWork build within 60 days of the walkthrough, the full $1,500 is credited toward that build. The credit comes off build invoices. It is not paid out as cash. If you do not build, you keep the roadmap.",
  },
  {
    q: "What if the roadmap finds fewer than 3 opportunities?",
    a: "If the roadmap identifies fewer than 3 opportunities with a sized impact, you get a full refund.",
  },
  {
    q: "How much of my time does it take?",
    a: "A short booking call to start, about an hour for discovery, a few minutes for the intake form and sample documents, and 45 minutes for the walkthrough.",
  },
  {
    q: "Do we need clean data or an IT team?",
    a: "No. We work from how your business runs today and flag what data each step would need.",
  },
  {
    q: "What happens after the roadmap?",
    a: "If there is clear value, we can quote building the top opportunity with your credit applied. Divisions are a good place to pilot. If it works in one part of the company, the plan is written so the broader group can roll it out.",
  },
  {
    q: "Why only $1,500?",
    a: "It is a fixed intro engagement, priced so you can see a real plan before committing to anything bigger.",
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

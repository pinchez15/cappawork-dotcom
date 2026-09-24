"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { OrbStation } from "./process-orb"

const faqs = [
  {
    q: "What happens on a discovery call?",
    a: "It is a working session. We look at how an operational workflow actually runs, where the drag is, and whether the next step is a change in the system, an agent, or both. You leave knowing what would be built and what a deployment would look like.",
  },
  {
    q: "How long does a deployment take?",
    a: "Most engagements move from discovery to a system in production in about six weeks. The clock depends on the workflow and the systems it has to touch. It is not an 18-month program.",
  },
  {
    q: "What kind of work do you change?",
    a: "Work that moves through teams, tools, and handoffs: intake, review, routing, reporting, reconciliation, and the coordination around them. We change how that work runs. An agent goes in when the steps are known and a person should not be the middleware.",
  },
  {
    q: "Will this replace our existing systems?",
    a: "No. The system is built on the tools you already run. We do not ask you to migrate the company onto a new platform. If you want to leave a tool, we will help. We will not require it.",
  },
  {
    q: "Do you staff people into our organization?",
    a: "No. We come in, design the change, and leave a system that stays on call. It is not a seat on your org chart, and it is not a contractor sitting in the workflow.",
  },
  {
    q: "How much of our team’s time does this take?",
    a: "Your team provides the context: how the work really moves, and who has to sign off. CappaWork does the design and the build, and coordinates with the people who own the systems.",
  },
  {
    q: "How do you handle security?",
    a: "The system operates inside the permissions and policies you already have. Access is scoped. Actions are logged so the work can be reviewed.",
  },
  {
    q: "Can this be specific to our workflows?",
    a: "Yes. Every deployment is designed around the workflows, systems, and rules inside your operation. Generalized software that only does half the job is the thing we are here to replace.",
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
        <p className="mt-4 text-center text-stone-600">
          What leadership teams ask before a discovery call.
        </p>

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

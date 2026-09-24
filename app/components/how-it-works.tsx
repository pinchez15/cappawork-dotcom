"use client"

import { FadeInUp } from "./motion-wrapper"
import { ComputerWorkTerm, HumanWorkTerm } from "./work-term"

const steps = [
  {
    number: "01",
    title: "Computer Work Audit",
    body: (
      <>
        A structured look at how work moves across teams, systems, and decision points. We find where{" "}
        <ComputerWorkTerm tone="light" className="text-sm sm:text-base" /> is crowding out{" "}
        <HumanWorkTerm tone="light" className="text-sm sm:text-base" />, and where an agent would help or get in the way.
      </>
    ),
  },
  {
    number: "02",
    title: "Discovery",
    body: "A sprint to decide what changes, what stays with your people, and what gets built. You leave with a sequence leadership can act on. Not an 18-month program.",
  },
  {
    number: "03",
    title: "Build",
    body: "We design and ship the system that will run the workflow, on the tools you already use. Agents go in where they remove a handoff. You own what we build. It stays on call. It is not a staffed seat.",
  },
  {
    number: "04",
    title: "It keeps getting better",
    body: "After it is live, we tighten how the system operates and extend it into the next workflow. Your team stays in the decisions that still need a person.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2450E6] mb-4">
            How an engagement runs
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] max-w-2xl text-balance">
            Audit. Decide. Build. Stay on call.
          </h2>
        </FadeInUp>

        <ol className="mt-14 grid gap-px bg-card-border sm:grid-cols-2 border border-card-border">
          {steps.map((step) => (
            <li key={step.number} className="bg-warm-white p-7 sm:p-9">
              <span className="font-display text-3xl text-[#2450E6]">{step.number}</span>
              <h3 className="mt-4 font-display text-2xl text-navy">{step.title}</h3>
              <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

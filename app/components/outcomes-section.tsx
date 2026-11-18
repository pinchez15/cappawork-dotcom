"use client"

import { OrbStation } from "./glyphs"
import WorkflowMesh from "./workflow-mesh"

const outcomes = [
  { number: "01", title: "Patients enrolled and served sooner" },
  { number: "02", title: "Review and start-up cycles that shrink" },
  { number: "03", title: "More capacity from the same licensed team" },
  { number: "04", title: "Services that become products you can sell" },
]

export default function OutcomesSection() {
  return (
    <section id="outcomes" className="relative py-20 sm:py-28 bg-card-light overflow-hidden">
      <WorkflowMesh />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5 lg:col-start-1">
            <div className="mb-5">
              <OrbStation kind="human" label="The operation decides" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] text-balance">
              The operation gets faster. The care stays human.
            </h2>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7 space-y-8 sm:space-y-10">
            {outcomes.map((item) => (
              <li key={item.number}>
                <span className="font-display text-3xl text-gold">{item.number}</span>
                <h3 className="mt-2 font-display text-2xl sm:text-3xl text-navy">{item.title}</h3>
              </li>
            ))}
            <li>
              <a
                href="#discovery"
                className="inline-flex items-center bg-gold text-navy px-6 py-3 text-sm font-medium rounded-full hover:bg-gold/90 transition-colors"
              >
                Book a Strategy Sprint
              </a>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}

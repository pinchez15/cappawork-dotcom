import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"

const services = [
  {
    name: "AI strategy and roadmap",
    outcome: "Find where AI pays back first, and fund that.",
    work: [
      "Where your licensed team's time and money go today",
      "Opportunities ranked by return, risk, and time to value",
      "A roadmap your executives and board can approve",
    ],
  },
  {
    name: "AI architecture",
    outcome: "Design how AI fits the systems you already run.",
    work: [
      "Data, models, and access mapped to your EHR, CTMS, EDC, safety database, and cloud",
      "PHI boundaries, BAA, and a compliance log for every agent action",
      "Build, buy, or wait, decided per workflow",
    ],
  },
  {
    name: "Healthcare agents",
    outcome: "Agents that do the work, deployed in your systems and kept running.",
    work: [
      "Prior auth, eligibility, intake, and trial start-up (feasibility, CDAs, budgets, contracts)",
      "Shadow mode beside your team before anything goes live",
      "Maintained as payer rules, SOPs, and systems change, measured every month",
    ],
  },
  {
    name: "Trial safety operations",
    outcome: "Sponsor-side safety workflows that return labor hours, with a medical reviewer still deciding reportability.",
    work: [
      "SAE intake and case narratives drafted for qualified review",
      "Reconciliation between EDC and the safety database",
      "Site query drafting measured in sponsor hours returned",
    ],
  },
  {
    name: "Custom software",
    outcome: "When the answer is a product, we build it.",
    work: [
      "Client portals and sponsor-facing platforms",
      "Replacing costly legacy SaaS cores",
      "Interfaces your team and agents share",
    ],
  },
]

export default function HomeServices() {
  return (
    <section id="services" className="bg-card-light py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal as="h2" className="font-display text-[2.5rem] leading-[1.05] tracking-[-0.015em] text-navy sm:text-[3.25rem]">
              Built for return, not for demos.
            </Reveal>
            <Reveal index={1} className="mt-6">
              <p className="text-lg leading-relaxed text-stone-600">
                Every engagement starts with a baseline: where your team&rsquo;s time and money go
                today. That is how we choose the work, and how we measure what it returns.
              </p>
              <a
                href="#discovery"
                className="mt-8 inline-flex items-center gap-2 text-[15px] font-medium text-navy underline decoration-navy/25 underline-offset-[6px] transition-colors hover:decoration-gold"
              >
                Book a Strategy Sprint
                <ArrowRight size={15} aria-hidden />
              </a>
            </Reveal>
          </div>
        </div>

        <ol className="border-b border-card-border lg:col-span-7 lg:col-start-6">
          {services.map((service, i) => (
            <Reveal
              as="li"
              key={service.name}
              className="grid gap-x-6 border-t border-card-border py-9 sm:grid-cols-[3rem_1fr] sm:py-11"
            >
              <span className="font-display text-xl text-gold" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="mt-2 font-display text-[1.75rem] leading-tight text-navy sm:mt-0 sm:text-[2rem]">
                  {service.name}
                </h3>
                <p className="mt-3 max-w-xl text-lg leading-relaxed text-stone-700">
                  {service.outcome}
                </p>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-stone-500">
                  {service.work.join(". ")}.
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

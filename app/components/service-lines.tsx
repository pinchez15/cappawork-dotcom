"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const services = [
  {
    number: "01",
    name: "Embedded Product and AI Leadership",
    outcome: "A stuck initiative becomes a product your executives can see, price, and sell.",
    work: [
      "Product vision, suite strategy, pricing",
      "Working prototypes in front of leadership within weeks",
      "Your team moved onto an AI-native way of building",
    ],
    forWhom: "Life sciences services firms, pharmacy and provider organizations, emerging biotech",
  },
  {
    number: "02",
    name: "Services-to-Product Builds",
    outcome: "Expertise you deliver by hand becomes a platform your clients log into.",
    work: [
      "Sponsor- and client-facing platforms",
      "Replacing costly legacy SaaS cores",
      "Client portals with agents built in",
    ],
    forWhom: "Recruitment firms, agencies, CROs, consultancies",
  },
  {
    number: "03",
    name: "Clinical Trial Operations",
    outcome: "Faster from first outreach to randomized patient, with less site paperwork.",
    work: [
      "Patient follow-up and pre-screening",
      "Feasibility packets and start-up tracking",
      "Enrollment forecasting and sponsor reporting",
    ],
    forWhom: "Patient recruitment firms, CROs, site networks, sponsors",
  },
  {
    number: "04",
    name: "Regulated Content Operations",
    outcome: "Shorter review cycles without loosening MLR control.",
    work: [
      "Pre-MLR checks against approved claims",
      "Claims libraries and Draft 0 documents",
      "Translation request routing",
    ],
    forWhom: "Healthcare agencies, medical communications, medical affairs",
  },
  {
    number: "05",
    name: "Pharmacy and Care Operations",
    outcome: "More patients served by the same pharmacists, nurses, and intake staff.",
    work: [
      "Admissions, intake, prior auth packets",
      "Refill and delivery coordination",
      "Staffing and capacity models",
    ],
    forWhom: "LTC, specialty, and infusion pharmacies; physician groups and MSOs",
  },
]

export default function ServiceLines() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-card-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold mb-4">
            Service lines
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] max-w-3xl text-balance">
            Built for the work between the science and the patient.
          </h2>
          <p className="mt-5 max-w-2xl text-lg text-stone-600 leading-relaxed">
            Every engagement starts with a capacity model: where your licensed team&rsquo;s time goes today,
            and where it goes after the build.
          </p>
        </FadeInUp>

        <StaggerContainer className="mt-12 sm:mt-14 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.number} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-card-border bg-warm-white p-6 sm:p-7">
                <span className="font-display text-3xl text-gold">{service.number}</span>
                <h3 className="mt-3 font-display text-2xl text-navy leading-snug">{service.name}</h3>
                <p className="mt-3 text-stone-700 leading-relaxed">{service.outcome}</p>
                <ul className="mt-5 space-y-2 flex-1">
                  {service.work.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-stone-600 leading-relaxed">
                      <span className="mt-2 flex-shrink-0 w-1 h-1 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-6 border-t border-card-border pt-4 text-xs leading-relaxed text-stone-500">
                  <span className="font-semibold tracking-[0.14em] uppercase text-stone-400">For </span>
                  {service.forWhom}
                </p>
              </article>
            </StaggerItem>
          ))}

          <StaggerItem className="h-full">
            <div className="flex h-full flex-col rounded-2xl bg-navy p-6 sm:p-7 ring-2 ring-gold/40">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gold">Strategy Sprint</p>
              <p className="mt-4 font-display text-2xl sm:text-[1.75rem] text-white leading-snug text-balance">
                Stuck on an initiative?
              </p>
              <p className="mt-3 text-white/70 leading-relaxed flex-1">
                A one-week strategy sprint tells you what to build, what it is worth, and what the next
                sprints are.
              </p>
              <a
                href="#discovery"
                className="mt-6 inline-flex items-center justify-center gap-2 self-start bg-gold text-navy px-6 py-3 text-sm font-medium rounded-full hover:bg-gold/90 transition-colors"
              >
                Book a Strategy Sprint
                <ArrowRight size={16} />
              </a>
            </div>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  )
}

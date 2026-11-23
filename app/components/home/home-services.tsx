import { ArrowRight } from "lucide-react"
import { Reveal } from "./reveal"

const services = [
  {
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

export default function HomeServices() {
  return (
    <section id="services" className="bg-warm-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal as="h2" className="font-display text-[2.5rem] leading-[1.05] tracking-[-0.015em] text-navy sm:text-[3.25rem]">
              Built for the work between the science and the patient.
            </Reveal>
            <Reveal index={1} className="mt-6">
              <p className="text-lg leading-relaxed text-stone-600">
                Every engagement starts with a capacity model: where your licensed team&rsquo;s time
                goes today, and where it goes after the build.
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
                <p className="mt-4 text-[13px] text-stone-400">
                  <span className="font-medium uppercase tracking-[0.1em]">For</span>{" "}
                  {service.forWhom}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}

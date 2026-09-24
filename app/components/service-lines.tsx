"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

const services = [
  {
    key: "Discover",
    href: "/discover",
    headline: "Baseline before you build.",
    price: "From $2,500",
    priceNote: "Week 0 Audit · credited to Transformation",
    includes: [
      "Map Computer Work vs Human Work",
      "Baseline hours, cycle time, rework",
      "Decide what to fix first",
    ],
    inquiryKey: "Discover",
  },
  {
    key: "Transformation",
    href: "/transformation",
    headline: "Production in one department — six weeks.",
    price: "Starts at $90,000",
    priceNote: "2–4 workflows · you own the IP",
    includes: [
      "Week 0 audit credited to the engagement",
      "Signed scope before anything is built",
      "Go-live with a narrow 12-month guarantee",
    ],
    inquiryKey: "6-Week AI Transformation",
    featured: true,
  },
  {
    key: "Build",
    href: "/build",
    headline: "Software your team wants to use.",
    price: "From $35,000",
    priceNote: "8–16 weeks · you own the IP",
    includes: [
      "Designed around how you work",
      "AI inside the workflow",
      "Launch, training, full handoff",
    ],
    inquiryKey: "Build",
  },
]

export default function ServiceLines() {
  const { open } = useInquiry()

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-card-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gold block mb-3 sm:mb-4">
            Choose Your Stage
          </span>
          <h2 className="font-display text-[1.65rem] sm:text-3xl md:text-4xl tracking-tight text-navy leading-[1.15] sm:leading-tight mb-3 sm:mb-4 max-w-xl text-balance">
            Start with the audit. Ship the transformation.
          </h2>
          <p className="text-base sm:text-lg text-stone-500 mb-8 sm:mb-12 max-w-2xl">
            Primary path for businesses over ~$50M revenue: Computer Work Audit → 6-Week AI Transformation. Build stays available for bounded products. Modernize is an optional retainer after go-live.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <StaggerItem key={service.key}>
              <div
                className={`h-full flex flex-col rounded-2xl p-5 sm:p-7 lg:p-8 ${
                  service.featured
                    ? "bg-navy text-white ring-2 ring-gold/40"
                    : "bg-warm-white border border-card-border"
                }`}
              >
                <p className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-gold mb-2 sm:mb-3">
                  {service.key}
                </p>
                <h3
                  className={`font-display text-lg sm:text-xl mb-3 sm:mb-4 leading-snug ${
                    service.featured ? "text-white" : "text-navy"
                  }`}
                >
                  {service.headline}
                </h3>

                <div className="mb-4 sm:mb-5">
                  <p
                    className={`font-display text-2xl sm:text-3xl tracking-tight ${
                      service.featured ? "text-white" : "text-navy"
                    }`}
                  >
                    {service.price}
                  </p>
                  <p
                    className={`text-xs sm:text-sm mt-1 ${
                      service.featured ? "text-white/50" : "text-stone-500"
                    }`}
                  >
                    {service.priceNote}
                  </p>
                </div>

                <ul className="space-y-2 mb-5 sm:mb-6 flex-1">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2 text-sm ${
                        service.featured ? "text-white/70" : "text-stone-600"
                      }`}
                    >
                      <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-2.5 mt-auto">
                  <button
                    onClick={() => open(service.inquiryKey)}
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                      service.featured
                        ? "text-gold hover:text-gold/80"
                        : "text-navy hover:text-gold"
                    }`}
                  >
                    Talk about {service.key}
                    <ArrowRight size={16} />
                  </button>
                  <Link
                    href={service.href}
                    className={`inline-flex items-center gap-2 text-sm transition-colors ${
                      service.featured
                        ? "text-white/50 hover:text-white/80"
                        : "text-stone-500 hover:text-navy"
                    }`}
                  >
                    Learn more
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp>
          <p className="mt-8 sm:mt-10 text-center text-sm text-stone-500">
            Week 0 Audit ($2,500) credits fully toward Transformation.{" "}
            <Link href="/modernize" className="underline hover:text-navy transition-colors">
              Modernize retainer
            </Link>{" "}
            (~$10–12k/mo) is optional after go-live.
          </p>
        </FadeInUp>
      </div>
    </section>
  )
}

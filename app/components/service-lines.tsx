"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

const services = [
  {
    key: "Discover",
    href: "/discover",
    tagline: "The right roadmap before the wrong build.",
    price: "From $10,000",
    priceNote: "Sprint · 2 weeks  ·  Deep · $30,000 · 4–6 weeks",
    includes: [
      "Workflow and process analysis",
      "AI modernization roadmap",
      "Build vs. buy recommendation",
      "Prioritized implementation plan",
    ],
    inquiryKey: "Discover",
  },
  {
    key: "Build",
    href: "/build",
    tagline: "Production software shaped around how your team works.",
    price: "From $35,000",
    priceNote: "8–16 weeks · you own the IP",
    includes: [
      "Product strategy and UX design",
      "AI workflow design",
      "Full-stack development",
      "Launch, training, and handoff",
    ],
    inquiryKey: "Build",
    featured: true,
  },
  {
    key: "Modernize",
    href: "/modernize",
    tagline: "A senior AI product engineer embedded in your business.",
    price: "$15,000/month",
    priceNote: "Six-month engagement · $90,000 total",
    includes: [
      "Continuous opportunity identification",
      "Legacy system modernization",
      "Built inside your environment",
      "Technical leadership and adoption",
    ],
    inquiryKey: "Modernize",
  },
]

export default function ServiceLines() {
  const { open } = useInquiry()

  return (
    <section id="services" className="py-24 bg-card-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            How We Work With You
          </span>
          <div className="max-w-3xl mb-6">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-6">
              One journey. Three ways to engage.
            </h2>
            <p className="text-stone-600 leading-relaxed text-lg">
              Most clients start with a free working session, then move into Discover when they are ready to commit.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-6 lg:grid-cols-3 mt-12">
          {services.map((service) => (
            <StaggerItem key={service.key}>
              <div
                className={`h-full flex flex-col rounded-2xl p-8 ${
                  service.featured
                    ? "bg-navy text-white ring-2 ring-gold/40"
                    : "bg-warm-white border border-card-border"
                }`}
              >
                <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-3">
                  {service.key}
                </p>
                <h3
                  className={`font-display text-xl mb-4 leading-snug ${
                    service.featured ? "text-white" : "text-navy"
                  }`}
                >
                  {service.tagline}
                </h3>

                <div className="mb-6">
                  <p
                    className={`font-display text-3xl tracking-tight ${
                      service.featured ? "text-white" : "text-navy"
                    }`}
                  >
                    {service.price}
                  </p>
                  <p
                    className={`text-sm mt-1 ${
                      service.featured ? "text-white/50" : "text-stone-500"
                    }`}
                  >
                    {service.priceNote}
                  </p>
                </div>

                <ul className="space-y-2 mb-6 flex-1">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className={`flex items-start gap-2 text-sm leading-relaxed ${
                        service.featured ? "text-white/70" : "text-stone-600"
                      }`}
                    >
                      <span className="mt-1.5 flex-shrink-0 w-1 h-1 rounded-full bg-gold" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col gap-3 mt-auto">
                  <Link
                    href={service.href}
                    className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                      service.featured
                        ? "text-white hover:text-gold"
                        : "text-navy hover:text-gold"
                    }`}
                  >
                    Learn more
                    <ArrowRight size={16} />
                  </Link>
                  <button
                    onClick={() => open(service.inquiryKey)}
                    className={`inline-flex items-center gap-2 text-sm transition-colors ${
                      service.featured
                        ? "text-white/50 hover:text-white/80"
                        : "text-stone-500 hover:text-navy"
                    }`}
                  >
                    Talk about {service.key}
                  </button>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp>
          <div className="mt-10 rounded-2xl border border-gold/30 bg-warm-white p-6 text-center">
            <p className="text-stone-600 leading-relaxed">
              <span className="font-medium text-navy">Discover Sprint</span> credits $5,000 toward Build or Modernize.
              {" "}
              <span className="font-medium text-navy">Discover Deep</span> credits $10,000 within 90 days.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

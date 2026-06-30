"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

const services = [
  {
    key: "Discover",
    href: "/discover",
    headline: "Build the right roadmap before you build the wrong software.",
    price: "From $10,000",
    priceNote: "Sprint: 2 weeks · Deep: $30,000 · 4–6 weeks",
    copy: "We uncover where your business is paying people to do computer work and identify the highest-return opportunities for AI, automation, and custom software.",
    includes: [
      "Map the workflows where time is lost",
      "Rank AI opportunities by ROI and adoption risk",
      "Decide what to buy, customize, or build",
      "Produce a modernization roadmap your team can execute",
    ],
    inquiryKey: "Discover",
  },
  {
    key: "Build",
    href: "/build",
    headline: "Production software your team actually wants to use.",
    price: "From $35,000",
    priceNote: "8–16 weeks · you own the IP",
    copy: "We design and build production systems around how your business already works, with AI handling drafting, routing, summarizing, and follow-up inside the workflow.",
    includes: [
      "Product strategy and UX design",
      "AI workflow design",
      "Full-stack software development",
      "Launch, training, and handoff",
      "Source code, documentation, and IP transferred",
    ],
    inquiryKey: "Build",
  },
  {
    key: "Modernize",
    href: "/modernize",
    headline: "An embedded modernization partner who ships.",
    price: "$15,000/month",
    priceNote: "Six-month engagement · $90,000 total",
    copy: "For transformations that outgrow a single project, we embed a senior AI product engineer inside your business to identify opportunities, build solutions, and help adoption stick.",
    includes: [
      "Continuous opportunity identification",
      "Legacy system modernization",
      "AI implementation inside existing workflows",
      "Built inside your environment",
      "Technical leadership, training, and adoption",
    ],
    inquiryKey: "Modernize",
    featured: true,
  },
]

export default function ServiceLines() {
  const { open } = useInquiry()

  return (
    <section id="services" className="py-24 bg-card-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Three Ways to Modernize
          </span>
          <div className="max-w-3xl mb-6">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-4">
              Choose the right level of engagement.
            </h2>
            <p className="text-stone-500 text-base">
              AI didn&rsquo;t make repetitive work automatable. It made custom software affordable.
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
                  {service.headline}
                </h3>

                <div className="mb-4">
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

                <p
                  className={`text-sm leading-relaxed mb-5 ${
                    service.featured ? "text-white/70" : "text-stone-600"
                  }`}
                >
                  {service.copy}
                </p>

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
          <div className="mt-10 rounded-2xl border border-gold/30 bg-warm-white p-6 text-center">
            <p className="text-stone-600 leading-relaxed">
              <span className="font-medium text-navy">Discover Sprint</span> credits $5,000 toward Build or Modernize.
              {" "}
              <span className="font-medium text-navy">Discover Deep</span> credits $10,000 within 90 days.
            </p>
            <p className="text-stone-500 text-sm mt-3">
              The most expensive software project is the one that solves the wrong problem.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

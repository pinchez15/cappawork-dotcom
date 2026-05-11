"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const softwareOptions = [
  {
    title: "Custom CRM",
    text: "Built around your real customer journey.",
  },
  {
    title: "Sales Pipeline System",
    text: "Forecast, follow up, and close more deals.",
  },
  {
    title: "Business Development Platform",
    text: "Turn outreach and referrals into a repeatable engine.",
  },
  {
    title: "AI Agent System",
    text: "Automate repetitive knowledge work.",
  },
  {
    title: "Time Tracking & Job Costing",
    text: "See labor, capacity, and profitability clearly.",
  },
  {
    title: "Operations Dashboard",
    text: "One executive view of the business.",
  },
  {
    title: "Client Portal",
    text: "Status, documents, requests, and approvals in one place.",
  },
  {
    title: "Field Team Mobile App",
    text: "iOS and Android tools for teams on the move.",
  },
  {
    title: "Workflow Management System",
    text: "Replace spreadsheets, handoffs, and status chasing.",
  },
  {
    title: "Inventory & Asset Tracking",
    text: "Know what you have, where it is, and what it costs.",
  },
  {
    title: "Reporting & Analytics Platform",
    text: "Automate the reports leaders actually use.",
  },
  {
    title: "Customer Service System",
    text: "Track requests, issues, SLAs, and resolution.",
  },
]

export default function SoftwareWeBuild() {
  return (
    <section id="software-we-build" className="py-24 bg-card-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Software We Build
          </span>
          <div className="max-w-4xl">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-6">
              One or two custom systems can replace the tools holding your business together.
            </h2>
            <p className="text-lg text-stone-600 leading-relaxed mb-14">
              Most $5M-$50M businesses do not need more software subscriptions. They need custom systems that replace expensive tools, remove bottlenecks, and increase revenue by expanding team capacity. CappaWork builds each system to return at least 10x value over two years.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {softwareOptions.map((option) => (
            <StaggerItem key={option.title}>
              <div className="h-full rounded-2xl border border-stone-200 bg-warm-white p-6">
                <h3 className="font-display text-xl text-navy mb-3">
                  {option.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  {option.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

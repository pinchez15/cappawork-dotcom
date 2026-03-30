"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { Search, Compass, Code2, UserCheck, GraduationCap, RefreshCw } from "lucide-react"

const capabilities = [
  {
    icon: Search,
    title: "Profit Diagnostics",
    description:
      "We find where you're leaving money on the table. Full workflow audit, margin analysis, opportunity mapping tied to your actual P&L.",
  },
  {
    icon: Compass,
    title: "AI Strategy",
    description:
      "We decide what to build and in what order. Prioritized by profit impact, not novelty. You'll never build the wrong thing first.",
  },
  {
    icon: Code2,
    title: "Product Development",
    description:
      "We build custom AI products and workflow automation. Full-stack — architecture through deployment. Production-ready, not prototypes.",
  },
  {
    icon: UserCheck,
    title: "Executive Coaching",
    description:
      "We coach you on AI decisions so you move fast and stay informed. You'll know what's hype, what's real, and what matters for your business.",
  },
  {
    icon: GraduationCap,
    title: "Team Training",
    description:
      "We train your people to use and maintain what we build. Hands-on, in their actual codebase, with their actual work — not a generic workshop.",
  },
  {
    icon: RefreshCw,
    title: "Change Management",
    description:
      "We help your organization actually adopt the new way of working. New tools fail when nobody changes the process. We change the process.",
  },
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-24 bg-warm-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Inside the Engagement
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-16">
            What your AI team does.
          </h2>
        </FadeInUp>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {capabilities.map((cap) => (
            <StaggerItem key={cap.title}>
              <div className="group">
                <cap.icon
                  size={28}
                  className="text-gold mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="text-lg font-semibold text-navy mb-2">
                  {cap.title}
                </h3>
                <p className="text-stone-600 leading-relaxed text-sm">
                  {cap.description}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { Compass, Code2, UserCheck, GraduationCap, Search, RefreshCw } from "lucide-react"

const capabilities = [
  {
    icon: Compass,
    title: "AI Strategy",
    description:
      "We figure out where AI actually matters for your business and build a roadmap prioritized by impact.",
  },
  {
    icon: Search,
    title: "Workflow Audit",
    description:
      "We find the manual work that's costing you the most and identify where automation will move the needle.",
  },
  {
    icon: Code2,
    title: "Product Development",
    description:
      "We build custom AI products and automation. Full-stack, production-ready, shipped monthly.",
  },
  {
    icon: UserCheck,
    title: "Executive Coaching",
    description:
      "We help you make informed AI decisions — what's real, what's hype, and what matters for your business.",
  },
  {
    icon: GraduationCap,
    title: "Team Training",
    description:
      "We train your people to use and maintain what we build. Hands-on, in their actual workflow.",
  },
  {
    icon: RefreshCw,
    title: "Change Management",
    description:
      "New tools fail when nobody changes the process. We change the process.",
  },
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="py-24 bg-warm-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            What We Do
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-16">
            Strategy, build, and training &mdash; all in one team.
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

"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const problems = [
  {
    title: "Your team has outgrown the workaround.",
    text: "The spreadsheet, the duplicate entry, the manual handoff, the \u201cjust ask Sarah\u201d process. These are not small annoyances. They are the bottlenecks limiting growth.",
  },
  {
    title: "Generic tools create generic operations.",
    text: "Most software asks your business to adapt to it. CappaWork builds the system around your people, your customers, and the way value actually moves through your company.",
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            The Opportunity
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight mb-16">
            Off-the-shelf software was not built for your business.
          </h2>
        </FadeInUp>

        <StaggerContainer className="space-y-10">
          {problems.map((problem) => (
            <StaggerItem key={problem.title}>
              <div className="border-l-2 border-gold/40 pl-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {problem.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {problem.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

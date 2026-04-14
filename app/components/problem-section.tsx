"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const problems = [
  {
    title: "You can\u2019t hire for this.",
    text: "A Head of AI costs $250\u2013400K and takes six months to find. And they still can\u2019t do strategy, build, and training. You need all three now.",
  },
  {
    title: "The advice you\u2019re getting isn\u2019t working.",
    text: "Consultants hand you a deck. Dev shops take orders. Tool vendors sell their product. Nobody\u2019s on your side of the table.",
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            The Problem
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight mb-16">
            Disrupt yourself before someone else does.
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

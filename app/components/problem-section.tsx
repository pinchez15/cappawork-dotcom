"use client"

import { FadeInUp } from "./motion-wrapper"

const badOptions = [
  {
    label: "Option 1: Hire a dev shop",
    text: "$100–200K for a build that might solve the wrong problem. They don't know your business. They don't diagnose — they take orders. If the spec is wrong, the product is wrong, and you're out six figures with nothing to show for it.",
  },
  {
    label: "Option 2: Buy AI tools",
    text: "Notion AI, ChatGPT Enterprise, Copilot — tools everywhere, impact nowhere. Nobody rethought the workflow. Nobody connected the tools to the thing that actually makes you money. You're paying for AI and getting autocomplete.",
  },
  {
    label: "Option 3: Figure it out yourself",
    text: "You spend six months learning AI. You neglect the business. You build a prototype that doesn't connect to your P&L. Your competitors, who hired someone, are already shipping.",
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

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight mb-12">
            You have three options. They all fail.
          </h2>

          <div className="space-y-10 mb-16">
            {badOptions.map((option) => (
              <div key={option.label}>
                <h3 className="text-lg font-semibold text-white mb-3">
                  {option.label}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {option.text}
                </p>
              </div>
            ))}
          </div>

          {/* The fourth option */}
          <div className="border-t border-white/10 pt-10">
            <h3 className="text-lg font-semibold text-gold mb-4">
              The fourth option:
            </h3>
            <p className="text-xl text-white leading-relaxed font-display">
              CappaWork becomes your AI team. We find the profit lever, build the solution, coach you through the decisions, and train your team to own it. One relationship. One engagement. You keep everything we build.
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

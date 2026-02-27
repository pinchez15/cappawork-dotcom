"use client"

import { FadeInUp, StaggerContainer, StaggerItem, CountUp } from "./motion-wrapper"

const stats = [
  { value: 5, prefix: "", suffix: "\u00d7", label: "Profit improvement" },
  { value: 225, prefix: "$", suffix: "K", label: "Annual profit (from $45K)" },
  { value: 12, prefix: "", suffix: " mo", label: "Time to result" },
]

export default function ProofPoint() {
  return (
    <section className="py-24 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Proof, Not Promises
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy leading-tight mb-8">
            5x profit improvement. 12 months. Same team.
          </h2>

          <div className="text-lg text-stone-600 leading-relaxed space-y-6 mb-16">
            <p>
              One founder came to us doing $1.5M in revenue with $45K in annual profit. Twelve months later: $1.8M in revenue, $225K in profit. Same team. Same market.
            </p>
            <p>
              We identified the margin leaks, removed the operational constraints, automated the work that was eating their team&apos;s time — and the business kept the money it was already earning.
            </p>
            <p className="font-medium text-navy">
              Not from growth hacks. From operational precision and smart automation.
            </p>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid grid-cols-3 gap-8 text-center">
          {stats.map((stat) => (
            <StaggerItem key={stat.label}>
              <div>
                <div className="font-display text-5xl md:text-6xl lg:text-7xl text-navy mb-2">
                  <CountUp
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </div>
                <p className="text-sm text-stone-500 uppercase tracking-wide">
                  {stat.label}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

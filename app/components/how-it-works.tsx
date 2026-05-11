"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

const timeline = [
  {
    phase: "Month 1",
    title: "Map the work, find the bottlenecks, and define the system worth building.",
  },
  {
    phase: "Months 2\u20135",
    title: "Ship working software in focused releases, with your team using it as it improves.",
  },
  {
    phase: "Month 6",
    title: "Stabilize, train, and hand off the operating system your business now owns.",
  },
  {
    phase: "Ongoing",
    title: "Host, secure, maintain, and improve the software. You own the IP. CappaWork keeps it working.",
  },
]

export default function HowItWorks() {
  const { open } = useInquiry()

  return (
    <section id="how-it-works" className="py-24 bg-warm-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            How It Works
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-16">
            We design, build, and host the software your business actually needs.
          </h2>
        </FadeInUp>

        <StaggerContainer className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-stone-200" />

          <div className="space-y-12">
            {timeline.map((item) => (
              <StaggerItem key={item.phase}>
                <div className="relative pl-12 md:pl-16">
                  {/* Timeline dot */}
                  <div className="absolute left-2 md:left-4 top-1 w-4 h-4 rounded-full bg-gold border-2 border-warm-white" />

                  <p className="text-sm font-semibold tracking-widest uppercase text-gold mb-2">
                    {item.phase}
                  </p>
                  <h3 className="font-display text-xl text-navy">
                    {item.title}
                  </h3>
                </div>
              </StaggerItem>
            ))}
          </div>
        </StaggerContainer>

        <FadeInUp>
          <div className="mt-16">
            <button
              onClick={() => open()}
              className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
            >
              Get in Touch
              <ArrowRight size={18} />
            </button>
          </div>
        </FadeInUp>
      </div>
    </section>
  )
}

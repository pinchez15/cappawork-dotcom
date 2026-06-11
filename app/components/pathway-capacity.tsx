"use client"

import { ArrowRight } from "lucide-react"
import { FadeInUp } from "./motion-wrapper"
import { useInquiry } from "./inquiry-modal"

export default function PathwayCapacity() {
  const { open } = useInquiry()

  return (
    <section id="capacity" className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            Pathway: Capacity
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight mb-10">
            Turning away work you could be winning?
          </h2>
          <div className="space-y-5 text-white/70 leading-relaxed text-lg mb-10">
            <p>
              Some businesses don&rsquo;t have a demand problem &mdash; they have a throughput problem. Every new customer costs another pair of hands, hiring can&rsquo;t keep pace, and growing first would bury the team you have.
            </p>
            <p>
              One firm we talked to processes compliance paperwork for property managers. Everything arrives by email. A person keys each PDF, by hand, into a database built over a decade ago. Demand far outruns what they can serve.
            </p>
            <p>
              CappaWork builds the system that breaks the link between revenue and headcount: documents that key themselves, a person confirming instead of typing &mdash; so the team you already have can serve the demand you already get.
            </p>
          </div>
          <button
            onClick={() => open()}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Book a Working Session
            <ArrowRight size={18} />
          </button>
        </FadeInUp>
      </div>
    </section>
  )
}

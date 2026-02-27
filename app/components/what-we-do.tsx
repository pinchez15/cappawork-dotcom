"use client"

import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { StaggerContainer, StaggerItem } from "./motion-wrapper"

const phases = [
  {
    number: "01",
    title: "Diagnose",
    description:
      "We map your workflows, quantify where time and money leak, and identify the highest-leverage automation opportunities.",
  },
  {
    number: "02",
    title: "Build",
    description:
      "We implement targeted AI and automation systems — not a full rebuild. The smallest change with the biggest margin impact.",
  },
  {
    number: "03",
    title: "Elevate",
    description:
      "Your team shifts from busywork to high-value work. Profit per employee goes up. The business scales without scaling headcount.",
  },
]

export default function WhatWeDo() {
  return (
    <section id="approach" className="py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16">
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Our Approach
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-navy leading-tight">
            We help you shift from buried in busywork to built for what&apos;s next.
          </h2>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-8">
          {phases.map((phase) => (
            <StaggerItem key={phase.number}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="bg-card-light border border-card-border rounded-2xl p-8 h-full flex flex-col"
              >
                <span className="font-display text-5xl text-gold/60 mb-4 block">
                  {phase.number}
                </span>
                <h3 className="text-2xl font-semibold text-navy mb-3">
                  {phase.title}
                </h3>
                <p className="text-stone-600 leading-relaxed mb-6 flex-1">
                  {phase.description}
                </p>
                <Link
                  href="/transformation"
                  className="inline-flex items-center gap-1 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
                >
                  Learn more <ArrowRight size={14} />
                </Link>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

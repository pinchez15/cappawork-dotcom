"use client"

import { ArrowUpRight } from "lucide-react"
import HeroField from "./hero-field"

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col bg-[#F7F8FA] overflow-hidden pt-16">
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(10,15,28,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(10,15,28,0.045) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <HeroField />

      <div className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-28 pb-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <h1 className="lg:col-span-7 font-display text-[2.75rem] sm:text-6xl lg:text-[4.5rem] tracking-tight text-navy leading-[0.98] text-balance">
            Transform how your enterprise works.
          </h1>
          <p className="lg:col-span-5 lg:pt-4 text-base sm:text-lg text-stone-600 leading-relaxed max-w-md lg:ml-auto">
            Custom AI systems for the operations that run the company. We redesign the workflow from the inside, and we put an agent in only where the work calls for one. No generalized software that does half the job. No 18-month timelines.
          </p>
        </div>

        <div className="mt-16 sm:mt-24 lg:mt-36 flex flex-col sm:flex-row gap-3 sm:justify-end">
          <a
            href="#discovery"
            className="group flex items-start justify-between gap-6 w-full sm:w-72 min-h-36 bg-[#2450E6] text-white px-6 py-5 hover:bg-[#1D45D4] transition-colors"
          >
            <span className="text-base font-medium">Book a Discovery Call</span>
            <ArrowUpRight size={18} className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#work"
            className="group flex items-start justify-between gap-6 w-full sm:w-72 min-h-36 bg-navy text-white px-6 py-5 hover:bg-[#141A2E] transition-colors"
          >
            <span className="text-base font-medium">See the work</span>
            <ArrowUpRight size={18} className="mt-0.5 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  )
}

"use client"

import { ArrowUpRight } from "lucide-react"
import { FadeInUp } from "./motion-wrapper"
import {
  FEATURED_TESTIMONIAL,
  PORTFOLIO_PROJECTS,
} from "@/lib/portfolio/data"

export default function PortfolioSection() {
  return (
    <section id="work" className="py-20 sm:py-28 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2450E6] mb-4">
            In production
          </p>
          <h2 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05] max-w-3xl text-balance">
            Systems that changed how the work gets done.
          </h2>
          <p className="mt-6 text-base sm:text-lg text-stone-600 max-w-2xl leading-relaxed">
            Some of these put an agent in the workflow. All of them replaced a way of working that depended on people moving information by hand.
          </p>
        </FadeInUp>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {PORTFOLIO_PROJECTS.map((project) => (
            <a
              key={project.name}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full flex-col border border-card-border bg-white p-7 sm:p-8 hover:border-[#2450E6]/50 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#2450E6]">
                  {project.modeLabel}
                </span>
                <ArrowUpRight
                  size={16}
                  className="text-stone-400 group-hover:text-[#2450E6] transition-colors"
                />
              </div>
              <h3 className="mt-6 font-display text-3xl text-navy group-hover:text-[#2450E6] transition-colors">
                {project.name}
              </h3>
              <p className="mt-1 text-xs font-medium tracking-wide uppercase text-stone-400">
                {project.industry}
              </p>
              <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed flex-1">
                {project.description}
              </p>
              <span className="mt-6 text-sm font-medium text-navy group-hover:text-[#2450E6] transition-colors">
                Visit {project.name}
              </span>
            </a>
          ))}
        </div>

        <blockquote className="mt-10 border border-card-border bg-[#F7F8FA] p-7 sm:p-10">
          <p className="font-display text-2xl sm:text-3xl text-navy leading-snug">
            &ldquo;{FEATURED_TESTIMONIAL.quote}&rdquo;
          </p>
          <footer className="mt-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="font-medium text-navy">{FEATURED_TESTIMONIAL.name}</p>
              <p className="text-sm text-stone-500">
                {FEATURED_TESTIMONIAL.title}, {FEATURED_TESTIMONIAL.company}
              </p>
            </div>
            <a
              href={FEATURED_TESTIMONIAL.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2450E6] hover:text-[#1D45D4]"
            >
              See {FEATURED_TESTIMONIAL.projectName}
              <ArrowUpRight size={14} />
            </a>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}

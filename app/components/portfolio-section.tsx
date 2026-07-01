"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper";
import {
  FEATURED_TESTIMONIAL,
  PORTFOLIO_PROJECTS,
} from "@/lib/portfolio/data";

export default function PortfolioSection() {
  return (
    <section id="work" className="py-16 sm:py-20 lg:py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-gold block mb-3 sm:mb-4">
            Proof
          </span>
          <h2 className="font-display text-[1.65rem] sm:text-3xl md:text-4xl tracking-tight text-white leading-[1.15] sm:leading-tight mb-4 sm:mb-6 text-balance">
            Production systems, live today.
          </h2>
          <p className="text-sm sm:text-base text-white/50 mb-10 sm:mb-14 max-w-xl">
            Not mockups. Real software running real work.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8 sm:mb-12">
          {PORTFOLIO_PROJECTS.map((project) => (
            <StaggerItem key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-card-dark p-5 sm:p-6 hover:border-gold/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-xs font-semibold tracking-widest uppercase text-gold">
                    {project.industry}
                  </span>
                  <ExternalLink
                    size={14}
                    className="flex-shrink-0 text-white/30 group-hover:text-gold transition-colors"
                  />
                </div>
                <h3 className="font-display text-xl text-white mb-2 group-hover:text-gold transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-white/60 leading-relaxed flex-1 line-clamp-3">
                  {project.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-white/50 group-hover:text-gold transition-colors">
                  Visit site
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </span>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeInUp>
          <div className="rounded-2xl border border-gold/30 bg-card-dark p-5 sm:p-8 lg:p-10">
            <blockquote className="text-lg sm:text-xl text-white/85 leading-relaxed mb-6 sm:mb-8">
              &ldquo;{FEATURED_TESTIMONIAL.quote}&rdquo;
            </blockquote>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <p className="font-medium text-white">{FEATURED_TESTIMONIAL.name}</p>
                <p className="text-sm text-white/50">
                  {FEATURED_TESTIMONIAL.title}, {FEATURED_TESTIMONIAL.company}
                </p>
              </div>
              <a
                href={FEATURED_TESTIMONIAL.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-gold hover:text-gold/80 transition-colors"
              >
                See {FEATURED_TESTIMONIAL.projectName}
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

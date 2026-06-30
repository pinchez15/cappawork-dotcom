"use client";

import { ArrowRight, ExternalLink } from "lucide-react";
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper";
import {
  FEATURED_TESTIMONIAL,
  PORTFOLIO_PROJECTS,
} from "@/lib/portfolio/data";

export default function PortfolioSection() {
  return (
    <section id="work" className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The Work
          </span>
          <div className="max-w-3xl mb-6">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white leading-tight mb-6">
              Production systems, live today.
            </h2>
            <p className="text-lg text-white/70 leading-relaxed">
              Live software in healthcare, property management, data consulting, and clinical settings.
            </p>
          </div>
          <p className="text-base text-white/50 mb-16 max-w-3xl">
            These are not mockups, pitch decks, or prototypes. They are production systems built to run real work.
          </p>
        </FadeInUp>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {PORTFOLIO_PROJECTS.map((project) => (
            <StaggerItem key={project.name}>
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-card-dark p-6 hover:border-gold/40 transition-colors"
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
                <p className="text-sm text-white/60 leading-relaxed flex-1">
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
          <div className="rounded-2xl border border-gold/30 bg-card-dark p-8 sm:p-10">
            <span className="text-xs font-semibold tracking-widest uppercase text-gold block mb-6">
              Client story
            </span>
            <blockquote className="text-lg sm:text-xl text-white/85 leading-relaxed mb-8">
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

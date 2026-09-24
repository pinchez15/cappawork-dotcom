"use client";

import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { Offering } from "@/lib/offerings/data";
import { FEATURED_TESTIMONIAL, PORTFOLIO_PROJECTS } from "@/lib/portfolio/data";
import { useInquiry } from "@/app/components/inquiry-modal";
import { GlyphKey, OrbStation } from "@/app/components/process-orb";

export function OfferingPageContent({ offering }: { offering: Offering }) {
  const { open } = useInquiry();

  return (
    <>
      <section className="pt-28 pb-16 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/#how-it-works"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            How it works
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <OrbStation kind="agent" label={offering.title} />
            <span className="text-sm font-semibold tracking-widest uppercase text-gold">
              {offering.title}
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight mb-6">
            {offering.subtitle}
          </h1>
          {offering.subtitleNote && (
            <p className="text-lg text-white/70 leading-relaxed">{offering.subtitleNote}</p>
          )}
          <GlyphKey tone="dark" className="mt-8" />
        </div>
      </section>

      <section className="py-16 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
            Outcome
          </span>
          <p className="font-display text-2xl sm:text-3xl text-navy leading-snug">
            {offering.outcome}
          </p>
        </div>
      </section>

      {offering.tiers && (
        <section className="py-16 bg-card-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-8">
              {offering.tiers.length === 2 ? "Two ways to engage" : "Ways to engage"}
            </span>
            <div className="space-y-6">
              {offering.tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="rounded-2xl border border-card-border bg-warm-white p-8"
                >
                  <h3 className="font-display text-xl text-navy mb-4">{tier.name}</h3>
                  <p className="text-sm text-stone-500 mb-4">{tier.timeline}</p>
                  <p className="text-stone-600 leading-relaxed">{tier.bestFor}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {offering.phases && (
        <section className="py-16 bg-card-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-8">
              How it unfolds
            </span>
            <div className="space-y-8">
              {offering.phases.map((phase) => (
                <div key={phase.range} className="flex gap-6">
                  <span className="mt-1 shrink-0">
                    <OrbStation kind="agent" label={phase.title} />
                  </span>
                  <span className="flex-shrink-0 inline-block bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full h-fit whitespace-nowrap">
                    {phase.range}
                  </span>
                  <div>
                    <h3 className="font-display text-xl text-navy mb-2">{phase.title}</h3>
                    <p className="text-stone-600 leading-relaxed">{phase.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-16 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-8">
            How it works
          </span>
          <div className="divide-y divide-card-border border-t border-card-border">
            {offering.howItWorks.map((item) => (
              <div key={item.label} className="flex items-start gap-3 py-5 text-base leading-relaxed text-stone-600">
                <span className="mt-1.5">
                  <OrbStation kind="agent" label={item.label} />
                </span>
                <div>
                  <strong className="font-semibold text-navy">{item.label}</strong>{" "}
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-8">
            What you get
          </span>
          <ul className="space-y-3">
            {offering.deliverables.map((item) => (
              <li key={item} className="flex items-start gap-3 text-stone-600 leading-relaxed">
                <span className="mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {offering.proof && (
        <section className="py-16 bg-warm-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-8">
              Recent build
            </span>
            <div className="rounded-2xl border border-gold/30 bg-card-light p-8 space-y-6">
              {offering.proof.filter((item) => !item.stat.includes("$") && !item.label.includes("$")).map((item) => (
                <div
                  key={item.stat}
                  className="border-b border-card-border last:border-0 pb-6 last:pb-0"
                >
                  <span className="font-display text-3xl text-gold block mb-1">{item.stat}</span>
                  <p className="text-stone-600 leading-relaxed">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {offering.slug === "build" && (
        <section className="py-16 bg-card-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-8">
              More live systems
            </span>
            <div className="grid gap-4 sm:grid-cols-2">
              {PORTFOLIO_PROJECTS.map((project) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-2xl border border-card-border bg-warm-white p-6 hover:border-gold/40 transition-colors"
                >
                  <span className="text-xs font-semibold tracking-widest uppercase text-gold block mb-2">
                    {project.industry}
                  </span>
                  <h3 className="font-display text-lg text-navy mb-2 group-hover:text-gold transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">{project.description}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {(offering.pricingFaq) && (
        <section className="py-16 bg-card-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
              How does pricing work?
            </span>
            <p className="text-lg text-stone-600 leading-relaxed">
              {offering.pricingFaq}
            </p>
          </div>
        </section>
      )}

      {offering.billing && (
        <section className="py-16 bg-warm-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
              Billing
            </span>
            <p className="text-lg text-stone-600 leading-relaxed">{offering.billing}</p>
          </div>
        </section>
      )}

      {offering.guarantee && (
        <section className="py-16 bg-card-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
              12-month guarantee
            </span>
            <p className="text-lg text-stone-600 leading-relaxed">{offering.guarantee}</p>
          </div>
        </section>
      )}

      {offering.afterEngagement && (
        <section className="py-16 bg-warm-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
              After week 6
            </span>
            <p className="text-lg text-stone-600 leading-relaxed">{offering.afterEngagement}</p>
            {offering.slug === "transformation" && (
              <Link
                href="/modernize"
                className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-navy hover:text-gold transition-colors"
              >
                See the Modernize retainer
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </section>
      )}

      <section className="py-16 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-6">
            This is for you if
          </span>
          <p className="text-lg text-white/80 leading-relaxed">{offering.whoBlock}</p>
        </div>
      </section>

      {(offering.slug === "discover" || offering.slug === "build") && (
        <section className="py-16 bg-card-light">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-6">
              What clients say
            </span>
            <blockquote className="text-lg text-navy leading-relaxed mb-6">
              &ldquo;{FEATURED_TESTIMONIAL.quote}&rdquo;
            </blockquote>
            <p className="text-sm text-stone-500">
              {FEATURED_TESTIMONIAL.name}, {FEATURED_TESTIMONIAL.title}, {FEATURED_TESTIMONIAL.company} ·{" "}
              <a
                href={FEATURED_TESTIMONIAL.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold hover:text-gold/80"
              >
                {FEATURED_TESTIMONIAL.projectName}
              </a>
            </p>
          </div>
        </section>
      )}

      <section className="py-16 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gold/30 bg-card-light p-8">
            <div className="mb-4 flex items-center gap-3">
              <OrbStation kind="agent" label="Computer work" />
              <OrbStation kind="human" label="Human work" />
            </div>
            <p className="font-display text-xl sm:text-2xl text-navy leading-snug">
              Let computers do the computer work, so your team can do the human work.
            </p>
            <p className="mt-4 text-stone-600 leading-relaxed">
              Every {offering.title} engagement frees your people for judgment, relationships, and decisions.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <OrbStation kind="human" label="Discovery call" />
          </div>
          <button
            onClick={() => open(offering.inquiryKey)}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Book a Discovery Call
            <ArrowRight size={18} />
          </button>
          <p className="mt-4 text-sm text-stone-500">
            A working session on how the operation runs, and where a change would matter first.
          </p>

          <p className="mt-10 pt-8 border-t border-card-border text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">All sales are final.</strong>{" "}
            {offering.termsNote} See our{" "}
            <Link href="/fulfillment-policy" className="underline hover:text-navy">
              fulfillment policy
            </Link>{" "}
            for full details.
          </p>
        </div>
      </section>

      {(offering.journeyPrev || offering.journeyNext) && (
        <section className="py-12 bg-navy border-t border-white/10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-6">
              The journey
            </p>
            <div className="flex flex-wrap gap-4 justify-between">
              {offering.journeyPrev ? (
                <Link
                  href={offering.journeyPrev.href}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  {offering.journeyPrev.label}
                </Link>
              ) : (
                <span />
              )}
              {offering.journeyNext && (
                <Link
                  href={offering.journeyNext.href}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                >
                  {offering.journeyNext.label}
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

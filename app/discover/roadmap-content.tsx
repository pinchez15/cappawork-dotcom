"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FEATURED_TESTIMONIAL } from "@/lib/portfolio/data";
import { useInquiry } from "@/app/components/inquiry-modal";
import { GlyphKey, OrbStation } from "@/app/components/glyphs";

const INQUIRY_KEY = "Discover";

// Pain, asked. Each line is a question the reader answers for themselves.
const QUESTIONS = [
  "Have you sat through AI demos from three vendors this year and still can't say which one would pay for itself?",
  "Is your team already using ChatGPT or Claude on their own, with no shared rules for what goes in and what comes out?",
  "When your partners, board or lender ask what the AI plan is, is there a written answer you can hand them?",
  "How many days does a quote take from request to send? Is that longer than your customer wants to wait?",
  "Is someone senior spending part of every Friday building the weekly report by hand?",
  "How many of your best people are retyping numbers from one system into another?",
  "If you bought the wrong tool this quarter, how long would it take to find out, and what would that year cost?",
];

const STACK = [
  {
    title: "A 1-hour discovery call.",
    body: "With the founder or a CappaWork executive. We walk through how work moves from request to invoice and where it slows down.",
  },
  {
    title: "About 10 hours of analysis.",
    body: "We work through your intake form and sample documents and trace where the hours go.",
  },
  {
    title: "A written roadmap of your 5 to 10 best AI opportunities.",
    body: "Ranked by impact and effort. Each one lists next steps, tool options, the data it needs, rough build effort, and an estimated productivity or profit range with the assumptions shown.",
  },
  {
    title: "Quick wins for this month.",
    body: "Changes your team can start with the tools you already pay for.",
  },
  {
    title: "A 45-minute walkthrough with your team.",
    body: "We take the roadmap through with you and the people who run the work, and answer questions on the spot.",
  },
];

const TIMELINE = [
  { when: "Day 0", what: "Pay $1,500 by invoice or card. Payment is due before the discovery call." },
  { when: "Within 5 business days", what: "Send the intake form and 3 sample documents, for example a recent quote, a drawing set and a weekly report." },
  { when: "Discovery call", what: "One hour with the person who makes the decision." },
  { when: "1 to 2 weeks later", what: "The roadmap arrives, and we hold the 45-minute walkthrough with the person who owns the workflow." },
];

const TERMS = [
  "Send the intake form and 3 sample documents within 5 business days of paying.",
  "Bring the decision-maker to the 1-hour discovery call.",
  "Bring the person who owns the workflow to the 45-minute walkthrough, for example your estimating lead.",
  "Write a short review of the roadmap and let us publish an anonymized case summary.",
];

const FAQ = [
  {
    q: "Why charge for a roadmap?",
    a: "Each one takes about 10 hours of senior analysis. The fee pays for that work, and it means both sides show up prepared. Meet the four terms and the $1,500 comes back as credit when you build.",
  },
  {
    q: "What if we never build with CappaWork?",
    a: "The roadmap is yours to keep. It is model-agnostic, so your own team or another partner can work from it.",
  },
  {
    q: "Which AI tools will you recommend?",
    a: "Whichever fit your data, your team and your budget. Each opportunity lists more than one tool option and what each would cost to run.",
  },
  {
    q: "How much of our time does it take?",
    a: "About 2 hours on calls, plus the intake form and 3 sample documents.",
  },
];

export function RoadmapContent() {
  const { open } = useInquiry();

  const cta = (
    <button
      onClick={() => open(INQUIRY_KEY)}
      className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
    >
      Request your roadmap
      <ArrowRight size={18} />
    </button>
  );

  return (
    <>
      {/* Hero: dream outcome, price, and the credit, above the fold */}
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
            <OrbStation kind="agent" label="AI Opportunity Roadmap" />
            <span className="text-sm font-semibold tracking-widest uppercase text-gold">
              The AI Opportunity Roadmap
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-tight mb-6">
            The 5 to 10 AI projects worth doing in your business, ranked and priced.
          </h1>
          <p className="text-lg text-white/70 leading-relaxed mb-8">
            One call, about 10 hours of our analysis, and a written roadmap in your hands 1 to 2 weeks later.
            $1,500, credited in full toward your build.
          </p>
          {cta}
          <GlyphKey tone="dark" className="mt-10" />
        </div>
      </section>

      {/* Pain, asked as questions */}
      <section className="py-16 sm:py-24 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
            A few questions
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-10">
            Does any of this sound like your business?
          </h2>
          <ul className="divide-y divide-card-border border-t border-b border-card-border">
            {QUESTIONS.map((q) => (
              <li key={q} className="py-5 text-lg text-stone-700 leading-relaxed">
                {q}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-stone-600 leading-relaxed">
            If two or more of these are a yes, the roadmap was built for you.
          </p>
        </div>
      </section>

      {/* Value stack */}
      <section className="py-16 sm:py-24 bg-card-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
            What you get
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-10">
            Everything in the roadmap
          </h2>
          <div className="space-y-4">
            {STACK.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-card-border bg-warm-white p-6 sm:p-8"
              >
                <span className="mt-1.5 shrink-0">
                  <OrbStation kind="agent" label={item.title} />
                </span>
                <div>
                  <h3 className="font-display text-xl text-navy mb-2">{item.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-stone-600 leading-relaxed">
            The roadmap is model-agnostic. Every recommendation is weighed on fit and cost for your business.
          </p>
        </div>
      </section>

      {/* Time delay and effort */}
      <section className="py-16 sm:py-24 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
            Timeline
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-4">
            About 2 hours of your time
          </h2>
          <p className="text-stone-600 leading-relaxed mb-10">
            Two calls, an intake form and 3 documents. We do the rest.
          </p>
          <ol className="space-y-6">
            {TIMELINE.map((step) => (
              <li key={step.when} className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                <span className="inline-block bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full h-fit w-fit whitespace-nowrap sm:mt-1">
                  {step.when}
                </span>
                <p className="text-stone-700 leading-relaxed">{step.what}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Win your money back */}
      <section className="py-16 sm:py-24 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
            Win your money back
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white leading-tight mb-6">
            The full $1,500 comes back as build credit
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-8">Do these four things and it is yours:</p>
          <ol className="space-y-4 mb-10">
            {TERMS.map((term, i) => (
              <li
                key={term}
                className="flex items-start gap-4 rounded-2xl border border-white/10 bg-card-dark p-5 sm:p-6"
              >
                <span className="font-display text-2xl text-gold leading-none shrink-0">{i + 1}</span>
                <p className="text-white/80 leading-relaxed">{term}</p>
              </li>
            ))}
          </ol>
          <div className="space-y-3 text-white/70 leading-relaxed">
            <p>The credit applies to a build signed within 60 days of the walkthrough. It comes off your first build invoices.</p>
            <p>If you decide not to build, the roadmap is still yours to keep.</p>
          </div>
        </div>
      </section>

      {/* Who it is for */}
      <section className="py-16 sm:py-24 bg-card-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-4">
            Who it is for
          </span>
          <p className="font-display text-2xl sm:text-3xl text-navy leading-snug">
            Owners and executives of businesses doing $10M or more a year, who want to know what to build
            first and what it is worth before they spend on it.
          </p>
        </div>
      </section>

      {/* Proof */}
      <section className="py-16 bg-warm-white">
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

      {/* Objections */}
      <section className="py-16 sm:py-24 bg-card-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-xs font-bold tracking-widest uppercase text-gold block mb-8">
            Questions
          </span>
          <div className="divide-y divide-card-border border-t border-b border-card-border">
            {FAQ.map((item) => (
              <div key={item.q} className="py-6">
                <h3 className="font-display text-xl text-navy mb-2">{item.q}</h3>
                <p className="text-stone-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Close */}
      <section className="py-16 sm:py-24 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gold/30 bg-card-light p-8 sm:p-10">
            <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-4">
              Know what to build first
            </h2>
            <p className="text-stone-600 leading-relaxed mb-8">
              $1,500. A written roadmap 1 to 2 weeks after your discovery call. Credited in full toward your build.
            </p>
            {cta}
            <p className="mt-4 text-sm text-stone-500">
              Tell us about the business. We reply with the intake form and an invoice.
            </p>
          </div>

          <p className="mt-10 text-xs text-stone-500 leading-relaxed">
            <strong className="text-stone-700">The $1,500 fee is non-refundable.</strong> It returns as build credit
            when the four terms above are met. See our{" "}
            <Link href="/fulfillment-policy" className="underline hover:text-navy">
              fulfillment policy
            </Link>{" "}
            for full details.
          </p>
        </div>
      </section>

      <section className="py-12 bg-navy border-t border-white/10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-gold mb-6">The journey</p>
          <div className="flex justify-end">
            <Link
              href="/build"
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              Build
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

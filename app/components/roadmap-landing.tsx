import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BOOKING_URL } from "@/lib/booking"
import { GlyphKey, OrbStation } from "@/app/components/glyphs"
import RoadmapFaq from "@/app/components/roadmap-faq"

const deliverables = [
  "The 5 to 10 best AI opportunities in your business, ranked by impact and effort",
  "Next steps for each one, covering tools, data, and rough build effort",
  "Estimated productivity or profit impact, with the math and assumptions shown",
  "Quick wins you can start this month with tools you already own",
  "A 45-minute walkthrough with your team",
]

const creditSteps = [
  "Send the intake form and 3 sample documents within 5 business days",
  "Attend the 1-hour discovery call with the decision-maker",
  "Attend the walkthrough with the person who owns the workflow",
  "Share a short review and let us write an anonymized case summary",
]

const bookingSteps = [
  {
    number: "01",
    title: "Book a call",
    body: "Schedule a short call. We confirm fit and answer questions before anything is paid.",
  },
  {
    number: "02",
    title: "A quick back-and-forth",
    body: "One or two messages to align on scope, timing, and the sample documents we will need.",
  },
  {
    number: "03",
    title: "Pay and schedule the work",
    body: "We send a payment link for the $1,500 fixed fee, then book discovery and get to work.",
  },
]

const audience = [
  "Owners, executives, and division leaders at companies with $10M+ in revenue",
  "Teams with complex quoting or bidding, or manual, knowledge-work-heavy processes",
  "Commercial building-product manufacturers whose estimators turn drawings into priced quotes",
  "Leaders who know AI matters but do not want to bet on the wrong vendor",
]

const exampleRows = [
  {
    rank: "1",
    opportunity: "Drawing to quote. Pilot AI take-off on past jobs, compare against estimator numbers, then roll out with human review.",
    impact: "Quote prep from hours to minutes; possibly 2x to 3x bids per estimator",
  },
  {
    rank: "2",
    opportunity: "RFQ intake. Auto-sort inbound bid requests and pull specs and due dates into the CRM.",
    impact: "Roughly 3 to 6 hours a week back per rep",
  },
  {
    rank: "3",
    opportunity: "PO to order entry. Read customer POs and draft ERP orders for approval.",
    impact: "Fewer re-keying errors; faster order turnaround",
  },
]

function BookCallButton({
  className = "",
  size = "default",
}: {
  className?: string
  size?: "default" | "large"
}) {
  const sizing =
    size === "large"
      ? "px-8 py-3.5 text-base sm:text-lg"
      : "px-6 py-3 text-sm"
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-gold font-medium text-navy transition-colors hover:bg-gold/90 ${sizing} ${className}`}
    >
      Book a call
      <ArrowRight size={size === "large" ? 18 : 16} aria-hidden />
    </a>
  )
}

export default function RoadmapLanding() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-8 inline-flex text-sm text-white/50 transition-colors hover:text-white"
          >
            CappaWork
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <OrbStation kind="agent" label="AI Opportunity Roadmap" />
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              AI Opportunity Roadmap
            </span>
          </div>

          <h1 className="font-display text-4xl tracking-tight text-white leading-[1.05] sm:text-5xl lg:text-6xl">
            Know exactly where AI pays off in your business.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/70 sm:text-xl">
            One hour with you. About 10 hours of our work. A prioritized,
            model-agnostic roadmap of where to apply AI, what to do first, and
            what each step could be worth. Fixed price: $1,500. Free when you
            build.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BookCallButton size="large" />
            <p className="text-sm text-white/50">
              Model-agnostic and vendor-neutral. We work for you, not for an AI
              company.
            </p>
          </div>

          <GlyphKey tone="dark" className="mt-10" />
        </div>
      </section>

      {/* Problem */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            The problem
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            You need a straight answer, not more hype.
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-stone-600">
            <p>
              Everyone is telling you to do something with AI. Vendors want to
              sell you their tool. Consultants want a six-month program.
              Meanwhile your best people still spend hours copying numbers from
              PDFs into spreadsheets, building quotes by hand, and re-keying
              orders into the ERP.
            </p>
            <p>You need answers to three questions:</p>
            <ol className="list-decimal space-y-2 pl-5">
              <li>Where in my business does AI actually make a difference?</li>
              <li>What should we do first?</li>
              <li>What is it likely to be worth?</li>
            </ol>
            <p>
              The AI Opportunity Roadmap answers all three, in writing, in about
              two weeks.
            </p>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            Who it is for
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Built for operators with real workflow weight.
          </h2>
          <ul className="mt-8 space-y-4">
            {audience.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-stone-600 leading-relaxed"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            What you get
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            A written plan you can act on.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            A 1-hour discovery call with a founder or executive, then about 10
            hours of CappaWork analysis. Delivered 1 to 2 weeks after discovery.
          </p>
          <ul className="mt-8 space-y-4">
            {deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-stone-600 leading-relaxed"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-stone-600 leading-relaxed">
            We are model-agnostic. If an off-the-shelf tool, a process change, or
            &ldquo;do not use AI here&rdquo; is the right answer, that is what
            the roadmap will say. We do not resell anyone&rsquo;s AI tools.
          </p>
        </div>
      </section>

      {/* Guarantees */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            Guarantees
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Free when you build. Refunded if we miss.
          </h2>

          <div className="mt-10 space-y-10">
            <div>
              <h3 className="font-display text-xl text-navy">
                Get your $1,500 back as build credit
              </h3>
              <p className="mt-3 text-stone-600 leading-relaxed">
                Do these four things and the full $1,500 is credited toward a
                CappaWork build signed within 60 days of the walkthrough. The
                credit comes off build invoices. It is not paid out as cash. If
                you do not build, you keep the roadmap.
              </p>
              <ol className="mt-5 list-decimal space-y-2 pl-5 text-stone-600 leading-relaxed">
                {creditSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>

            <div>
              <h3 className="font-display text-xl text-navy">
                At least 3 sized opportunities, or a full refund
              </h3>
              <p className="mt-3 text-stone-600 leading-relaxed">
                If the roadmap identifies fewer than 3 opportunities with a
                sized impact, you get a full refund.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            How it works
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Book a call. Align. Then we start.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            There is no checkout on this page. Payment comes after a short call
            confirms fit.
          </p>

          <ol className="mt-10 space-y-6">
            {bookingSteps.map((step) => (
              <li key={step.number} className="flex gap-5 sm:gap-6">
                <span className="shrink-0">
                  <OrbStation kind="agent" label={step.title} />
                </span>
                <div>
                  <div className="mb-1 flex flex-wrap items-center gap-3">
                    <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">
                      {step.number}
                    </span>
                    <h3 className="font-display text-xl text-navy">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-stone-600 leading-relaxed">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-10 text-sm leading-relaxed text-stone-500">
            After payment: discovery in week 1, about 10 hours of analysis in
            weeks 1 to 2, then the walkthrough and your written roadmap.
          </p>
        </div>
      </section>

      {/* Proof */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            Proof
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Drawing or photo to a priced quote, in minutes.
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-stone-600">
            <p>
              CappaWork built an AI bid engine that turns blueprints or job-site
              photos into a priced, code-compliant order list. The estimator
              reviews and signs off. The software does the take-off, the product
              matching, and the pricing math.
            </p>
            <p>
              That is the kind of opportunity the roadmap is built to find:
              high-skill people stuck doing repetitive work that software can
              draft for them to check.
            </p>
            <p>
              Divisions are a good place to pilot. If it works in one part of the
              company, the plan is written so the broader group can roll it out.
            </p>
          </div>
        </div>
      </section>

      {/* Example excerpt */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            Example roadmap excerpt
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            What a page of the plan can look like.
          </h2>
          <p className="mt-4 rounded-2xl border border-gold/30 bg-card-light px-4 py-3 text-sm text-stone-600">
            Example only. Hypothetical company and illustrative figures. These
            are not client results.
          </p>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-left text-sm">
              <thead>
                <tr className="border-b border-card-border text-xs font-semibold uppercase tracking-wider text-stone-500">
                  <th className="py-3 pr-4 font-semibold">Rank</th>
                  <th className="py-3 pr-4 font-semibold">
                    Opportunity and next step
                  </th>
                  <th className="py-3 font-semibold">Illustrative impact</th>
                </tr>
              </thead>
              <tbody>
                {exampleRows.map((row) => (
                  <tr
                    key={row.rank}
                    className="border-b border-card-border align-top last:border-0"
                  >
                    <td className="py-4 pr-4 font-display text-xl text-gold">
                      {row.rank}
                    </td>
                    <td className="py-4 pr-4 text-stone-700 leading-relaxed">
                      {row.opportunity}
                    </td>
                    <td className="py-4 text-stone-600 leading-relaxed">
                      {row.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-stone-500 leading-relaxed">
            Ranges depend on your volumes and data. Every estimate in your
            roadmap shows its assumptions.
          </p>
        </div>
      </section>

      {/* After the roadmap */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            After the roadmap
          </span>
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            If there is value, we can build what we find.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            At the walkthrough we can quote building the top opportunity, with
            your $1,500 credit applied. Pilot one division or workflow first.
            Nothing on this page asks you to commit to a build. The roadmap
            stands on its own.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            FAQ
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Common questions.
          </h2>
          <div className="mt-10">
            <RoadmapFaq />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 flex justify-center">
            <OrbStation kind="human" label="Book a call" />
          </div>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Get a clear plan for AI in your business.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600 leading-relaxed">
            Book a short call. We will follow up, send a payment link if it is a
            fit, and schedule the work.
          </p>
          <div className="mt-8">
            <BookCallButton size="large" />
          </div>
          <p className="mt-6 text-sm text-stone-500">
            $1,500 fixed. Free when you build. Full refund if fewer than 3 sized
            opportunities.
          </p>
        </div>
      </section>
    </>
  )
}

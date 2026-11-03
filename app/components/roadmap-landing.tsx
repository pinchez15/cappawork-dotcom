import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BOOKING_URL } from "@/lib/booking"
import { GlyphKey, OrbStation } from "@/app/components/glyphs"
import RoadmapFaq from "@/app/components/roadmap-faq"

const painGroups = [
  {
    title: "Speed and lost deals",
    items: [
      "Quotes take too long. Customers wait. Competitors answer first.",
      "Bids due Friday still sit with one estimator.",
      "The deals you chase are limited by the hours you have.",
    ],
  },
  {
    title: "People and knowledge",
    items: [
      "Your best people are stuck on busy work, not real customer work.",
      "Pricing rules live in one senior head. If they leave, you feel it.",
      "New hires take too long to get up to speed.",
    ],
  },
  {
    title: "Margin, capacity, pressure",
    items: [
      "Mispriced quotes and missed line items show up later as pain.",
      "You turn down work, or soft-pedal it, because the bench is full.",
      "A regulation or deadline means something has to get done right now.",
      "Vendors pitch AI tools. You still do not know where to start.",
    ],
  },
]

const costLines = [
  "Every slow quote is a customer deciding without you.",
  "Every hour on take-off and re-keying is an hour not spent winning work.",
  "Every process that lives in one person's head is a risk you carry alone.",
  "You already know there is more capacity in the business. You just cannot unlock it yet.",
]

const deliverables = [
  "The 5 to 10 best AI opportunities in your business, ranked by impact and effort",
  "Next steps for each one: tools, data, and rough build effort",
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
    body: "Fifteen minutes. Tell us where quotes stall, where knowledge sits with one person, and what has to move now.",
  },
  {
    number: "02",
    title: "A quick back-and-forth",
    body: "One or two messages. We align on scope, timing, and the sample documents that show how your work really runs.",
  },
  {
    number: "03",
    title: "Pay and schedule the work",
    body: "We send a payment link for the $1,500 fixed fee. Then we book discovery and get to work on your roadmap.",
  },
]

const exampleRows = [
  {
    rank: "1",
    opportunity:
      "Drawing to quote. Pilot AI take-off on past jobs, compare against estimator numbers, then roll out with human review.",
    impact:
      "Quote prep from hours to minutes; possibly 2x to 3x bids per estimator",
  },
  {
    rank: "2",
    opportunity:
      "RFQ intake. Auto-sort inbound bid requests and pull specs and due dates into the CRM.",
    impact: "Roughly 3 to 6 hours a week back per rep",
  },
  {
    rank: "3",
    opportunity:
      "PO to order entry. Read customer POs and draft ERP orders for approval.",
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
            Do your quotes take too long and competitors answer first?
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/70 sm:text-xl">
            You feel it every week. Customers wait. Knowledge sits with one
            estimator. New hires take forever to ramp. You know there is more
            capacity in the business. You need a clear plan for where AI
            actually unlocks it. Fixed price: $1,500. Free when you build.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BookCallButton size="large" />
            <p className="text-sm text-white/50">
              Stop guessing. Get a ranked plan for your bottlenecks.
            </p>
          </div>

          <GlyphKey tone="dark" className="mt-10" />
        </div>
      </section>

      {/* Sound familiar */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            Sound familiar?
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            This is what it feels like from your seat.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            Owners, executives, and division leaders at $10M+ companies that
            quote from drawings or run heavy knowledge work know these lines by
            heart.
          </p>

          <div className="mt-10 space-y-10">
            {painGroups.map((group) => (
              <div key={group.title}>
                <h3 className="font-display text-xl text-navy">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.items.map((item) => (
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
            ))}
          </div>
        </div>
      </section>

      {/* What it costs you */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            What it costs you
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            The pain is not abstract. It shows up in the business.
          </h2>
          <ul className="mt-8 space-y-4">
            {costLines.map((line) => (
              <li
                key={line}
                className="flex items-start gap-3 text-lg text-stone-600 leading-relaxed"
              >
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-stone-600 leading-relaxed">
            Hiring alone will not clear the queue for long. Another vendor demo
            will not tell you what is worth doing first. You need the bottlenecks
            named, ranked, and sized.
          </p>
        </div>
      </section>

      {/* The way out */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            The way out
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            A written roadmap for where AI pays off in your operation.
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-stone-600">
            <p>
              One hour with you. About 10 hours of our work. You get a
              model-agnostic plan for the work that is slow, risky, or stuck in
              one person&rsquo;s head.
            </p>
            <p>
              We work from your side of the table. We do not resell anyone&rsquo;s
              AI tools. If the right answer is a process change, an off-the-shelf
              tool, or &ldquo;do not use AI here,&rdquo; that is what the roadmap
              will say.
            </p>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            What you get
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Clarity on what to fix first, and what it could be worth.
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
            Built for quoting from drawings, bidding under deadline pressure, and
            other knowledge-heavy workflows where speed, margin, and key-person
            risk all collide.
          </p>
        </div>
      </section>

      {/* Guarantees */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            Guarantees
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Free when you build. Refunded if we miss.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            You should not pay $1,500 to get another vague AI slide deck. The
            offer is built to remove that risk.
          </p>

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
                sized impact, you get a full refund. No soft list. No filler.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            How it works
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Start with the bottleneck. Not a software pitch.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            There is no checkout on this page. You talk first. Payment comes
            after we confirm fit.
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
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            Proof
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            We have already attacked the drawing-to-quote bottleneck.
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-stone-600">
            <p>
              CappaWork built an AI bid engine that turns blueprints or job-site
              photos into a priced, code-compliant order list. The estimator
              reviews and signs off. The software does the take-off, the product
              matching, and the pricing math.
            </p>
            <p>
              That is the kind of pain the roadmap is built to find: high-skill
              people stuck doing repetitive work, while deals wait and knowledge
              stays trapped in a few heads.
            </p>
            <p>
              Divisions are a good place to pilot. If it works in one part of the
              company, the plan is written so the broader group can roll it out.
            </p>
          </div>
        </div>
      </section>

      {/* Example excerpt */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            Example roadmap excerpt
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Pain named. Next step written. Impact sized.
          </h2>
          <p className="mt-4 rounded-2xl border border-gold/30 bg-warm-white px-4 py-3 text-sm text-stone-600">
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
            If the pain is real and the upside is clear, we can build.
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
            Straight answers.
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
            Tired of slow quotes and busywork eating the week?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-stone-600 leading-relaxed">
            Book a short call. Tell us where the work stalls. If it is a fit, we
            send a payment link and schedule the roadmap.
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

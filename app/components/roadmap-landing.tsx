import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { BOOKING_URL } from "@/lib/booking"
import { GlyphKey, OrbStation } from "@/app/components/glyphs"
import RoadmapFaq from "@/app/components/roadmap-faq"

// Pain is asked, never told. The reader answers each one for themselves.
const painGroups = [
  {
    title: "Speed and lost deals",
    items: [
      "Do customers call twice asking where their number is?",
      "Is a bid due Friday still sitting with one estimator?",
      "Have you won the walkthrough and then lost the job on response time?",
      "Do you pick which RFQs to answer by how many hours are left in the week?",
    ],
  },
  {
    title: "People and knowledge",
    items: [
      "How much of your best people's week goes to re-keying numbers and marking up PDFs?",
      "Do your pricing rules live in one senior person's head? What happens to quoting when they take a week off?",
      "How many months does it take a new hire to quote on their own?",
    ],
  },
  {
    title: "Margin, capacity, pressure",
    items: [
      "Have mispriced quotes or missed line items come back as change orders this year?",
      "Have you turned down work because the bench was full?",
      "Is a regulation, a deadline or a parent company asking for an AI plan right now?",
      "Have AI vendors pitched you tools without telling you where to start?",
    ],
  },
]

const costQuestions = [
  "How many quotes a month go to a competitor who answered first?",
  "How many hours a week do your estimators spend on take-off and re-keying?",
  "If your most senior estimator left next month, how long would quoting take to recover?",
  "How much more work could you take on if quoting kept up with sales?",
]

const deliverables = [
  {
    title: "A 1-hour discovery call",
    body: "With a founder or executive. We walk the work from request to quote to order and mark where it slows down.",
  },
  {
    title: "About 10 hours of CappaWork analysis",
    body: "We work through your intake form and sample documents and trace where the hours go.",
  },
  {
    title: "Your 5 to 10 best AI opportunities, ranked",
    body: "Ordered by impact and effort, so you know what to do first and what to leave alone.",
  },
  {
    title: "Next steps for each one",
    body: "Tool options, the data it needs and rough build effort.",
  },
  {
    title: "A sized impact for each one",
    body: "An estimated productivity or profit range, with the math and assumptions shown.",
  },
  {
    title: "Quick wins for this month",
    body: "Changes your team can start with tools you already own.",
  },
  {
    title: "A 45-minute walkthrough with your team",
    body: "We take the roadmap through with you and the person who owns the workflow.",
  },
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
            One hour with you and about 10 hours of our analysis. In 1 to 2
            weeks you get a written, ranked plan for where AI frees up capacity
            in your business. $1,500 fixed. Free when you build.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BookCallButton size="large" />
            <p className="text-sm text-white/50">
              A 15-minute call first. You pay only after we confirm fit.
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
            Does any of this sound like your business?
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            A few questions for owners, executives and division leaders at
            $10M+ companies that quote from drawings or run heavy knowledge
            work.
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
          <p className="mt-10 text-lg leading-relaxed text-stone-600">
            If two or more of these are a yes, the roadmap is built for your
            business.
          </p>
        </div>
      </section>

      {/* What it costs you */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <span className="mb-4 block text-xs font-bold uppercase tracking-widest text-gold">
            What it costs you
          </span>
          <h2 className="font-display text-3xl tracking-tight text-navy sm:text-4xl">
            Do you know the number?
          </h2>
          <ul className="mt-8 space-y-4">
            {costQuestions.map((line) => (
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
            The roadmap puts a number on each of these for your business, with
            the assumptions shown, and ranks what to fix first.
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
              A model-agnostic plan for the work that is slow, risky or stuck in
              one person&rsquo;s head.
            </p>
            <p>
              We work from your side of the table and resell no one&rsquo;s AI
              tools. When the best answer is a process change, an off-the-shelf
              tool or leaving AI out of a step, the roadmap says so.
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
            Delivered 1 to 2 weeks after discovery.
          </p>
          <ul className="mt-8 space-y-4">
            {deliverables.map((item) => (
              <li
                key={item.title}
                className="flex items-start gap-4 rounded-2xl border border-card-border bg-warm-white p-5 sm:p-6"
              >
                <span className="mt-1.5 shrink-0">
                  <OrbStation kind="agent" label={item.title} />
                </span>
                <div>
                  <h3 className="font-display text-lg text-navy">{item.title}</h3>
                  <p className="mt-1 text-stone-600 leading-relaxed">{item.body}</p>
                </div>
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
            Two guarantees take the risk of the $1,500 off your side.
          </p>

          <div className="mt-10 space-y-10">
            <div>
              <h3 className="font-display text-xl text-navy">
                Get your $1,500 back as build credit
              </h3>
              <p className="mt-3 text-stone-600 leading-relaxed">
                Do these four things and the full $1,500 is credited toward a
                CappaWork build signed within 60 days of the walkthrough. The
                credit comes off your build invoices. If you decide not to build,
                you keep the roadmap.
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
            Three steps to start
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-stone-600">
            You talk to us first. Payment comes after we confirm fit.
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
            weeks 1 to 2, then the walkthrough and your written roadmap. Your
            time across all of it: about 2 hours on calls, plus the intake form
            and 3 sample documents.
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
            Where does the work stall in your business?
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

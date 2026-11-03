import { ArrowRight } from "lucide-react"
import { BOOKING_URL } from "@/lib/booking"
import { FEATURED_TESTIMONIAL } from "@/lib/portfolio/data"
import { GlyphKey, OrbStation } from "@/app/components/glyphs"
import RoadmapFaq from "@/app/components/roadmap-faq"

// StoryBrand order: the visitor is the hero, CappaWork is the guide.
// Written for a stranger with 20 seconds. Pain is asked, never told.

const problems = [
  "Do customers wait days for a quote?",
  "Does your pricing live in one person's head?",
  "Are your best people stuck re-keying data?",
  "Have you turned down work because the team was full?",
  "Have AI vendors pitched you without saying where to start?",
]

const plan = [
  { number: "01", title: "Book a call", body: "15 minutes. Tell us where work stalls." },
  { number: "02", title: "Get your roadmap", body: "One discovery call, then about 10 hours of our analysis." },
  { number: "03", title: "Act on it", body: "Start the quick wins. Build the big ones with us, or anyone." },
]

const deliverables = [
  "Your 5 to 10 best AI opportunities, ranked",
  "A profit range for each, with the math shown",
  "Next steps, tool options and build effort",
  "Quick wins you can start this month",
  "A 45-minute walkthrough with your team",
  "Delivered 1 to 2 weeks after discovery",
]

const exampleRows = [
  { rank: "1", opportunity: "Drawing to quote", impact: "Hours to minutes per quote" },
  { rank: "2", opportunity: "RFQ intake", impact: "3 to 6 hours a week per rep" },
  { rank: "3", opportunity: "PO to order entry", impact: "Fewer re-keying errors" },
]

function BookCallButton() {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-8 py-3.5 text-base font-medium text-navy transition-colors hover:bg-gold/90 sm:text-lg"
    >
      Book a call
      <ArrowRight size={18} aria-hidden />
    </a>
  )
}

function Eyebrow({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`mb-4 block text-xs font-bold uppercase tracking-widest text-gold ${className}`}>
      {children}
    </span>
  )
}

export default function RoadmapLanding() {
  return (
    <>
      {/* 1. What the hero wants */}
      <section className="bg-navy pt-28 pb-16 sm:pt-32 sm:pb-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex items-center gap-3">
            <OrbStation kind="agent" label="AI Opportunity Roadmap" />
            <span className="text-sm font-semibold uppercase tracking-widest text-gold">
              AI Opportunity Roadmap
            </span>
          </div>

          <h1 className="font-display text-4xl tracking-tight text-white leading-[1.05] sm:text-5xl lg:text-6xl">
            Quote faster. Win more work. Same team.
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-white/70 sm:text-xl">
            We show you exactly where AI pays off in your business. Ranked and
            priced, in about 2 weeks.
          </p>
          <p className="mt-3 text-lg font-medium text-white">$1,500. Free when you build.</p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <BookCallButton />
            <p className="text-sm text-white/50">15 minutes. No payment until we confirm fit.</p>
          </div>

          <GlyphKey tone="dark" className="mt-10" />
        </div>
      </section>

      {/* 2. The problem, asked */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Sound familiar?</Eyebrow>
          <ul className="divide-y divide-card-border border-y border-card-border">
            {problems.map((q) => (
              <li key={q} className="py-4 font-display text-xl text-navy sm:text-2xl">
                {q}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-stone-600">
            Your best people should spend their day on customers. Computers can
            do the rest.
          </p>
        </div>
      </section>

      {/* 3. The guide: empathy and authority */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Why us</Eyebrow>
          <p className="font-display text-2xl text-navy leading-snug sm:text-3xl">
            We built an AI bid engine that turns blueprints into priced order
            lists. The estimator signs off.
          </p>
          <p className="mt-4 text-stone-600">
            Model-agnostic. We resell no one&rsquo;s AI tools.
          </p>
          <blockquote className="mt-8 border-l-2 border-gold pl-5 text-stone-700 leading-relaxed">
            &ldquo;{FEATURED_TESTIMONIAL.quote}&rdquo;
            <footer className="mt-2 text-sm text-stone-500">
              {FEATURED_TESTIMONIAL.name}, {FEATURED_TESTIMONIAL.title}, {FEATURED_TESTIMONIAL.company}
            </footer>
          </blockquote>
        </div>
      </section>

      {/* 4. The plan */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>The plan</Eyebrow>
          <ol className="grid gap-4 sm:grid-cols-3">
            {plan.map((step) => (
              <li key={step.number} className="rounded-2xl border border-card-border bg-card-light p-6">
                <span className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-semibold text-navy">
                  {step.number}
                </span>
                <h3 className="mt-4 font-display text-xl text-navy">{step.title}</h3>
                <p className="mt-1 text-stone-600">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-stone-600">Your time: about 2 hours of calls.</p>
        </div>
      </section>

      {/* What the roadmap holds */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>What you get</Eyebrow>
          <ul className="grid gap-3 sm:grid-cols-2">
            {deliverables.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-card-border bg-warm-white px-5 py-4 text-stone-700"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-card-border bg-warm-white p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">Sample page</p>
            <table className="mt-3 w-full text-left text-sm sm:text-base">
              <tbody>
                {exampleRows.map((row) => (
                  <tr key={row.rank} className="border-b border-card-border last:border-0">
                    <td className="py-3 pr-4 font-display text-xl text-gold">{row.rank}</td>
                    <td className="py-3 pr-4 text-navy">{row.opportunity}</td>
                    <td className="py-3 text-stone-600">{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3 text-xs text-stone-500">Illustrative figures for a hypothetical company.</p>
          </div>
        </div>
      </section>

      {/* Risk removed */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>Guarantees</Eyebrow>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-card-dark p-6">
              <h3 className="font-display text-2xl text-white">Free when you build</h3>
              <p className="mt-2 text-white/70">
                Build with us within 60 days and the $1,500 comes off your invoice.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-card-dark p-6">
              <h3 className="font-display text-2xl text-white">Refunded if we miss</h3>
              <p className="mt-2 text-white/70">Fewer than 3 sized opportunities? Full refund.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6 and 7. Stakes, asked, and success */}
      <section className="bg-warm-white py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <Eyebrow>If nothing changes</Eyebrow>
              <p className="font-display text-2xl text-navy leading-snug">
                Where will your quote times be next year?
              </p>
            </div>
            <div>
              <Eyebrow>After the roadmap</Eyebrow>
              <p className="font-display text-2xl text-navy leading-snug">
                You know what to fix first, what it&rsquo;s worth and who should build it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-card-light py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Eyebrow>FAQ</Eyebrow>
          <RoadmapFaq />
        </div>
      </section>

      {/* 5. Call to action */}
      <section className="bg-navy py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Where does work stall in your business?
          </h2>
          <p className="mt-4 text-white/70">$1,500. Free when you build.</p>
          <div className="mt-8">
            <BookCallButton />
          </div>
        </div>
      </section>
    </>
  )
}

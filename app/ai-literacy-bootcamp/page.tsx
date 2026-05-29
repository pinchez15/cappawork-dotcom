import type { Metadata } from "next"
import Link from "next/link"
import { Check, ArrowRight } from "lucide-react"
import Footer from "../components/footer"
import CohortLeadForm from "../components/cohort-lead-form"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "AI Literacy Bootcamp | CappaWork Cohort",
  description:
    "Four weeks to strategic fluency in AI — evaluate vendors, make build-vs-buy calls, and stop nodding through AI conversations you don't actually understand. For directors, VPs, and CXOs. $1,500.",
  openGraph: {
    title: "AI Literacy Bootcamp | CappaWork Cohort",
    description:
      "Four weeks to strategic fluency in AI. Evaluate vendors, make build-vs-buy calls, and lead AI conversations with confidence.",
    type: "website",
    url: "https://cappawork.com/ai-literacy-bootcamp",
    siteName: "CappaWork",
    locale: "en_US",
  },
}

export const dynamic = "force-dynamic"

const leaveWith = [
  {
    title: "The three frameworks — as an evaluation lens.",
    body: "Profit Formula, AI Rules, Groundwork/Teamwork/Lifework. The language you use to read every AI conversation you'll be in for the next two years. When a vendor pitches you, you'll know which lever they're claiming to move.",
  },
  {
    title: "A working mental model of the AI landscape.",
    body: "How today's frontier models compare (the “GPT-5.5 vs Claude Opus 4.8” question everyone asks), agents, MCP, vertical vs horizontal, economics, governance. Not a textbook — a working map you can navigate from.",
  },
  {
    title: "A 90-day personal AI strategy.",
    body: "Do / Watch / Avoid / Revisit. Specific. Yours. Built in the final session, ready to act on Monday.",
  },
  {
    title: "A governance checklist.",
    body: "One page. The questions that matter for AI use in your company — and the ones that don't.",
  },
  {
    title: "All session recordings and materials, for 90 days.",
    body: "Including the AI Basics video library. Revisit when a vendor pitch lands and you want to re-check it against the frameworks.",
  },
  {
    title: "A network of 10–15 peers.",
    body: "People you can text when something confusing lands in your inbox and you're not sure what to think.",
  },
]

const sessions = [
  {
    title: "Session 1 — The frameworks and the model landscape",
    subtitle: "90 minutes. Foundation session.",
    intro:
      "By the end, you can evaluate any AI capability or vendor pitch through three frameworks and have a clear-eyed view of the frontier model landscape.",
    blocks: [
      ["The frameworks as an evaluation lens (35 min)", "Profit Formula, AI Rules, Groundwork/Teamwork/Lifework — deployed as a lens. When a vendor pitches you, which lever are they claiming to move? Which category of work does it unlock? Bring a real vendor pitch; we run it through all three."],
      ["The frontier model landscape (35 min)", "The honest comparison of the current frontier — Claude Opus 4.8, GPT-5.5, Gemini, and the open-source options — what each is actually best at right now, and the trap of treating them as substitutes. Then the strategic question: which platform should we standardize on?"],
      ["Discussion (20 min)", "The vendor pitches everyone brought become the working material. We learn to read AI marketing language together."],
    ],
  },
  {
    title: "Session 2 — Agents, MCP, and the new data layer",
    subtitle: "90 minutes. The most-marketed, least-understood corner of AI.",
    intro:
      "The session that prevents the most expensive enterprise mistakes of 2026 — buying an “agent platform” that doesn't work, or betting your stack on the wrong layer.",
    blocks: [
      ["What agents actually are — and how to vet one (35 min)", "The technical definition stripped of marketing — tool use, memory, planning, and verification (where most agents fail) — plus the five questions to ask any vendor selling “agents,” and an honest map of where they work today and where they don't."],
      ["MCP and the new data layer (25 min)", "What MCP is, what it unlocks, and what it disrupts. Vendors whose moat was “we integrate with X” now compete on actual product — and your data becomes addressable by AI without custom integration."],
      ["Vertical AI and your tech stack (30 min)", "Vertical vs horizontal AI — why purpose-built tools displace general ones in regulated and specialized industries, which of your current tools are at risk, and which of your data just became more valuable, or a liability, now that AI can read it."],
    ],
  },
  {
    title: "Session 3 — Economics, governance, and what to do Monday",
    subtitle: "90 minutes. The closing session that turns understanding into action.",
    intro:
      "Why some AI vendors will fail and which won't — and how to build a 90-day plan you can act on immediately.",
    blocks: [
      ["The economics of AI (25 min)", "Token economics, the unit economics of agents, the acceleration curve, and where the moats actually are (distribution, data, integration depth, trust — not the model). Be careful what you sign multi-year contracts for."],
      ["Governance and risk: what actually matters (25 min)", "What enterprises waste time on vs what actually matters — data handling, model selection, audit trails, failure modes, compliance fit. You leave with a one-page checklist."],
      ["Your personal AI strategy (30 min)", "Build your own 90-day plan across four buckets: Do, Watch, Avoid, Revisit. Specific and yours, written in real time."],
      ["What's next (10 min)", "How to stay literate as the field moves — a short list of who to follow, a monthly literacy ritual, and the alumni channel."],
    ],
  },
]

const frameworks = [
  {
    title: "The Profit Formula",
    body: (
      <>
        <p className="font-medium text-navy">Profit = Customers × AOV × Frequency × Margin</p>
        <p className="mt-3">
          Every AI capability worth caring about moves one of these. As a lens: when a vendor pitches you, which
          lever are they claiming to move? If they can't answer cleanly, they don't understand their own product —
          or you're not seeing the real claim.
        </p>
      </>
    ),
  },
  {
    title: "The AI Rules",
    body: (
      <>
        <p className="font-medium text-navy">Use AI for: Speed, Scale, Capability.</p>
        <p className="font-medium text-navy">Do not use AI for: Relationships, Truth, Joy.</p>
        <p className="mt-3">
          The rule that screens vendor claims. When someone says “AI handles your customer relationships,” that's
          not a feature — that's a warning.
        </p>
      </>
    ),
  },
  {
    title: "Groundwork, Teamwork, Lifework",
    body: (
      <>
        <p>The three categories of work. AI sits in Groundwork and Teamwork. Lifework is yours.</p>
        <p className="mt-3">
          As a lens: when a capability comes up, which category of work does it unlock? The frameworks become the
          language you use in your own meetings.
        </p>
      </>
    ),
  },
]

const faqs = [
  ["Is this the build cohort?", "No. This is the literacy cohort — it's for understanding the landscape and making better strategic decisions. If you already know what you want to build and need to ship it, take AI for Business Leaders instead. Many people take literacy first, then build."],
  ["Do I need to be technical?", "No. This is not a coding cohort — no JavaScript, no tools you have to install. It's a strategic foundation, not a tutorial."],
  ["Do you cover the latest models and tools?", "Yes — covering the current frontier is part of it. We compare the leading models head-to-head (the “GPT-5.5 vs Claude Opus 4.8” question everyone asks) and refresh the tool and vendor examples every cohort. The frameworks are what keep that comparison useful a year out — but the comparison itself is always current."],
  ["What if I miss a session?", "Every session is recorded. You'll have 90 days of access to all recordings and materials, including the AI Basics video library."],
  ["Is the curriculum current, or recycled?", "Every cohort reflects the current state of the field. Roughly 30% of the curriculum is rewritten each run — the frameworks survive, the examples don't. You're not getting what was true 12 months ago."],
  ["Are you vendor-aligned? Any sponsorships?", "No. No sponsorships, no affiliate deals, no referral fees from any AI vendor named in the curriculum. The credibility of this cohort depends entirely on independence."],
  ["Can my company buy multiple seats?", "Yes. For groups of 5 or more, reach out directly — there's an optional 30-minute onboarding call, and pricing improves with scale. Mention it on the request form or in your LinkedIn DM with Nate."],
  ["What's the refund policy?", "All sales are final. Seats are capped per cohort and reserving yours means someone else didn't get one. If you're unsure it's the right fit, that's what the LinkedIn DM with Nate is for — get to certainty before you pay."],
  ["When does the next cohort run?", "The next literacy cohort runs Wednesday June 10, Wednesday June 17, and Wednesday June 24, 2026 — 7:00 to 8:30pm ET. Request a seat and Nate will confirm your spot."],
]

const products = [
  ["KnockRecruit", "https://www.knockrecruit.io", "Recruiting platform with ranked match matrix and culture-fit scoring"],
  ["ArborKey", "https://www.arborkeysoftware.com", "Practice management for community association management businesses"],
  ["Karibu Health", "https://karibu.health", "Voice-first clinical documentation for rural Ugandan clinics"],
  ["HealthcareAIO", "https://healthcareaio.com", "AI optimization audit tool for healthcare practices"],
]

export default function AiLiteracyBootcampPage() {
  return (
    <main className="min-h-screen bg-navy font-sans">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <a href="/" className="text-xl font-display tracking-tight text-white">
            CappaWork
          </a>
          <Link
            href="#request"
            className="bg-gold text-navy text-sm font-medium px-4 py-2 rounded-full hover:bg-gold/90 transition-colors"
          >
            Request my seat
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-warm-white pt-36 pb-24 md:pt-44">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold mb-8 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            Enrolling for June
          </div>

          <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[1.1] mb-6 text-navy">
            AI Literacy Bootcamp
          </h1>
          <p className="font-display text-xl md:text-2xl text-gold mb-6">
            Stop nodding through AI conversations you don't actually understand.
          </p>
          <p className="text-sm font-medium tracking-widest uppercase text-stone-500 mb-6">
            3 sessions · 90 minutes each · $1,500
          </p>
          <p className="text-lg text-stone-600 leading-relaxed mb-10 max-w-xl mx-auto">
            For directors, VPs, and CXOs who need to be conversant in AI — because it now sits inside every
            strategic decision they make.
          </p>

          <Link
            href="#request"
            className="inline-flex items-center justify-center bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 text-lg group"
          >
            Request my seat
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-6 text-sm text-stone-500">Next cohort: Wednesdays, June 10 / 17 / 24, 2026. 7:00–8:30pm ET.</p>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-24 bg-card-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Who it's for
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-8">
            For the leader in the room who can't push back yet
          </h2>
          <p className="text-lg text-stone-600 leading-relaxed mb-8">
            You're mid-career — director, VP, CXO — and you know AI is reshaping your industry, but you're not sure
            what's real and what's noise. You're not sitting on a workflow you're ready to ship. You're sitting in a
            meeting where someone said “we should be using MCP for that” and you don't know whether to agree or push
            back.
          </p>
          <ul className="space-y-4 mb-10">
            {[
              "You need to be conversant in AI for the vendor pitch, the budget cycle, the board update, the org-design conversation",
              "You want to evaluate vendors and make build-vs-buy calls with confidence",
              "You want clarity from someone who builds with these tools every day — not a theorist",
              "You want a straight answer when someone asks “GPT-5.5 or Claude Opus 4.8?” — what's actually best right now, and why",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-stone-700">
                <Check size={20} className="text-gold shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Positioning callout */}
          <div className="rounded-2xl border border-gold/30 bg-warm-white p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-gold mb-3">Which cohort?</p>
            <div className="space-y-3 text-stone-700">
              <p>
                <span className="font-medium text-navy">Don't know what to build yet?</span> Want to understand the
                landscape and make better strategic decisions? This is the one.
              </p>
              <p>
                <span className="font-medium text-navy">Already know what you want to build?</span> Need the
                frameworks and patterns to ship it? Take{" "}
                <Link href="/ai-for-business-leaders" className="text-gold hover:text-gold/80 underline">
                  AI for Business Leaders
                </Link>{" "}
                instead.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What you'll leave with */}
      <section className="py-24 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The outcome
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white leading-tight mb-12">
            What you'll leave with
          </h2>
          <div className="space-y-8">
            {leaveWith.map((item, i) => (
              <div key={i} className="flex gap-5">
                <div className="shrink-0 w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center font-semibold text-sm">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-white/70 leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The four sessions */}
      <section className="py-24 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The curriculum
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-3">
            Three sessions, one month
          </h2>
          <p className="text-lg text-stone-600 mb-10">90 minutes each, once a week.</p>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {sessions.map((session, i) => (
              <AccordionItem
                key={i}
                value={`session-${i}`}
                className="bg-card-light border border-card-border rounded-xl px-6"
              >
                <AccordionTrigger className="hover:no-underline py-6 text-left font-display text-lg text-navy">
                  {session.title}
                </AccordionTrigger>
                <AccordionContent className="pb-6">
                  <p className="text-sm font-medium text-stone-500 mb-2">{session.subtitle}</p>
                  <p className="text-stone-600 mb-6">{session.intro}</p>
                  <ul className="space-y-4">
                    {session.blocks.map(([label, body], j) => (
                      <li key={j} className="border-l-2 border-gold/50 pl-4">
                        <span className="font-medium text-navy">{label}.</span>{" "}
                        <span className="text-stone-600">{body}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* The frameworks as a lens */}
      <section className="py-24 bg-card-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The differentiator
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-3">
            The frameworks as an evaluation lens
          </h2>
          <p className="text-lg text-stone-600 mb-10">
            The same three frameworks from the build cohort — here, the language you use to read every AI pitch.
          </p>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {frameworks.map((fw, i) => (
              <AccordionItem
                key={i}
                value={`framework-${i}`}
                className="bg-warm-white border border-card-border rounded-xl px-6"
              >
                <AccordionTrigger className="hover:no-underline py-6 text-left font-display text-lg text-navy">
                  {fw.title}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-stone-600 leading-relaxed">
                  {fw.body}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* About Nate */}
      <section className="py-24 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Your instructor
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white mb-8">About Nate</h2>
          <p className="text-lg text-white/70 leading-relaxed mb-10">
            I'm Nate Pinches. I run CappaWork, an AI development agency that builds and ships production software for founder-led businesses.
          </p>

          <h3 className="text-sm font-semibold uppercase tracking-widest text-gold mb-4">
            Background that matters for this cohort
          </h3>
          <ul className="space-y-3 mb-10 text-white/70">
            <li className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" /><span>MBA + 4 years in management consulting</span></li>
            <li className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" /><span>C-suite strategy at companies up to $2B+ in revenue, including Michaels</span></li>
            <li className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" /><span>Product development at CVS Health (corporate strategy, a $4B subsidiary, 10K institutional customers)</span></li>
            <li className="flex items-start gap-3"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold shrink-0" /><span>A hands-on builder, not a theorist — the production AI products below are ones I've designed and shipped.</span></li>
          </ul>

          <h3 className="text-sm font-semibold uppercase tracking-widest text-gold mb-4">
            Products I've built with these patterns
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {products.map(([name, url, desc]) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-xl bg-card-dark border border-white/10 p-5 hover:border-gold/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-display text-lg text-white">{name}</span>
                  <ArrowRight size={16} className="text-white/40 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-sm text-white/60">{desc}</p>
              </a>
            ))}
          </div>
          <p className="mt-8 text-sm text-white/50">
            More on me:{" "}
            <a href="https://natepinches.com" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold/80 underline">
              natepinches.com
            </a>
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy mb-10 text-center">
            Common Questions
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map(([q, a], i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-card-light border border-card-border rounded-xl px-6"
              >
                <AccordionTrigger className="hover:no-underline py-6 text-left font-medium text-navy">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-stone-600 text-base leading-relaxed">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA / request form */}
      <section id="request" className="py-24 bg-navy scroll-mt-20">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white mb-3 text-center">
            Get strategically fluent.
          </h2>
          <p className="text-white/70 mb-8 text-center leading-relaxed">
            Drop your LinkedIn and email. Nate will be in touch within 24 hours to see if you qualify for this
            cohort.
          </p>
          <div className="bg-warm-white rounded-3xl shadow-xl p-8 sm:p-10">
            <CohortLeadForm cohortType="literacy" />
          </div>
          <p className="mt-6 text-center text-sm text-white/40">
            Cohorts run with 10–15 people. Next cohort: Wednesdays, June 10 / 17 / 24, 2026. 7:00–8:30pm ET.
          </p>
          <p className="mt-4 text-center text-sm text-white/60">
            Already know what you want to build?{" "}
            <Link href="/ai-for-business-leaders" className="text-gold hover:text-gold/80 underline">
              Check out AI for Business Leaders →
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

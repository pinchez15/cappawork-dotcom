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
  title: "AI for Business Leaders | CappaWork Cohort",
  description:
    "Ship one AI workflow that moves your business — in one month. A 3-session cohort for directors, VPs, and CXOs. Frameworks first, then build. $2,500.",
  openGraph: {
    title: "AI for Business Leaders | CappaWork Cohort",
    description:
      "Ship one AI workflow that moves your business — in one month. A 3-session cohort for directors, VPs, and CXOs.",
    type: "website",
    url: "https://cappawork.com/ai-for-business-leaders",
    siteName: "CappaWork",
    locale: "en_US",
  },
}

export const dynamic = "force-dynamic"

const leaveWith = [
  {
    title: "A working AI agent — not just a plan.",
    body: "You leave with a functioning agent built around your real workflow, dialed in through dedicated one-on-one time with Nate. The cohort isn't finished until yours works.",
  },
  {
    title: "Two build patterns you can reuse forever.",
    body: "Claude Projects / Custom GPTs (for judgment work) and connected automations (for repetitive work). Even if you only build one this month, you know the other.",
  },
  {
    title: "Three frameworks that outlast any tool.",
    body: "The Profit Formula, the AI Rules, and Groundwork/Teamwork/Lifework. The questions you'll ask before you build anything with AI for the rest of your career.",
  },
  {
    title: "All session recordings and materials, for 90 days.",
    body: "Watch on Tuesday afternoon when you're actually building. Share with team members who couldn't make the live sessions.",
  },
  {
    title: "An AI Basics video library.",
    body: "Permanent access. Useful for onboarding your team after the cohort.",
  },
  {
    title: "A network of 10–15 peers.",
    body: "Doing the same work in adjacent roles.",
  },
]

const sessions = [
  {
    title: "Session 1 — What should you build?",
    subtitle: "90 minutes. Frameworks first. No tools opened.",
    intro:
      "The most important session of the three. By the end, you've chosen one workflow to build and you know exactly why it's the right one.",
    blocks: [
      ["The Profit Formula (20 min)", "Profit = Customers × AOV × Frequency × Margin. Every AI workflow worth building moves one of these four levers. If it doesn't, don't build it."],
      ["The AI Rules (20 min)", "Use AI for Speed, Scale, Capability. Do not use AI for Relationships, Truth, Joy. The rule that prevents the most common mistake at the leader level: automating something that shouldn't be automated."],
      ["Groundwork, Teamwork, Lifework (25 min)", "Three categories of work in every role. Groundwork — what AI does for you. Teamwork — what AI does with you. Lifework — what only you can do. This determines how you'll build, not just whether you'll build."],
      ["Pick your build (25 min)", "Each participant declares the workflow they're building. The room hears 15 different workflows, which is its own education."],
    ],
  },
  {
    title: "Session 2 — How to build it: Claude Projects and Custom GPTs",
    subtitle: "90 minutes. How-to walkthrough plus open troubleshooting.",
    intro:
      "The Teamwork build pattern. Where AI is your coach, not your agent. The right target for most directors and VPs because most of your hard tasks are judgment-heavy: drafting, analyzing, deciding.",
    blocks: [
      ["The anatomy of a Project (25 min)", "The four components — system instructions, knowledge files, custom instructions, the user prompt — with bad and good examples side by side."],
      ["Live build, end-to-end (35 min)", "Nate builds a complete Project in front of the cohort. v1 to v2 to v3. The point isn't the Project — it's watching how a builder thinks about iteration."],
      ["Open troubleshooting (30 min)", "Each participant gets 2–3 minutes to raise their workflow against what they just saw. The room hears every diagnosis."],
    ],
  },
  {
    title: "Session 3 — How to build it: Automations and Connectors",
    subtitle: "90 minutes. How-to walkthrough plus open troubleshooting.",
    intro:
      "The Groundwork build pattern. Where AI produces an artifact without a human in the loop. Email triage, document summarization, CRM enrichment — the work AI does for you.",
    blocks: [
      ["When Groundwork is the right answer (15 min)", "The decision rule: same input shape every time? Predictable output? That's a Groundwork workflow. Requires judgment that changes per case? Stay in Teamwork."],
      ["Live build with a connector (35 min)", "Claude with Gmail or Drive, or Claude with Zapier/Make. Auth, the batch-processing prompt pattern, the human-in-the-loop checkpoint, failure handling."],
      ["Troubleshooting and ship declarations (30 min)", "Open Q&A on your Project from session 2, then each participant declares their workflow, profit lever, and ship date."],
      ["What's next (10 min)", "How to keep using the frameworks after the cohort ends."],
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
          Four levers. Every business runs on them. Every AI workflow worth building moves one of them.
        </p>
        <p className="mt-3">
          Shiny object syndrome is more dangerous with AI than with any prior technology, because the cost of
          building has collapsed from dollars to hours. The only filter that survives this collapse is whether
          the workflow moves a profit lever. If it doesn't, you're not building — you're playing.
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
        <p className="mt-3">AI does the work that produces the artifact. Humans do the work that signs the artifact.</p>
        <p className="mt-3">
          AI for any communication whose recipient is a market. Humans for any communication whose recipient is a
          person you know by name. This rule prevents the most expensive mistake leaders make with AI — automating
          something that should not be automated, just because it can be.
        </p>
      </>
    ),
  },
  {
    title: "Groundwork, Teamwork, Lifework",
    body: (
      <>
        <p>Three categories of work in any role.</p>
        <ul className="mt-3 space-y-2">
          <li><span className="font-medium text-navy">Groundwork</span> — what AI does for you. Reconciliation, enrichment, drafting, summarization. The work that has to get done but doesn't have your name on it.</li>
          <li><span className="font-medium text-navy">Teamwork</span> — what AI does with you. AI offers three options; you take the at-bat. Strategy, analysis, judgment calls where you keep the pen.</li>
          <li><span className="font-medium text-navy">Lifework</span> — what only you can do. The signature, the hard conversation, the testimony. The work where the recipient is a person, not a market.</li>
        </ul>
        <p className="mt-3">
          If the whole task is Lifework, AI doesn't belong there. If it's Groundwork, build an automation. If it's
          Teamwork, build a Project.
        </p>
      </>
    ),
  },
]

const faqs = [
  ["Do I need to be technical?", "No. There's no code in this cohort. If you can use Gmail and a web browser, you can build everything we cover — and Nate works through the technical parts with you one-on-one."],
  ["How much one-on-one time do I get with Nate?", "A lot — it's the core of the cohort. Beyond the live group sessions, you work directly with Nate to dial in your specific workflow: scoping it, building the agent, and debugging it until it runs. The group sessions teach the patterns; the one-on-one time is where your agent actually gets built."],
  ["What if I miss a session?", "Every session is recorded. You'll have 90 days of access to all recordings, materials, and the AI Basics video library. Most participants miss at least one live session; the cohort is built for that."],
  ["Will I actually leave with a working agent?", "Yes — that's the whole point. This isn't a lecture series. You get a lot of one-on-one time with Nate to dial in your specific workflow, and we keep building and debugging until your agent actually works. You leave with a functioning agent, not a plan to build one — the 90-day access is for refining it afterward, not finishing it."],
  ["Can my company buy multiple seats?", "Yes. For groups of 5 or more, reach out directly — pricing improves with scale. Mention it on the request form or in your LinkedIn DM with Nate."],
  ["What tools will I use?", "Primarily Claude (Pro or Team). For automations, we'll cover native connectors and Zapier/Make. If your company is standardized on ChatGPT, the patterns transfer — Custom GPTs are functionally equivalent to Claude Projects for cohort purposes."],
  ["What's the refund policy?", "No refunds. Seats are capped at 15 per cohort and reserving yours means someone else didn't get one. If you're not sure this is the right fit, that's what the LinkedIn DM with Nate is for — get to certainty before you pay."],
  ["When does the next cohort run?", "The next cohort runs Tuesday June 9, Tuesday June 16, and Tuesday June 23, 2026 — 7:00 to 8:30pm ET. If the dates don't work, request a seat anyway and note it — we'll let you know when the next cohort fits."],
  ["How does the “request a seat” process work?", "You drop your LinkedIn and email on the request form. Nate reviews and reaches out via LinkedIn DM within 24 hours to see if you're a fit. If you are, you get the checkout link. If you're not a fit, Nate will tell you why and where to look instead."],
]

const products = [
  ["KnockRecruit", "https://www.knockrecruit.io", "Recruiting platform with ranked match matrix and culture-fit scoring"],
  ["ArborKey", "https://www.arborkeysoftware.com", "Practice management for community association management businesses"],
  ["Karibu Health", "https://karibu.health", "Voice-first clinical documentation for rural Ugandan clinics"],
  ["HealthcareAIO", "https://healthcareaio.com", "AI optimization audit tool for healthcare practices"],
]

export default function AiForBusinessLeadersPage() {
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
      <section className="bg-navy pt-36 pb-24 md:pt-44">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold mb-8 uppercase tracking-widest">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            Enrolling for June
          </div>

          <h1 className="font-display text-5xl md:text-7xl tracking-tight leading-[1.1] mb-6 text-white">
            AI for Business Leaders
          </h1>
          <p className="font-display text-xl md:text-2xl text-gold mb-6">
            Leave with a working AI agent that moves your business. In one month.
          </p>
          <p className="text-sm font-medium tracking-widest uppercase text-white/50 mb-6">
            3 sessions · 90 minutes each · $2,500
          </p>
          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-xl mx-auto">
            For directors, VPs, and CXOs who want hands-on help, not another lecture. You'll work one-on-one with Nate to dial in your workflow — and leave with a working AI agent you actually use.
          </p>

          <Link
            href="#request"
            className="inline-flex items-center justify-center bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 text-lg group"
          >
            Request my seat
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="mt-6 text-sm text-white/40">
            Next cohort: Tuesdays, June 9 / 16 / 23, 2026. 7:00–8:30pm ET.
          </p>
        </div>
      </section>

      {/* Who this is for */}
      <section className="py-24 bg-card-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Who it's for
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-10">
            This cohort is built for you if…
          </h2>
          <ul className="space-y-4 mb-12">
            {[
              "You're a director, VP, or C-suite leader at a mid-sized business",
              "You know AI is changing how work gets done, and you're done watching from the sidelines",
              "You've tried a “ChatGPT for Executives” course and left with nothing you actually use",
              "You can name three tasks in your week you'd pay $200 to never do again",
              "You want a workflow you've built, not a certificate you've collected",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-stone-700">
                <Check size={20} className="text-gold shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-gold/30 bg-warm-white p-6">
            <p className="text-stone-600 leading-relaxed">
              This cohort is <span className="font-medium text-navy">not</span> for you if you're looking for a tour
              of every AI tool on the market, or if you want to learn to code, or if you need a 12-week immersion.
              This is fast, focused, and ends with one thing shipped.
            </p>
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

      {/* The three sessions */}
      <section className="py-24 bg-warm-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The curriculum
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-3">
            Three sessions, one month
          </h2>
          <p className="text-lg text-stone-600 mb-10">90 minutes each, once a week — plus dedicated one-on-one time with Nate to get your agent working.</p>
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

      {/* The three frameworks */}
      <section className="py-24 bg-card-light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            The differentiator
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-navy leading-tight mb-3">
            The three frameworks
          </h2>
          <p className="text-lg text-stone-600 mb-10">The questions you'll ask before building anything with AI.</p>
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

          <div className="rounded-2xl bg-card-dark border border-white/10 p-6 mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-gold mb-3">
              A profitability case I'm proud of
            </h3>
            <p className="text-white/80 leading-relaxed">
              I worked with a founder whose business was doing $1.5M in revenue and $45K in profit. One year later
              — $1.8M in revenue and $225K in profit. That's a 5x profit improvement on a 20% revenue lift. The
              frameworks I teach in this cohort are the same frameworks I used with that founder.
            </p>
          </div>

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
            Ready to build?
          </h2>
          <p className="text-white/70 mb-8 text-center leading-relaxed">
            Drop your LinkedIn and email. Nate will be in touch within 24 hours to see if you qualify for this
            cohort.
          </p>
          <div className="bg-warm-white rounded-3xl shadow-xl p-8 sm:p-10">
            <CohortLeadForm cohortType="build" />
          </div>
          <p className="mt-6 text-center text-sm text-white/40">
            Limited to 15 seats per cohort. Next cohort: Tuesdays, June 9 / 16 / 23, 2026. 7:00–8:30pm ET.
          </p>
          <p className="mt-4 text-center text-sm text-white/60">
            Not sure where to build yet?{" "}
            <Link href="/ai-literacy-bootcamp" className="text-gold hover:text-gold/80 underline">
              Start with the AI Literacy Bootcamp →
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}

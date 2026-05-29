import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"
import Footer from "../components/footer"

export const metadata: Metadata = {
  title: "AI Cohorts for Business Leaders | CappaWork",
  description:
    "Two live cohorts to make you genuinely effective with AI. AI Literacy Bootcamp for strategic fluency, AI for Business Leaders to ship a real workflow. $1,500 each.",
  openGraph: {
    title: "AI Cohorts for Business Leaders | CappaWork",
    description:
      "Two live cohorts to make you genuinely effective with AI — whether you're deciding what to build or shipping it yourself.",
    type: "website",
    url: "https://cappawork.com/cohorts",
    siteName: "CappaWork",
    locale: "en_US",
  },
}

export const dynamic = "force-dynamic"

const cohorts = [
  {
    href: "/ai-for-business-leaders",
    badge: "Enrolling for June",
    eyebrow: "Take this when you know what you want to build",
    title: "AI for Business Leaders",
    tagline: "Ship one AI workflow that moves your business — in one month.",
    meta: "3 sessions · 90 min each · $1,500",
    bullets: [
      "Frameworks to pick the one workflow worth building",
      "Claude Projects & Custom GPTs for judgment work",
      "Automations & connectors for repetitive work",
      "Leave with a shipped workflow + 90 days of recordings",
    ],
    cta: "Explore the cohort",
  },
  {
    href: "/ai-literacy-bootcamp",
    badge: "Enrolling for July",
    eyebrow: "Start here if you're not sure what to build",
    title: "AI Literacy Bootcamp",
    tagline: "Get strategically fluent — and stop nodding through AI conversations you don't understand.",
    meta: "4 sessions · 90 min each · $1,500",
    bullets: [
      "The three frameworks as a vendor-evaluation lens",
      "The model landscape, agents, and MCP — demystified",
      "A 90-day personal AI strategy: Do / Watch / Avoid / Revisit",
      "A one-page governance checklist + 90 days of recordings",
    ],
    cta: "Explore the bootcamp",
  },
]

export default function CohortsIndexPage() {
  return (
    <main className="min-h-screen bg-navy font-sans">
      {/* Minimal nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <a href="/" className="text-xl font-display tracking-tight text-white">
            CappaWork
          </a>
          <Link
            href="/contact"
            className="bg-gold text-navy text-sm font-medium px-4 py-2 rounded-full hover:bg-gold/90 transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-navy pt-36 pb-16 md:pt-44">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-6">
            Live cohorts
          </span>
          <h1 className="font-display text-4xl sm:text-6xl tracking-tight leading-[1.1] mb-6 text-white">
            AI training for business leaders
          </h1>
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
            Two live cohorts. One goal: make you genuinely effective with AI — whether you're deciding what to build
            or shipping it yourself.
          </p>
        </div>
      </section>

      {/* Cohort cards */}
      <section className="py-20 bg-card-light">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {cohorts.map((c) => (
              <div
                key={c.href}
                className="flex flex-col rounded-3xl border border-card-border bg-warm-white p-8 shadow-sm transition-all hover:border-gold/40 hover:shadow-lg"
              >
                <div className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold mb-6 uppercase tracking-widest">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
                  </span>
                  {c.badge}
                </div>

                <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">{c.eyebrow}</p>
                <h2 className="font-display text-2xl tracking-tight text-navy mb-3">{c.title}</h2>
                <p className="text-stone-600 leading-relaxed mb-4">{c.tagline}</p>
                <p className="text-xs font-medium uppercase tracking-widest text-stone-500 mb-6">{c.meta}</p>

                <ul className="space-y-3 mb-8">
                  {c.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-700">
                      <Check size={18} className="text-gold shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={c.href}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-gold px-6 py-3 font-medium text-navy transition-all hover:bg-gold/90 group"
                >
                  {c.cta}
                  <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Which one? */}
      <section className="py-20 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-white mb-8 text-center">
            Which one is right for me?
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-card-dark p-6">
              <p className="text-white/80">
                <span className="font-medium text-white">Don't know what to build yet?</span> Want to understand the
                landscape and make better strategic decisions?{" "}
                <Link href="/ai-literacy-bootcamp" className="text-gold hover:text-gold/80 underline">
                  Start with the AI Literacy Bootcamp.
                </Link>
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-card-dark p-6">
              <p className="text-white/80">
                <span className="font-medium text-white">Know what you want to build?</span> Need the frameworks and
                patterns to ship it?{" "}
                <Link href="/ai-for-business-leaders" className="text-gold hover:text-gold/80 underline">
                  Take AI for Business Leaders.
                </Link>
              </p>
            </div>
            <p className="text-center text-sm text-white/50 pt-2">
              Many leaders take literacy first, then build. Graduates get a discount on their second cohort.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

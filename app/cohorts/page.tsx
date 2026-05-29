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
    <main className="min-h-screen bg-white">
      {/* Minimal nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <a href="/" className="text-xl font-semibold tracking-tight text-stone-900">
            CappaWork
          </a>
          <Link href="/contact" className="text-sm font-medium text-stone-600 hover:text-stone-900">
            Get in touch
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 md:pt-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-stone-900">
            AI training for business leaders
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto">
            Two live cohorts. One goal: make you genuinely effective with AI — whether you're deciding what to build
            or shipping it yourself.
          </p>
        </div>
      </section>

      {/* Cohort cards */}
      <section className="pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {cohorts.map((c) => (
              <div
                key={c.href}
                className="flex flex-col rounded-3xl border border-stone-200 bg-white p-8 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
              >
                <div className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs font-medium mb-6 uppercase tracking-wide">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  {c.badge}
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-2">
                  {c.eyebrow}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight text-stone-900 mb-3">{c.title}</h2>
                <p className="text-stone-600 leading-relaxed mb-4">{c.tagline}</p>
                <p className="text-sm font-medium text-stone-500 mb-6">{c.meta}</p>

                <ul className="space-y-3 mb-8">
                  {c.bullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-3 text-stone-700">
                      <Check size={18} className="text-green-500 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={c.href}
                  className="mt-auto inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 font-medium text-white transition-all hover:bg-blue-700 hover:scale-[1.02] group"
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
      <section className="py-20 bg-stone-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 mb-8 text-center">
            Which one is right for me?
          </h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-stone-700">
                <span className="font-medium text-stone-900">Don't know what to build yet?</span> Want to understand
                the landscape and make better strategic decisions?{" "}
                <Link href="/ai-literacy-bootcamp" className="text-blue-600 hover:text-blue-700 underline">
                  Start with the AI Literacy Bootcamp.
                </Link>
              </p>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-6">
              <p className="text-stone-700">
                <span className="font-medium text-stone-900">Know what you want to build?</span> Need the frameworks
                and patterns to ship it?{" "}
                <Link href="/ai-for-business-leaders" className="text-blue-600 hover:text-blue-700 underline">
                  Take AI for Business Leaders.
                </Link>
              </p>
            </div>
            <p className="text-center text-sm text-stone-500 pt-2">
              Many leaders take literacy first, then build. Graduates get a discount on their second cohort.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

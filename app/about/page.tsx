import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import Image from "next/image"
import Link from "next/link"
import MarketingShell from "../components/marketing-shell"
import { GlyphKey, OrbStation } from "../components/glyphs"
import { FOUNDER_CAREER } from "../components/founder-section"

export const metadata: Metadata = {
  title: "About | CappaWork",
  description:
    "Nate Pinches built CappaWork after a career inside healthcare: clinical research, the FDA, and a CVS Health pharmacy. The embedded product team for healthcare and life sciences.",
}

export default function AboutPage() {
  return (
    <MarketingShell>
    <main className="min-h-screen bg-warm-white">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlyphKey className="mb-8" />
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-navy mb-12">
            About CappaWork
          </h1>

          <div className="mb-10 pb-10 border-b border-card-border">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <Image
                  src="/nate-headshot.png"
                  alt="Nate Pinches, founder of CappaWork"
                  width={240}
                  height={240}
                  className="rounded-2xl object-cover"
                  priority
                />
              </div>
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <OrbStation kind="human" label="Nate Pinches" />
                  <h2 className="font-display text-2xl text-navy">Nate Pinches</h2>
                </div>
                <p className="font-display text-xl text-navy mb-3">
                  From the clinic, to the FDA, to the pharmacy.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  Nate has worked inside the places healthcare work actually happens. He sets the product
                  vision with your executives, then builds it with your team.
                </p>
              </div>
            </div>
            <ul className="mt-8 divide-y divide-card-border border-y border-card-border">
              {FOUNDER_CAREER.map((item, i) => (
                <li key={item} className="flex items-start gap-4 py-4">
                  <span className="mt-1 font-display text-lg leading-none text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-stone-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-10 pb-10 border-b border-card-border">
            <h2 className="font-display text-2xl text-navy mb-4">Three kinds of work</h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              AI is for speed, scale, and capability. It is never for truth, joy, or relationships. Every
              workflow we touch gets sorted into three kinds of work.
            </p>
            <dl className="space-y-5">
              <div>
                <dt className="flex items-center gap-3 font-display text-xl text-navy">
                  <OrbStation kind="agent" label="AI" />
                  Groundwork: AI runs it
                </dt>
                <dd className="mt-1 pl-7 text-stone-600 leading-relaxed">
                  Rules-based work no licensed person should be doing by hand. Eligibility checks, prior
                  auth packets, regulatory binders kept current.
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-3 font-display text-xl text-navy">
                  <OrbStation kind="agent" label="AI" />
                  Teamwork: AI drafts, a qualified person decides
                </dt>
                <dd className="mt-1 pl-7 text-stone-600 leading-relaxed">
                  Draft 0 protocols and medical content, pre-MLR checks, enrollment forecasts. AI drafts and
                  checks. A qualified person decides and signs.
                </dd>
              </div>
              <div>
                <dt className="flex items-center gap-3 font-display text-xl text-navy">
                  <OrbStation kind="human" label="People" />
                  Lifework: never AI
                </dt>
                <dd className="mt-1 pl-7 text-stone-600 leading-relaxed">
                  The consent conversation and the hard news. A clinician&rsquo;s judgment at the bedside.
                  The relationships that win the next study.
                </dd>
              </div>
            </dl>
            <p className="mt-6 font-display text-xl text-navy leading-snug">
              AI never sits between a clinician and a patient. It clears the paperwork that keeps them apart.
            </p>
          </div>

          <div className="space-y-4 mb-10">
            <h2 className="font-display text-2xl text-navy">How we work</h2>
            <p className="text-stone-600 leading-relaxed">
              We work in one-week sprints: strategy, product, UX, UI, or build. A full product is five or six
              sprints back to back. Clients buy sprints one at a time, or keep us on as an embedded team and
              add sprints on top.
            </p>
            <p className="text-stone-600 leading-relaxed">
              You own everything we build: all code, IP, and scaffolding.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-card-light p-8">
            <div className="mb-4 flex justify-center">
              <OrbStation kind="human" label="Strategy sprint" />
            </div>
            <p className="text-stone-600 mb-4 text-center">Stuck on an initiative?</p>
            <div className="text-center">
              <Link
                href="/#discovery"
                className="inline-flex items-center bg-gold text-navy px-6 py-3 text-sm font-medium rounded-full hover:bg-gold/90 transition-colors"
              >
                Book a Strategy Sprint
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
    </MarketingShell>
  )
}

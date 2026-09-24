import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import Image from "next/image"
import Link from "next/link"
import MarketingShell from "../components/marketing-shell"
import { GlyphKey, OrbStation } from "../components/process-orb"

export const metadata: Metadata = {
  title: "About | CappaWork",
  description: "CappaWork designs and deploys AI systems that change how operational work gets done.",
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
                <p className="text-stone-600 leading-relaxed mb-4">
                  MBA. Fifteen years in operating roles and strategy. Seven years building products. I have sat with executive teams on how the work should run, and I ship the systems that make that real.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  CappaWork is that practice: a view of where the operation can go, and a build that gets there. Agents where the work calls for them. Judgment left with the people who should hold it.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-10">
            <div className="mb-4 flex items-center gap-3">
              <OrbStation kind="agent" label="The engagement" />
              <h2 className="font-display text-2xl text-navy">One engagement. One relationship.</h2>
            </div>
            <p className="text-stone-600 mb-4">
              CappaWork comes in, maps how the work actually runs, and builds the system that should carry it. One relationship from the audit through the build. The system stays on call after it is live. It is not a staffed seat.
            </p>
            <p className="text-stone-600 leading-relaxed">
              You own the IP. CappaWork keeps the system running, secure, and improving over time.
            </p>
          </div>

          <h2 className="font-display text-2xl text-navy mb-4">Why We Exist</h2>
          <div className="space-y-4 mb-10">
            <p className="text-stone-600 leading-relaxed">
              For decades, custom software was too expensive for most businesses. So people became the middleware between disconnected systems: copying, checking, forwarding, reconciling, and chasing information from one place to another.
            </p>
            <p className="text-stone-600 leading-relaxed">
              AI did not change what software is for. It changed how much of an operation can move without a person in the middle. CappaWork exists to use that carefully: not to replace the people who carry judgment, but to take back the work that never belonged to them.
            </p>
          </div>

          <div className="rounded-2xl border border-card-border bg-card-light p-8">
            <div className="mb-4 flex justify-center">
              <OrbStation kind="human" label="See how an engagement runs" />
            </div>
            <p className="text-stone-600 mb-4 text-center">
              See how an engagement runs.
            </p>
            <div className="text-center">
              <Link
                href="/#how-it-works"
                className="inline-flex items-center bg-gold text-navy px-6 py-3 text-sm font-medium rounded-full hover:bg-gold/90 transition-colors"
              >
                How it works
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

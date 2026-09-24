import type { Metadata } from "next"
import Link from "next/link"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import MarketingShell from "../components/marketing-shell"
import { GlyphKey, OrbStation } from "../components/glyphs"

export const metadata: Metadata = {
  title: "Transformation — CappaWork",
  description:
    "CappaWork changes how operational work gets done. Discovery, then a build. Agents go in where the work calls for them.",
}

export default function TransformationPage() {
  return (
    <MarketingShell>
    <main className="min-h-screen bg-warm-white">
      <Navigation />
      <article className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlyphKey className="mb-8" />
          <div className="mb-4 flex items-center gap-3">
            <OrbStation kind="agent" label="Transformation" />
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-gold">
              Transformation
            </p>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-navy leading-[1.05]">
            Change how the work runs. Use an agent when the work calls for one.
          </h1>
          <div className="mt-8 space-y-5 text-lg text-stone-600 leading-relaxed">
            <p>
              A transformation here is not a slide deck and an 18-month program. It is a look at how a workflow actually moves, a decision about what should change, and a system in production.
            </p>
            <p>
              People keep the judgment, the relationship, and the decisions a customer will feel. Software takes the copying, the chasing, and the handoffs that should not wait on a meeting.
            </p>
            <p>
              Some of that software is an agent. Some of it is the operating system the team should have had. Both stay on call after they are live. Neither is a staffed seat.
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <OrbStation kind="human" label="Discovery call" />
            <Link
              href="/#discovery"
              className="inline-flex items-center bg-gold text-navy px-6 py-3 text-sm font-medium rounded-full hover:bg-gold/90 transition-colors"
            >
              Book a Discovery Call
            </Link>
            <Link
              href="/#work"
              className="inline-flex items-center border border-card-border px-6 py-3 text-sm font-medium rounded-full text-navy hover:border-gold transition-colors"
            >
              See the work
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
    </MarketingShell>
  )
}

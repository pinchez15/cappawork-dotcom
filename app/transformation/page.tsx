import type { Metadata } from "next"
import Link from "next/link"
import Navigation from "../components/navigation"
import Footer from "../components/footer"

export const metadata: Metadata = {
  title: "Transformation — CappaWork",
  description:
    "CappaWork changes how operational work gets done. Discovery, then a build. Agents go in where the work calls for them.",
}

export default function TransformationPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Navigation />
      <article className="pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#2450E6] mb-4">
            Transformation
          </p>
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
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/#discovery"
              className="inline-flex items-center bg-[#2450E6] text-white px-5 py-3 text-sm font-medium hover:bg-[#1D45D4] transition-colors"
            >
              Book a Discovery Call
            </Link>
            <Link
              href="/#work"
              className="inline-flex items-center border border-card-border px-5 py-3 text-sm font-medium text-navy hover:border-[#2450E6] transition-colors"
            >
              See the work
            </Link>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}

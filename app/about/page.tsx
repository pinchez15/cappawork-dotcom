import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About | CappaWork",
  description:
    "Meet Nate Pinches — MBA, management consultant, and full-stack AI product builder. CappaWork runs 6-Week AI Transformations for businesses over ~$50M revenue.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-navy mb-12">
            About CappaWork
          </h1>

          {/* Intro about Nate with headshot */}
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
                <h2 className="font-display text-2xl text-navy mb-3">Nate Pinches</h2>
                <p className="text-stone-600 leading-relaxed mb-4">
                  MBA. 15 years of experience. 7 years building products. I&apos;ve done C-suite strategy work up to $2B+ companies and I ship production AI systems every&nbsp;day.
                </p>
                <p className="text-stone-600 leading-relaxed mb-4">
                  My own business almost died from poor cashflow — so profitability isn&apos;t an abstract concept for me. It&apos;s the first thing I look at, every time. I&apos;ve spent years inside founder-led service businesses mapping workflows, measuring unit economics, and building the systems that turn operational chaos into measurable&nbsp;margin.
                </p>
                <p className="text-stone-600 leading-relaxed">
                  I diagnose the problem, build the solution, and train your team to own&nbsp;it.
                </p>
              </div>
            </div>
          </div>

          {/* The model */}
          <div className="space-y-6 mb-10">
            <h2 className="font-display text-2xl text-navy mb-4">One engagement. One relationship.</h2>
            <p className="text-stone-600 mb-4">
              CappaWork helps businesses over ~$50M revenue implement AI and agents: Week 0 audit, six-week transformation in one department, optional Modernize retainer after go-live — with one partner from strategy through shipping.
            </p>
            <p className="text-stone-600 leading-relaxed">
              You own the IP. CappaWork keeps shipped workflows working under a narrow 12-month guarantee, then via retainer if you want ongoing capacity.
            </p>
          </div>

          {/* Philosophy */}
          <h2 className="font-display text-2xl text-navy mb-4">Why We Exist</h2>
          <div className="space-y-4 mb-10">
            <p className="text-stone-600 leading-relaxed">
              For decades, custom software was too expensive for most businesses. So people became the middleware between disconnected systems: copying, checking, forwarding, reconciling, and chasing information from one place to another.
            </p>
            <p className="text-stone-600 leading-relaxed">
              AI didn&rsquo;t change what software is for. It changed what businesses can afford to build. CappaWork exists to help operators use that leverage wisely: not to replace people, but to eliminate the Computer Work that never belonged to people in the first place.
            </p>
          </div>

          {/* Link back */}
          <div className="bg-card-light rounded-2xl p-8 text-center">
            <p className="text-stone-600 mb-4">
              See the 6-Week AI Transformation — pricing, billing, guarantee, and what week 6 looks like.
            </p>
            <Link
              href="/transformation"
              className="inline-flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors"
            >
              View the transformation &rarr;
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

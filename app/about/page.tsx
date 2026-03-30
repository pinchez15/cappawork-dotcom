import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "About | CappaWork",
  description: "Meet Nate Pinches — MBA, management consultant, full-stack AI product builder. CappaWork becomes your AI team.",
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
            <p className="text-stone-600 leading-relaxed">
              CappaWork isn&apos;t a menu of services. It&apos;s a retained engagement where I become your AI team — finding where you&apos;re leaving money on the table, building the systems that fix it, coaching you on every decision, and training your people to own what I build.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Six months. $15,000/month. When I leave, you keep everything: the products, the playbooks, and a team that knows what to do with them.
            </p>
          </div>

          {/* Philosophy */}
          <h2 className="font-display text-2xl text-navy mb-4">The Philosophy</h2>
          <div className="space-y-4 mb-10">
            <p className="text-stone-600 leading-relaxed">
              Most consultants deliver strategy decks. Most dev shops build what they&apos;re told. Most AI vendors sell chatbots. I do the diagnosis and the implementation — same person, start to finish.
            </p>
            <p className="text-stone-600 leading-relaxed">
              The promise is transformation, not dependency. I leave the client better than I found them and I leave. You won&apos;t need me to keep the lights on.
            </p>
          </div>

          {/* Link back */}
          <div className="bg-card-light rounded-2xl p-8 text-center">
            <p className="text-stone-600 mb-4">
              See how the engagement works, what&apos;s included, and what the math looks like.
            </p>
            <Link
              href="/#offer"
              className="inline-flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors"
            >
              View the offer &rarr;
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

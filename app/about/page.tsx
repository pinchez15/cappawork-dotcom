import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import SubstackSection from "../components/substack-section"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About | CappaWork",
  description: "Learn about CappaWork and our mission to help founder-led service businesses scale profitably through operational analytics and AI transformation.",
}

export const dynamic = "force-dynamic";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-warm-white">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl sm:text-5xl tracking-tight text-navy mb-8">
            About CappaWork
          </h1>

          <div className="prose prose-stone max-w-none">
            {/* Intro about Nate with headshot */}
            <div className="mb-12 pb-12 border-b border-card-border">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="flex-shrink-0">
                  <Image
                    src="/nate-headshot.png"
                    alt="Nate Pinches, founder of CappaWork"
                    width={200}
                    height={200}
                    className="rounded-2xl object-cover"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-navy mb-4">About Nate</h2>
                  <p className="text-lg text-stone-700 leading-relaxed mb-4">
                    I&apos;m Nate Pinches, the founder of CappaWork. I&apos;ve spent years working with
                    founder-led service businesses, and I&apos;ve seen firsthand how the gap between
                    operational reality and operational potential can quietly drain hundreds of thousands
                    in profit.
                  </p>
                  <p className="text-lg text-stone-700 leading-relaxed">
                    CappaWork is my answer to that problem: analytics-first consulting that helps operators
                    see where their money actually goes—then automation and AI that gives them the margin back.
                  </p>
                </div>
              </div>
            </div>

            {/* Mission */}
            <p className="text-lg text-stone-700 leading-relaxed mb-6">
              CappaWork exists to solve a simple problem: founder-led service businesses are
              scaling on instinct when they should be scaling on data. They have the revenue,
              the team, and the ambition—but they can&apos;t see where the margin leaks are,
              which workflows are costing them the most, or what to automate first.
            </p>

            <p className="text-lg text-stone-700 leading-relaxed mb-6">
              We work with businesses doing $3M–$10M in revenue who know they&apos;re leaving
              money on the table but can&apos;t pinpoint where. These aren&apos;t startups looking
              for funding—they&apos;re operators who need clarity before they invest in change.
            </p>

            <h2 className="text-2xl font-semibold text-navy mt-12 mb-4">Our Approach</h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              We start with a Diagnostic: mapping your workflows, measuring your unit economics,
              and identifying the specific operational changes that will move your margin the most.
              No guessing. No generic playbooks. Just your numbers, analyzed and prioritized.
            </p>
            <p className="text-stone-700 leading-relaxed mb-4">
              Then we implement—workflow automation, AI integration, and systems that let your
              people do higher-value work instead of chasing status updates and re-entering data.
            </p>

            <h2 className="text-2xl font-semibold text-navy mt-12 mb-4">The Philosophy</h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              Your operations are the most expensive thing you&apos;re not measuring. Every manual
              handoff, every redundant approval, every hour spent on work that should be automated—it
              all shows up in your margin, whether you track it or not.
            </p>

            <p className="text-stone-700 leading-relaxed">
              We believe AI should elevate your people, not replace them. The goal isn&apos;t to
              cut headcount—it&apos;s to free your team to do the work that actually requires
              human judgment, creativity, and relationships. The rest should run itself.
            </p>

            {/* Substack Section */}
            <SubstackSection />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

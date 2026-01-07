import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import SubstackSection from "../components/substack-section"

export const metadata: Metadata = {
  title: "About | CappaWork",
  description: "Learn about CappaWork and our mission to build modern software for owner-led businesses.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-8">
            About CappaWork
          </h1>

          <div className="prose prose-stone max-w-none">
            {/* Intro about Nate */}
            <div className="mb-12 pb-12 border-b border-stone-200">
              <h2 className="text-2xl font-semibold text-stone-900 mb-4">About Nate</h2>
              <p className="text-lg text-stone-700 leading-relaxed mb-4">
                I'm Nate Pinches, the founder of CappaWork. I've spent years building products for
                owner-led businesses, and I've seen firsthand how the gap between vision and
                execution can slow down even the most ambitious operators.
              </p>
              <p className="text-lg text-stone-700 leading-relaxed">
                CappaWork is my answer to that problem: a way to bring startup-level velocity to
                businesses that don't need—or want—the overhead of a full tech team.
              </p>
            </div>

            {/* Existing CappaWork content */}
            <p className="text-lg text-stone-700 leading-relaxed mb-6">
              CappaWork exists to solve a simple problem: owner-led businesses need modern
              software, but they don't need the overhead of a full tech team or the complexity of a
              bloated agency.
            </p>

            <p className="text-lg text-stone-700 leading-relaxed mb-6">
              We work with businesses doing $500K–$5M in revenue who have niche knowledge, messy
              internal systems, and a vision to turn a cost center into a profit center. These
              aren't startups looking for scale—they're operators who need tools that work.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-12 mb-4">Our Approach</h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              We build on the same stack that powers billion-dollar startups: Next.js, Supabase,
              Vercel, Clerk, and Stripe. But we don't build "no-code tools" or "vibed out hacks."
              We build scalable software assets that earn trust inside your business first—then let
              you take them to market when you're ready.
            </p>

            <h2 className="text-2xl font-semibold text-stone-900 mt-12 mb-4">The Philosophy</h2>
            <p className="text-stone-700 leading-relaxed mb-4">
              The best products start as internal tools. AWS started as an internal server. Slack was
              a team tool that turned into a product. We believe your internal systems can become
              your competitive advantage—if they're built right.
            </p>

            <p className="text-stone-700 leading-relaxed">
              We're not here to build features you'll never use. We're here to build tools your team
              actually loves, on a foundation your customers will trust.
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



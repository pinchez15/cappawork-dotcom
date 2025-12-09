import type { Metadata } from "next"
import Navigation from "../components/navigation"
import CohortCTA from "./cohort-cta"
import { Check, Code, Calendar, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: "The CappaWork Builder Cohort - One-Month, Zero-to-One",
  description:
    "Turn an idea or vibe-coded prototype into a real, scalable solution. One-month cohort with live calls, community support, and hands-on building.",
  keywords: "cohort program, product development, learn to build, Next.js, Cursor, Supabase, Vercel",
  openGraph: {
    title: "The CappaWork Builder Cohort - One-Month, Zero-to-One",
    description: "Turn an idea or vibe-coded prototype into a real, scalable solution.",
    type: "website",
    url: "https://cappawork.com/cohort",
    siteName: "CappaWork",
  },
}

export default function CohortPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-stone-900 mb-6 leading-tight">
            The CappaWork Builder Cohort
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 mb-4 max-w-2xl mx-auto leading-relaxed">
            One-Month, Zero-to-One Cohort for Builders
          </p>
          <p className="text-base sm:text-lg text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Turn an idea or vibe-coded prototype into a real, scalable solution.
          </p>
          <p className="text-base text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            You will leave with a real, deployed, scalable 0→1 product, built on a proper architecture with modern tools.
          </p>
        </div>
      </section>

      {/* Tools & Stack */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">
              Tools & Stack
            </h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              We'll build using the same modern tools that power real products
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { name: "Cursor", description: "AI-powered development" },
              { name: "Clerk", description: "Authentication & user management" },
              { name: "Supabase", description: "Database & backend" },
              { name: "Vercel", description: "Deployment & hosting" },
            ].map((tool, index) => (
              <div key={index} className="bg-white p-6 rounded-sm border border-stone-200 text-center">
                <h3 className="text-lg font-serif font-medium text-stone-900 mb-2">{tool.name}</h3>
                <p className="text-sm text-stone-600">{tool.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-stone-600">
              Plus GitHub for commit + PR discipline
            </p>
          </div>
        </div>
      </section>

      {/* Format */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">
              Format
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-stone-50 p-8 rounded-sm border border-stone-200">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
                <h3 className="text-xl font-serif font-medium text-stone-900">Duration</h3>
              </div>
              <p className="text-stone-700 leading-relaxed">
                1 month long
              </p>
            </div>

            <div className="bg-stone-50 p-8 rounded-sm border border-stone-200">
              <div className="flex items-center gap-3 mb-4">
                <Code className="w-8 h-8 text-green-600" />
                <h3 className="text-xl font-serif font-medium text-stone-900">Live Calls</h3>
              </div>
              <p className="text-stone-700 leading-relaxed">
                3 live 1-hour calls<br />
                Tuesday nights (EST)
              </p>
            </div>

            <div className="bg-stone-50 p-8 rounded-sm border border-stone-200">
              <div className="flex items-center gap-3 mb-4">
                <MessageSquare className="w-8 h-8 text-yellow-600" />
                <h3 className="text-xl font-serif font-medium text-stone-900">Community</h3>
              </div>
              <p className="text-stone-700 leading-relaxed">
                A private LinkedIn group chat for discussion, feedback, and community
              </p>
            </div>
          </div>

          <div className="mt-12 bg-stone-50 p-8 rounded-sm border border-stone-200 text-center">
            <p className="text-lg font-medium text-stone-900 mb-2">
              30 spots per cohort (strict cap)
            </p>
            <p className="text-stone-700">
              Limited availability ensures personalized attention and a focused learning environment.
            </p>
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-24 bg-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">
              Outcomes
            </h2>
          </div>

          <div className="bg-white p-8 rounded-sm border border-stone-200">
            <p className="text-lg text-stone-900 mb-6 leading-relaxed">
              You will leave with a real, deployed, scalable 0→1 product, built on a proper architecture with modern tools.
            </p>
            <ul className="space-y-4 text-stone-700">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-stone-600 mt-0.5 flex-shrink-0" />
                <span>A working product deployed to production</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-stone-600 mt-0.5 flex-shrink-0" />
                <span>Clean, scalable architecture you can build on</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-stone-600 mt-0.5 flex-shrink-0" />
                <span>Understanding of modern development workflows</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-stone-600 mt-0.5 flex-shrink-0" />
                <span>Confidence to continue building and iterating</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-stone-900 mb-6">
            Reserve Your Spot
          </h2>
          
          <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
            Join the next cohort and turn your idea into a real, deployed product.
          </p>

          <CohortCTA />
        </div>
      </section>
    </main>
  )
}

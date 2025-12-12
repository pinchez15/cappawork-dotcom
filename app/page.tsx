import type { Metadata } from "next"
import Hero from "./components/hero"
import LogoBanner from "./components/logo-banner"
import WhatYouGet from "./components/what-you-get"
import Pricing from "./components/pricing"
import CohortSection from "./components/cohort-section"
import Portfolio from "./components/portfolio"
import CTASection from "./components/cta-section"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import Blog from "./components/blog"
import NarrativeSection from "./components/narrative-section"
import ProcessSection from "./components/process-section"

export const metadata: Metadata = {
  title: "CappaWork - Product Development for Owner-Led Businesses",
  description:
    "CappaWork builds modern, scalable internal tools and early-stage products for owner-led businesses who want startup-level velocity without hiring a full tech team.",
  keywords: "product development, internal tools, MVP development, owner-led businesses, Next.js, full-stack development, cohort program",
  openGraph: {
    title: "CappaWork - Product Development for Owner-Led Businesses",
    description: "CappaWork builds modern, scalable internal tools and early-stage products for owner-led businesses.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    images: [
      {
        url: "/WP1.png",
        width: 1200,
        height: 630,
        alt: "CappaWork - Product Development Portfolio",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork - Product Development Services for Owner-Led Businesses",
    description: "CappaWork builds modern, scalable internal tools and early-stage products for owner-led businesses.",
    images: ["/WP1.png"],
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <Hero />
      <LogoBanner />
      <WhatYouGet />
      
      {/* Deep Dive 1: Owner-Led Velocity */}
      <NarrativeSection
        title="Owner-led velocity, without the overhead."
        subtitle="For the Operators"
        description={
          <>
            <p>
              You don't need a bloated agency or a generic dev shop. You need a partner who thinks like an owner.
            </p>
            <p>
              We work with owner-operators doing $500K–$5M who run on messy internal systems, have niche knowledge but no tech team, and want to turn a cost center into a profit center.
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>No "why is this so complicated?" moments</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>No wasted features</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Just clean tools that people actually use</span>
              </li>
            </ul>
          </>
        }
        imageSrc="/CW_reviews.png"
        imageAlt="Operational Efficiency Dashboard"
        imagePosition="right"
        backgroundColor="stone"
      />

      {/* Deep Dive 2: Startup-Grade Architecture */}
      <NarrativeSection
        title="Internal strength becomes external opportunity."
        subtitle="The Architecture"
        description={
          <>
            <p>
              The best products start as internal tools. AWS started as an internal server. Slack was team tool, that turned into a product. We build your system on the same stack that powers billion-dollar startups (Next.js, Supabase, Vercel, Clerk, Stripe).
            </p>
            <p>
              This isn't a "no-code tool" or a "vibed out hack." It's a scalable software asset. When you're ready to monetize your expertise, the foundation is already there.
            </p>
            <p className="font-medium text-stone-900">
              We build systems that earn trust inside your business first—then let you take them to market.
            </p>
          </>
        }
        imageSrc="/WP1.png"
        imageAlt="Modern Software Architecture"
        imagePosition="left"
        backgroundColor="white"
      />

      {/* Deep Dive 3: The Path */}
      <ProcessSection />

      <Pricing />
      <CohortSection />
      <Portfolio />
      <CTASection />
      <Blog />
      <Footer />
    </main>
  )
}

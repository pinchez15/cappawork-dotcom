import type { Metadata } from "next"
import Hero from "./components/hero"
import WhyWorks from "./components/why-works"
import WhatYouGet from "./components/what-you-get"
import WhoWeServe from "./components/who-we-serve"
import Pricing from "./components/pricing"
import About from "./components/about"
import CTASection from "./components/cta-section"
import Navigation from "./components/navigation"
import Blog from "./components/blog"

export const metadata: Metadata = {
  title: "CappaWork - Product Development Services for Owner-Led Businesses",
  description:
    "CappaWork builds modern, scalable internal tools and early-stage products for owner-led businesses who want startup-level velocity without hiring a full tech team.",
  keywords: "product development, internal tools, MVP development, owner-led businesses, Next.js, full-stack development, cohort program",
  openGraph: {
    title: "CappaWork - Product Development Services for Owner-Led Businesses",
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
      <WhyWorks />
      <WhatYouGet />
      <WhoWeServe />
      <Pricing />
      <About />
      <CTASection />
      <Blog />
    </main>
  )
}

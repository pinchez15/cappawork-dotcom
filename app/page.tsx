import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import Blog from "./components/blog"
import ScaleProblem from "./components/scale-problem"
import WhatWeDo from "./components/what-we-do"
import EngagementSection from "./components/engagement-section"
import WhoThisIsFor from "./components/who-this-is-for"
import HowWereDifferent from "./components/how-were-different"
import WhatsAtStake from "./components/whats-at-stake"
import FAQSection from "./components/faq-section"
import ClosingCTA from "./components/closing-cta"

export const metadata: Metadata = {
  title: "CappaWork - Operational Analytics & Automation for Growing Businesses",
  description:
    "We help founder-led businesses doing $3M–$10M find and fix the margin leaks that grow with revenue. Analytics first. Implementation second.",
  keywords: "operational analytics, automation, margin improvement, scale inefficiency, founder-led businesses, $3M-$10M",
  openGraph: {
    title: "CappaWork - Operational Analytics & Automation for Growing Businesses",
    description: "We help founder-led businesses doing $3M–$10M find and fix the margin leaks that grow with revenue. Analytics first. Implementation second.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    images: [
      {
        url: "https://cappawork.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "CappaWork - Operational Analytics & Automation for Growing Businesses",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork - Operational Analytics & Automation for Growing Businesses",
    description: "We help founder-led businesses doing $3M–$10M find and fix the margin leaks that grow with revenue. Analytics first. Implementation second.",
    images: ["https://cappawork.com/og-image.png"],
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <Hero />
      <ScaleProblem />
      <WhatWeDo />
      <EngagementSection />
      <WhoThisIsFor />
      <HowWereDifferent />
      <WhatsAtStake />
      <FAQSection />
      <ClosingCTA />
      <Blog />
      <Footer />
    </main>
  )
}

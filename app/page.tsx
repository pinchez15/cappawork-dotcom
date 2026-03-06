import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import Blog from "./components/blog"
import ScaleProblem from "./components/scale-problem"
import WhatWeDo from "./components/what-we-do"
import EngagementSection from "./components/engagement-section"
import WhoThisIsFor from "./components/who-this-is-for"
import WhatsAtStake from "./components/whats-at-stake"
import ProofPoint from "./components/proof-point"
import FAQSection from "./components/faq-section"
import ClosingCTA from "./components/closing-cta"
import CalculatorCTA from "./components/calculator-cta"
import FounderSection from "./components/founder-section"

export const metadata: Metadata = {
  title: "CappaWork — Make Work Human Again",
  description:
    "AI transformation for founder-led service businesses doing $3M–$10M. We elevate your people and automate your process.",
  keywords: "AI transformation, automation, founder-led businesses, operational efficiency, human-first AI",
  openGraph: {
    title: "CappaWork — Make Work Human Again",
    description: "AI transformation for founder-led service businesses doing $3M–$10M. We elevate your people and automate your process.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — Make Work Human Again",
    description: "AI transformation for founder-led service businesses doing $3M–$10M. We elevate your people and automate your process.",
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ScaleProblem />
      <WhatWeDo />
      <WhatsAtStake />
      <ProofPoint />
      <EngagementSection />
      <WhoThisIsFor />
      <CalculatorCTA />
      <FAQSection />
      <ClosingCTA />
      <Blog />
      <FounderSection />
      <Footer />
    </main>
  )
}

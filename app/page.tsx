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
    images: [
      {
        url: "https://cappawork.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "CappaWork — Make Work Human Again",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — Make Work Human Again",
    description: "AI transformation for founder-led service businesses doing $3M–$10M. We elevate your people and automate your process.",
    images: ["https://cappawork.com/og-image.png"],
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
      <FAQSection />
      <ClosingCTA />
      <Blog />
      <Footer />
    </main>
  )
}

import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import ProblemSection from "./components/problem-section"
import OfferCard from "./components/offer-card"
import HowItWorks from "./components/how-it-works"
import Capabilities from "./components/capabilities"
import Qualification from "./components/qualification"
import TheMath from "./components/the-math"
import AboutSection from "./components/about-section"
import ClosingCTA from "./components/closing-cta"

export const metadata: Metadata = {
  title: "CappaWork — Your AI Team",
  description:
    "CappaWork becomes your AI team. We find the profit lever, build the solution, coach you through the decisions, and train your team to own it. $15K/month, 6 months.",
  keywords: "AI team, AI consulting, AI transformation, founder-led businesses, operational efficiency, profit improvement",
  openGraph: {
    title: "CappaWork — Your AI Team",
    description: "CappaWork becomes your AI team. One engagement. Six months. You keep everything we build.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — Your AI Team",
    description: "CappaWork becomes your AI team. One engagement. Six months. You keep everything we build.",
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <ProblemSection />
      <OfferCard />
      <HowItWorks />
      <Capabilities />
      <Qualification />
      <TheMath />
      <AboutSection />
      <ClosingCTA />
      <Footer />
    </main>
  )
}

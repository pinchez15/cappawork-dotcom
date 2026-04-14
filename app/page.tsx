import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import ProblemSection from "./components/problem-section"
import OfferCard from "./components/offer-card"
import HowItWorks from "./components/how-it-works"
import Capabilities from "./components/capabilities"
import AboutSection from "./components/about-section"
import ClosingCTA from "./components/closing-cta"
import HomepageWrapper from "./components/homepage-wrapper"

export const metadata: Metadata = {
  title: "CappaWork — Your AI Team",
  description:
    "Fractional AI leadership for businesses ready to move. We help you set and execute your AI strategy at startup speed.",
  keywords: "fractional AI, AI strategy, AI leadership, AI consulting, AI transformation, business AI",
  openGraph: {
    title: "CappaWork — Your AI Team",
    description: "Fractional AI leads to help you set and execute your AI strategy at startup speed.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — Your AI Team",
    description: "Fractional AI leads to help you set and execute your AI strategy at startup speed.",
  },
}

export default function HomePage() {
  return (
    <HomepageWrapper>
      <main className="min-h-screen">
        <Navigation />
        <Hero />
        <ProblemSection />
        <OfferCard />
        <HowItWorks />
        <Capabilities />
        <AboutSection />
        <ClosingCTA />
        <Footer />
      </main>
    </HomepageWrapper>
  )
}

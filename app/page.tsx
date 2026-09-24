import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import TransformSection from "./components/transform-section"
import PhilosophySection from "./components/philosophy-section"
import HowItWorks from "./components/how-it-works"
import OutcomesSection from "./components/outcomes-section"
import AiJudgmentSection from "./components/ai-judgment-section"
import PortfolioSection from "./components/portfolio-section"
import FaqSection from "./components/faq-section"
import DiscoverySection from "./components/discovery-section"
import HomepageWrapper from "./components/homepage-wrapper"

const title = "CappaWork — AI systems that change how work gets done"
const description =
  "Custom AI implementations for the operations that run a company. We redesign the workflow and use agents where the work calls for them."

export const metadata: Metadata = {
  title,
  description,
  keywords:
    "AI implementation, enterprise AI, operational transformation, AI agents, computer work, custom AI systems",
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    locale: "en_US",
    images: [
      {
        url: "/linkedin-preview.jpg",
        width: 1200,
        height: 630,
        alt: "CappaWork — AI systems that change how work gets done",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/linkedin-preview.jpg"],
  },
}

export default function HomePage() {
  return (
    <HomepageWrapper>
      <main className="min-h-screen bg-warm-white">
        <Navigation />
        <Hero />
        <TransformSection />
        <PhilosophySection />
        <HowItWorks />
        <OutcomesSection />
        <AiJudgmentSection />
        <PortfolioSection />
        <FaqSection />
        <DiscoverySection />
        <Footer />
      </main>
    </HomepageWrapper>
  )
}

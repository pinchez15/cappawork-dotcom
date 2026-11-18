import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import ExperienceStrip from "./components/experience-strip"
import PhilosophySection from "./components/philosophy-section"
import FounderSection from "./components/founder-section"
import ServiceLines from "./components/service-lines"
import HowItWorks from "./components/how-it-works"
import OutcomesSection from "./components/outcomes-section"
import AiJudgmentSection from "./components/ai-judgment-section"
import PortfolioSection from "./components/portfolio-section"
import FaqSection from "./components/faq-section"
import DiscoverySection from "./components/discovery-section"
import HomepageWrapper from "./components/homepage-wrapper"

const title = "CappaWork | The embedded product team for healthcare and life sciences"
const description =
  "We turn stuck initiatives into shipped products for healthcare and life sciences companies, in one-week sprints. AI for speed, scale, and capability. Never for truth, joy, or relationships."

export const metadata: Metadata = {
  title,
  description,
  keywords:
    "healthcare product team, life sciences software, clinical trial operations, patient recruitment technology, pharmacy operations, regulated content, MLR review, embedded product team, AI agents",
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
        alt: title,
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
        <ExperienceStrip />
        <PhilosophySection />
        <FounderSection />
        <ServiceLines />
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

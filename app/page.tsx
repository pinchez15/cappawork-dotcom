import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import ComputerWorkAudit from "./components/computer-work-audit"
import PhilosophySection from "./components/philosophy-section"
import HowItWorks from "./components/how-it-works"
import ServiceLines from "./components/service-lines"
import SoftwareWeBuild from "./components/software-we-build"
import PortfolioSection from "./components/portfolio-section"
import ClosingCTA from "./components/closing-cta"
import HomepageWrapper from "./components/homepage-wrapper"

export const metadata: Metadata = {
  title: "CappaWork — 6-Week AI Transformation for $50M+ Businesses",
  description:
    "Remove Computer Work so your team can do more Human Work. 6-Week AI Transformation for businesses over ~$50M revenue. Scoped after a Computer Work Audit.",
  keywords:
    "AI transformation, computer work audit, AI agents, operational software, $50M businesses, six-week engagement",
  openGraph: {
    title: "CappaWork — 6-Week AI Transformation for $50M+ Businesses",
    description:
      "Remove Computer Work so your team can do more Human Work. 6-Week AI Transformation for businesses over ~$50M revenue. Scoped after a Computer Work Audit.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    locale: "en_US",
    images: [
      {
        url: "/linkedin-preview.jpg",
        width: 1200,
        height: 630,
        alt: "CappaWork — 6-Week AI Transformation for $50M+ Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — 6-Week AI Transformation for $50M+ Businesses",
    description:
      "Remove Computer Work so your team can do more Human Work. 6-Week AI Transformation for businesses over ~$50M revenue. Scoped after a Computer Work Audit.",
    images: ["/linkedin-preview.jpg"],
  },
}

export default function HomePage() {
  return (
    <HomepageWrapper>
      <main className="min-h-screen">
        <Navigation />
        <Hero />
        <ComputerWorkAudit />
        <PhilosophySection />
        <HowItWorks />
        <ServiceLines />
        <SoftwareWeBuild />
        <PortfolioSection />
        <ClosingCTA />
        <Footer />
      </main>
    </HomepageWrapper>
  )
}

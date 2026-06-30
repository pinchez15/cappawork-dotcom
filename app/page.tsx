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
  title: "CappaWork — AI Modernization for Founder-Led Businesses",
  description:
    "CappaWork removes computer work so your team can do more human work. AI modernization, custom software, and embedded engineering for founder-led businesses.",
  keywords: "AI modernization, computer work audit, custom operational software, embedded engineering, founder-led",
  openGraph: {
    title: "CappaWork — AI Modernization for Founder-Led Businesses",
    description:
      "CappaWork removes computer work so your team can do more human work. AI modernization, custom software, and embedded engineering for founder-led businesses.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    locale: "en_US",
    images: [
      {
        url: "/linkedin-preview.jpg",
        width: 1200,
        height: 630,
        alt: "CappaWork — AI Modernization for Founder-Led Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — AI Modernization for Founder-Led Businesses",
    description:
      "CappaWork removes computer work so your team can do more human work. AI modernization, custom software, and embedded engineering for founder-led businesses.",
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

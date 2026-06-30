import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import ProblemSection from "./components/problem-section"
import PhilosophySection from "./components/philosophy-section"
import ServiceLines from "./components/service-lines"
import HowItWorks from "./components/how-it-works"
import SoftwareWeBuild from "./components/software-we-build"
import AboutSection from "./components/about-section"
import PortfolioSection from "./components/portfolio-section"
import SuccessSection from "./components/success-section"
import ClosingCTA from "./components/closing-cta"
import HomepageWrapper from "./components/homepage-wrapper"

export const metadata: Metadata = {
  title: "CappaWork — AI for Main Street",
  description:
    "CappaWork helps founder-led businesses become AI-native. Custom software and embedded engineering so computers do the computer work and your team can do the human work.",
  keywords: "AI-native, forward-deployed engineering, custom operational software, AI modernization, business automation, founder-led",
  openGraph: {
    title: "CappaWork — AI for Main Street",
    description:
      "CappaWork helps founder-led businesses become AI-native. Custom software and embedded engineering so computers do the computer work and your team can do the human work.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    locale: "en_US",
    images: [
      {
        url: "/linkedin-preview.jpg",
        width: 1200,
        height: 630,
        alt: "CappaWork — AI for Main Street",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — AI for Main Street",
    description:
      "CappaWork helps founder-led businesses become AI-native. Custom software and embedded engineering so computers do the computer work and your team can do the human work.",
    images: ["/linkedin-preview.jpg"],
  },
}

export default function HomePage() {
  return (
    <HomepageWrapper>
      <main className="min-h-screen">
        <Navigation />
        <Hero />
        <PhilosophySection />
        <ProblemSection />
        <ServiceLines />
        <HowItWorks />
        <SoftwareWeBuild />
        <AboutSection />
        <PortfolioSection />
        <SuccessSection />
        <ClosingCTA />
        <Footer />
      </main>
    </HomepageWrapper>
  )
}

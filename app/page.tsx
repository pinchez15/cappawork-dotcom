import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import ProblemSection from "./components/problem-section"
import AboutSection from "./components/about-section"
import HowItWorks from "./components/how-it-works"
import SoftwareWeBuild from "./components/software-we-build"
import StakesSection from "./components/stakes-section"
import SuccessSection from "./components/success-section"
import PathwayCapacity from "./components/pathway-capacity"
import PathwayAcquirers from "./components/pathway-acquirers"
import ClosingCTA from "./components/closing-cta"
import HomepageWrapper from "./components/homepage-wrapper"

export const metadata: Metadata = {
  title: "CappaWork — AI for Main Street",
  description:
    "CappaWork embeds with $5M–$50M businesses and builds the operating systems they run on. You own the IP. We host and maintain it.",
  keywords: "AI for Main Street, forward-deployed engineering, custom operational software, first 100 days, operational software, business automation",
  openGraph: {
    title: "CappaWork — AI for Main Street",
    description: "CappaWork embeds with $5M–$50M businesses and builds the operating systems they run on. You own the IP. We host and maintain it.",
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
    description: "CappaWork embeds with $5M–$50M businesses and builds the operating systems they run on. You own the IP. We host and maintain it.",
    images: ["/linkedin-preview.jpg"],
  },
}

export default function HomePage() {
  return (
    <HomepageWrapper>
      <main className="min-h-screen">
        <Navigation />
        <Hero />
        <ProblemSection />
        <AboutSection />
        <HowItWorks />
        <SoftwareWeBuild />
        <StakesSection />
        <SuccessSection />
        <PathwayCapacity />
        <PathwayAcquirers />
        <ClosingCTA />
        <Footer />
      </main>
    </HomepageWrapper>
  )
}

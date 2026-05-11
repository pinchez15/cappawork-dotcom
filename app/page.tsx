import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import ProblemSection from "./components/problem-section"
import HowItWorks from "./components/how-it-works"
import AboutSection from "./components/about-section"
import ClosingCTA from "./components/closing-cta"
import HomepageWrapper from "./components/homepage-wrapper"

export const metadata: Metadata = {
  title: "CappaWork — Custom Software for American Businesses",
  description:
    "CappaWork designs, builds, hosts, and maintains custom software for $5M-$50M American businesses.",
  keywords: "custom software, American businesses, small business software, operational software, business automation",
  openGraph: {
    title: "CappaWork — Custom Software for American Businesses",
    description: "Custom software for $5M-$50M businesses. You own the IP. CappaWork builds, hosts, secures, and maintains it.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — Custom Software for American Businesses",
    description: "Custom software for $5M-$50M businesses. You own the IP. CappaWork builds, hosts, secures, and maintains it.",
  },
}

export default function HomePage() {
  return (
    <HomepageWrapper>
      <main className="min-h-screen">
        <Navigation />
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <AboutSection />
        <ClosingCTA />
        <Footer />
      </main>
    </HomepageWrapper>
  )
}

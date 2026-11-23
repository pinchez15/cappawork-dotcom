import type { Metadata } from "next"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import { InquiryProvider } from "./components/inquiry-modal"
import HomeHero from "./components/home/home-hero"
import HomeBelief from "./components/home/home-belief"
import HomeServices from "./components/home/home-services"
import HomeCompliance from "./components/home/home-compliance"
import HomeSprints from "./components/home/home-sprints"
import HomeProof from "./components/home/home-proof"
import HomeBook from "./components/home/home-book"

// Regenerate hourly so date-gated content (see lib/portfolio/data.ts) appears on time.
export const revalidate = 3600

const title = "CappaWork | AI for Healthcare, from strategy to production"
const description =
  "AI strategy, architecture, and agents for healthcare and life sciences. We find where AI pays back, design how it fits your systems, then build the agents and keep them running."

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
    <InquiryProvider>
      <Navigation />
      <main className="bg-warm-white">
        <HomeHero />
        <HomeServices />
        <HomeCompliance />
        <HomeSprints />
        <HomeProof />
        <HomeBelief />
        <HomeBook />
      </main>
      <Footer />
    </InquiryProvider>
  )
}

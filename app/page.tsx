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

const title = "CappaWork | AI workflows for healthcare and life sciences"
const description =
  "We design and build the AI workflows your licensed team should not still be doing by hand. Strategy, architecture, agents, and trial safety operations for healthcare and life sciences companies of about $50M and up."

export const metadata: Metadata = {
  title,
  description,
  keywords:
    "healthcare product team, life sciences software, clinical trial operations, trial safety, SAE intake, pharmacy operations, prior auth, embedded product team, AI agents, HIPAA",
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

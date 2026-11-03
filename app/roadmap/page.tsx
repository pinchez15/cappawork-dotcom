import type { Metadata } from "next"
import Navigation from "@/app/components/navigation"
import Footer from "@/app/components/footer"
import MarketingShell from "@/app/components/marketing-shell"
import RoadmapLanding from "@/app/components/roadmap-landing"

const title = "AI Opportunity Roadmap: $1,500, free when you build | CappaWork"
const description =
  "A fixed-price, model-agnostic roadmap of where AI pays off in your business. One hour with a founder or executive, about 10 hours of analysis, and a written plan in 1 to 2 weeks. $1,500 credited toward a CappaWork build signed within 60 days."

export const metadata: Metadata = {
  title,
  description,
  keywords:
    "AI opportunity roadmap, AI for manufacturers, quoting automation, vendor-neutral AI consulting, CappaWork",
  openGraph: {
    title,
    description,
    type: "website",
    url: "https://cappawork.com/roadmap",
    siteName: "CappaWork",
    locale: "en_US",
    images: [
      {
        url: "/linkedin-preview.jpg",
        width: 1200,
        height: 630,
        alt: "CappaWork AI Opportunity Roadmap",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/linkedin-preview.jpg"],
  },
  alternates: {
    canonical: "https://cappawork.com/roadmap",
  },
}

export default function RoadmapPage() {
  return (
    <MarketingShell>
      <main className="min-h-screen bg-warm-white">
        <Navigation />
        <RoadmapLanding />
        <Footer />
      </main>
    </MarketingShell>
  )
}

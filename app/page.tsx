import type { Metadata } from "next"
import Hero from "./components/hero"
import Navigation from "./components/navigation"
import Footer from "./components/footer"
import Blog from "./components/blog"
import NarrativeSection from "./components/narrative-section"
import ScaleProblem from "./components/scale-problem"
import WhatWeDo from "./components/what-we-do"
import EngagementSection from "./components/engagement-section"
import WhoThisIsFor from "./components/who-this-is-for"
import HowWereDifferent from "./components/how-were-different"
import WhatsAtStake from "./components/whats-at-stake"
import FAQSection from "./components/faq-section"

export const metadata: Metadata = {
  title: "CappaWork - Operational Analytics & Automation for Growing Businesses",
  description:
    "Custom dashboards and automations for businesses doing $3M-$10M who've outgrown spreadsheets but aren't ready for enterprise software.",
  keywords: "operational analytics, automation, dashboards, workflow automation, growing businesses, $3M-$10M, integration architecture",
  openGraph: {
    title: "CappaWork - Operational Analytics & Automation for Growing Businesses",
    description: "Custom dashboards and automations for businesses doing $3M-$10M who've outgrown spreadsheets but aren't ready for enterprise software.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    images: [
      {
        url: "https://cappawork.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "CappaWork - Operational Analytics & Automation for Growing Businesses",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork - Operational Analytics & Automation for Growing Businesses",
    description: "Custom dashboards and automations for businesses doing $3M-$10M who've outgrown spreadsheets but aren't ready for enterprise software.",
    images: ["https://cappawork.com/og-image.png"],
  },
}

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <Hero />
      <ScaleProblem />
      <WhatWeDo />

      {/* Proof Point: ArborKey */}
      <NarrativeSection
        title="Built for a 40-person arborist company."
        subtitle="Proof Point"
        description={
          <>
            <p>
              ArborKey was running estimates off spreadsheets and gut feel. They had no visibility
              into job profitability, crew utilization, or which contracts were actually making
              money.
            </p>
            <p>
              We mapped their operations, built a live dashboard, and uncovered $180K in
              underpriced contracts in the first three weeks. Their ops manager now saves 6 hours a
              week on reporting alone.
            </p>
            <p className="font-medium text-stone-900">
              The dashboard didn't just show them data — it changed how they run the business.
            </p>
          </>
        }
        imageSrc="/arborkey2.png"
        imageAlt="ArborKey Operations Dashboard"
        imagePosition="right"
        backgroundColor="stone"
      />

      <EngagementSection />
      <WhoThisIsFor />
      <HowWereDifferent />
      <WhatsAtStake />
      <FAQSection />
      <Blog />
      <Footer />
    </main>
  )
}

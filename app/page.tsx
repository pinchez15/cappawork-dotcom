import type { Metadata } from "next"
import Hero from "./components/hero"
import Portfolio from "./components/portfolio"
import Services from "./components/services"
import About from "./components/about"
import Navigation from "./components/navigation"
import CTASection from "./components/cta-section"
import Blog from "./components/blog"

export const metadata: Metadata = {
  title: "CappaWork - Web Development Agency",
  description:
    "Build products that help people flourish. CappaWork is a web development agency crafting tools with clarity, utility, and restraint.",
  keywords: "product development, web development agency, MVP development, prototyping, Next.js, AI integration",
  openGraph: {
    title: "CappaWork - Build Products That Help People Flourish",
    description: "Web development agency crafting tools with clarity, utility, and restraint.",
    type: "website",
    url: "https://cappawork.com",
    siteName: "CappaWork",
    images: [
      {
        url: "/WP1.png",
        width: 1200,
        height: 630,
        alt: "CappaWork - Product Development Portfolio",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork - Build Products That Help People Flourish",
    description: "Web development agency crafting tools with clarity, utility, and restraint.",
    images: ["/WP1.png"],
  },
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <Hero />
      <Portfolio />
      <Services />
      <CTASection />
      <About />
      <Blog />
    </main>
  )
}

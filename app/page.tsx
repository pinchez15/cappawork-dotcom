import type { Metadata } from "next"
import Hero from "./components/hero"
import Portfolio from "./components/portfolio"
import Services from "./components/services"
import About from "./components/about"
import Navigation from "./components/navigation"
import CTASection from "./components/cta-section"
import Blog from "./components/blog"

export const metadata: Metadata = {
  title: "CappaWork - Catholic Product Development Agency",
  description:
    "Build products that help people flourish. CappaWork is a Catholic product development agency crafting tools with clarity, utility, and restraint.",
  keywords: "product development, Catholic agency, MVP development, prototyping, Next.js, AI integration",
  openGraph: {
    title: "CappaWork - Build Products That Help People Flourish",
    description: "Catholic product development agency crafting tools with clarity, utility, and restraint.",
    type: "website",
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

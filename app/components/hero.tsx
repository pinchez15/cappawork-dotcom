"use client"

import { ArrowRight, ChevronDown } from "lucide-react"

export default function Hero() {
  const scrollToPortfolio = () => {
    const element = document.getElementById("portfolio")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToContact = () => {
    const element = document.getElementById("contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-stone-900 mb-6 leading-tight">
          Build Products That Help
          <br />
          <span className="font-medium">People Flourish</span>
        </h1>

        <p className="text-lg sm:text-xl text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed">
          CappaWork is a Catholic product development agency. We build our own tools—and yours too.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <button
            onClick={scrollToContact}
            className="group bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 flex items-center gap-2"
          >
            Let's Build Yours
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={scrollToPortfolio}
            className="text-stone-700 px-8 py-4 font-medium hover:text-stone-900 transition-colors border border-stone-300 rounded-sm hover:border-stone-400"
          >
            Explore Our Work
          </button>
        </div>

        <button
          onClick={scrollToPortfolio}
          className="text-stone-400 hover:text-stone-600 transition-colors animate-bounce"
          aria-label="Scroll to portfolio"
        >
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  )
}

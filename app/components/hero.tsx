"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import ContactForm from "./contact-form"

export default function Hero() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  const scrollToPricing = () => {
    const element = document.getElementById("pricing")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openContactForm = () => {
    setIsContactFormOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeContactForm = () => {
    setIsContactFormOpen(false)
    document.body.style.overflow = "unset"
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isContactFormOpen) {
        closeContactForm()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isContactFormOpen])

  return (
    <>
      <section id="hero" className="min-h-screen flex items-center justify-center pt-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-light text-stone-900 mb-6 leading-tight">
            Product Development Services<br />for Owner-Led Businesses
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            CappaWork builds modern, scalable internal tools and early-stage products for owner-led businesses who want startup-level velocity without hiring a full tech team.
          </p>
          <p className="text-base sm:text-lg text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            All projects follow the same high-quality product development track:<br />
            <span className="font-medium text-stone-700">Discovery → Problem Definition → Architecture → UX → Build → Deploy.</span><br />
            Each pricing tier simply advances farther along that track.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={scrollToPricing}
              className="group bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 flex items-center gap-2"
            >
              See Pricing
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <a
              href="/cohort"
              className="text-stone-700 px-8 py-4 font-medium hover:text-stone-900 transition-colors border border-stone-300 rounded-sm hover:border-stone-400"
            >
              Join the Cohort
            </a>
          </div>
        </div>
      </section>
      <ContactForm isOpen={isContactFormOpen} onClose={closeContactForm} />
    </>
  )
}


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
            End-to-End Product Development<br />for Owner-Led Businesses
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            We build internal tools and MVPs that your team actually uses—and your market can eventually buy.
          </p>
          <p className="text-base sm:text-lg text-stone-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            If your business does good work for real people, you deserve software that supports that work, not slows it down.
          </p>
          <div className="mb-8 max-w-xl mx-auto">
            <p className="text-lg text-stone-700 mb-2">You bring industry expertise.</p>
            <p className="text-lg text-stone-700">We build the product that turns it into leverage.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={openContactForm}
              className="group bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 flex items-center gap-2"
            >
              Let's Talk
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={scrollToPricing}
              className="text-stone-700 px-8 py-4 font-medium hover:text-stone-900 transition-colors border border-stone-300 rounded-sm hover:border-stone-400"
            >
              See Pricing
            </button>
          </div>
        </div>
      </section>
      <ContactForm isOpen={isContactFormOpen} onClose={closeContactForm} />
    </>
  )
}


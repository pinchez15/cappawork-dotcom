"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ChevronDown } from "lucide-react"
import ContactForm from "./contact-form"

export default function Hero() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  const scrollToPortfolio = () => {
    const element = document.getElementById("portfolio")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const openContactForm = () => {
    setIsContactFormOpen(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"
  }

  const closeContactForm = () => {
    setIsContactFormOpen(false)
    // Restore body scroll
    document.body.style.overflow = "unset"
  }

  // Handle escape key to close modal
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
            Build the Product That's Been on Your Mind
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            You bring the vision. We help you make it real.<br /><br />
            CappaWork is a Catholic product development agency. We help founders and businesses turn good ideas into working products—quickly, clearly, and without compromise.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={openContactForm}
              className="group bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 flex items-center gap-2"
            >
              Start Your Build
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={scrollToPortfolio}
              className="text-stone-700 px-8 py-4 font-medium hover:text-stone-900 transition-colors border border-stone-300 rounded-sm hover:border-stone-400"
            >
              See What We've Built
            </button>
          </div>
        </div>
      </section>
      <section className="w-full bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Left column: Headline */}
            <div className="md:w-1/2 w-full mb-4 md:mb-0">
              <h2 className="text-4xl sm:text-5xl lg:text-7xl font-serif font-light text-stone-900 text-left leading-tight">
                A Product Development Partner That Moves Like a Founder
              </h2>
            </div>
            {/* Right column: Supporting text */}
            <div className="md:w-1/2 w-full">
              <p className="text-lg text-stone-600 max-w-2xl text-left">
                You don't need another dev shop.<br />
                You need someone who thinks like a builder and acts like an owner.<br /><br />
                We work with purpose-driven businesses and non-profits to design and launch products that serve others, and do it well. From early prototypes to full product launches, we bring the momentum, clarity, and technical ability you need to move forward.<br /><br />
                Whether you're shaping a new internal tool, testing a product idea, or building something that's been sitting in your notebook for months, we'll help you ship it.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Contact Form Modal */}
      <ContactForm isOpen={isContactFormOpen} onClose={closeContactForm} />
    </>
  )
}

"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import ContactForm from "./contact-form"

export default function CTASection() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)

  const openContactForm = () => {
    setIsContactFormOpen(true)
    document.body.style.overflow = "hidden"
  }

  const closeContactForm = () => {
    setIsContactFormOpen(false)
    document.body.style.overflow = "unset"
  }

  return (
    <>
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-stone-900 mb-8">
            If you want software your team loves—and a foundation your customers will trust—let's talk.
          </h2>

          <button
            onClick={openContactForm}
            className="group bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 inline-flex items-center gap-2"
          >
            Let's Talk
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
      <ContactForm isOpen={isContactFormOpen} onClose={closeContactForm} />
    </>
  )
}


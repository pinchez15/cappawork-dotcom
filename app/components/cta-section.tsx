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
          <h2 className="text-2xl sm:text-3xl font-serif font-light text-stone-900 mb-6">
            If you want software your team loves—and a foundation your customers will trust—let's talk.
          </h2>
          
          <div className="space-y-4 mb-8 text-lg text-stone-700">
            <p>Send the tool you're fighting with.</p>
            <p>Describe the workflow that breaks.</p>
            <p>Show the MVP you're embarrassed to demo.</p>
          </div>

          <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
            We'll quickly tell you what's possible—and how fast we can get you there.
          </p>

          <button
            onClick={openContactForm}
            className="group bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 inline-flex items-center gap-2"
          >
            Let's Talk
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="mt-12 text-sm text-stone-500">
            CappaWork — Better tools for businesses doing good work.
          </p>
        </div>
      </section>
      <ContactForm isOpen={isContactFormOpen} onClose={closeContactForm} />
    </>
  )
}


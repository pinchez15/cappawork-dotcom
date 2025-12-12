"use client"

import { useState } from "react"
import Navigation from "../components/navigation"
import Footer from "../components/footer"
import ContactForm from "../components/contact-form"

export default function ContactPage() {
  const [isFormOpen, setIsFormOpen] = useState(true)

  return (
    <>
      <main className="min-h-screen bg-stone-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
              Let's Talk
            </h1>
            <p className="text-lg text-stone-600 mb-12">
              Send the tool you're fighting with. Describe the workflow that breaks. Show the MVP you're embarrassed to demo. We'll quickly tell you what's possible—and how fast we can get you there.
            </p>

            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8">
              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-all duration-200"
              >
                Open Contact Form
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
      <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </>
  )
}

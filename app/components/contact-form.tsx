"use client"

import React, { useState } from "react"
import { X, Send, User, Lightbulb, Mail } from "lucide-react"

interface ContactFormProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    project: "",
    contact: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      // Using Formspree - you'll need to sign up and replace YOUR_FORM_ID
      const response = await fetch("https://formspree.io/f/xjkrlgre", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          project: formData.project,
          contact: formData.contact,
          _subject: "New Contact Form Submission - CappaWork",
        }),
      })

      if (response.ok) {
        setIsSubmitted(true)
        // Reset form after 3 seconds and close
        setTimeout(() => {
          setFormData({ name: "", project: "", contact: "" })
          setIsSubmitted(false)
          onClose()
        }, 3000)
      } else {
        throw new Error("Failed to submit form")
      }
    } catch (err) {
      setError("Sorry, something went wrong. Please try again or email us directly.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleModalClick}
    >
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-2xl font-serif font-medium text-stone-900">Let's Build Yours</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
            aria-label="Close form"
          >
            <X size={24} className="text-stone-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-stone-900 mb-2">Message Sent!</h3>
              <p className="text-stone-600">
                Thanks for reaching out. We'll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <p className="text-stone-600 mb-6 leading-relaxed">
                Tell us about your project and we'll reach out to discuss how we can help you build something great.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Introduce Yourself */}
                <div>
                  <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                    <User size={16} />
                    Introduce yourself
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name and a bit about yourself..."
                    required
                    className="w-full px-4 py-3 border border-stone-300 rounded-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* What You're Building */}
                <div>
                  <label htmlFor="project" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                    <Lightbulb size={16} />
                    What you're interested in building
                  </label>
                  <textarea
                    id="project"
                    name="project"
                    value={formData.project}
                    onChange={handleInputChange}
                    placeholder="Describe your project idea, goals, or what you need help with..."
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-stone-300 rounded-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all resize-y"
                  />
                </div>

                {/* Contact Info */}
                <div>
                  <label htmlFor="contact" className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-2">
                    <Mail size={16} />
                    Where we can reach you
                  </label>
                  <input
                    type="email"
                    id="contact"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    placeholder="your.email@example.com"
                    required
                    className="w-full px-4 py-3 border border-stone-300 rounded-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-sm">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-stone-900 text-stone-50 px-6 py-3 rounded-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-300 border-t-stone-50 rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-4 text-center text-sm text-stone-500">
          Press <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-xs">Esc</kbd> or click outside to close
        </div>
      </div>
    </div>
  )
} 
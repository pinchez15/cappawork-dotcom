"use client"

import { useState } from "react"
import Navigation from "../../components/navigation"
import { ArrowRight, Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

export default function CohortCheckoutPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const spotsRemaining = process.env.NEXT_PUBLIC_COHORT_SPOTS_REMAINING || "30"
  const startDate = process.env.NEXT_PUBLIC_COHORT_START_DATE || "TBD"
  const isEarlyBird = process.env.NEXT_PUBLIC_COHORT_EARLY_BIRD === "true"
  const price = isEarlyBird ? "$490" : "$990"

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Create checkout session
      const response = await fetch("/api/cohort/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          earlyBird: isEarlyBird,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create checkout session")
      }

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      if (!stripe) {
        throw new Error("Stripe failed to load")
      }

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 rounded-sm border border-stone-200">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">
                Reserve Your Spot
              </h1>
              <p className="text-stone-600 mb-6">
                Complete your registration for The CappaWork Builder Cohort
              </p>

              {/* Pricing Info */}
              <div className="bg-stone-50 p-6 rounded-sm border border-stone-200 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-stone-700">Cohort Program</span>
                  <span className="text-2xl font-serif font-light text-stone-900">{price}</span>
                </div>
                {isEarlyBird && (
                  <p className="text-sm text-stone-600 mt-2">
                    Early Bird Pricing (Regular price: $990)
                  </p>
                )}
                <p className="text-sm text-stone-500 mt-2">
                  {spotsRemaining} spots remaining • Starts {startDate}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your.email@example.com"
                  required
                  className="w-full px-4 py-3 border border-stone-300 rounded-sm focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all"
                />
                <p className="text-xs text-stone-500 mt-1">
                  We'll send you cohort details and access information to this email.
                </p>
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
                disabled={isLoading}
                className="w-full group bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Continue to Payment
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-xs text-stone-500 text-center">
                You'll be redirected to Stripe to complete your payment securely.
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}


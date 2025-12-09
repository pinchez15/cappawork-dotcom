"use client"

import Navigation from "../../components/navigation"
import { ArrowRight } from "lucide-react"

export default function CohortCheckoutPage() {
  const spotsRemaining = process.env.NEXT_PUBLIC_COHORT_SPOTS_REMAINING || "30"
  const startDate = process.env.NEXT_PUBLIC_COHORT_START_DATE || "TBD"
  const isEarlyBird = process.env.NEXT_PUBLIC_COHORT_EARLY_BIRD === "true"
  const price = isEarlyBird ? "$490" : "$990"
  const stripeCheckoutUrl = process.env.NEXT_PUBLIC_STRIPE_CHECKOUT_URL || "https://buy.stripe.com/your-link"

  const handleCheckout = () => {
    window.open(stripeCheckoutUrl, "_blank", "noopener,noreferrer")
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

            <div className="space-y-6">
              <p className="text-stone-600 leading-relaxed">
                Click the button below to complete your payment and reserve your spot in The CappaWork Builder Cohort.
              </p>

              <button
                onClick={handleCheckout}
                className="w-full group bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Continue to Payment
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <p className="text-xs text-stone-500 text-center">
                You'll be redirected to Stripe to complete your payment securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}


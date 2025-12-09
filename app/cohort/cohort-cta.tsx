"use client"

import React from "react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function CohortCTA() {
  // Get cohort info from environment or defaults
  const spotsRemaining = process.env.NEXT_PUBLIC_COHORT_SPOTS_REMAINING || "30"
  const startDate = process.env.NEXT_PUBLIC_COHORT_START_DATE || "TBD"
  const isEarlyBird = process.env.NEXT_PUBLIC_COHORT_EARLY_BIRD === "true"
  const price = isEarlyBird ? "$490" : "$990"

  return (
    <div className="bg-white p-8 rounded-sm border border-stone-200 max-w-md mx-auto">
      <div className="text-center mb-6">
        <div className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-2">
          {price}
        </div>
        {isEarlyBird && (
          <p className="text-sm font-medium text-stone-700 mb-1">
            Early Bird Pricing
          </p>
        )}
        <p className="text-sm text-stone-600 mb-2">
          {spotsRemaining} spots remaining
        </p>
        <p className="text-xs text-stone-500">
          Next cohort starts: {startDate}
        </p>
      </div>
      
      <Link
        href="/cohort/checkout"
        className="w-full group bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 flex items-center justify-center gap-2"
      >
        Reserve your spot
        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}


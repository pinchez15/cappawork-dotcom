"use client"

import React from "react"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export default function EnrollmentCard({ className = "" }: { className?: string }) {
  const price = "$1,000"
  const nextCohortDate = "March 2026"

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-stone-200 p-8 ${className}`}>
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
           <span className="text-4xl font-semibold tracking-tight text-stone-900">{price}</span>
        </div>
        <p className="text-sm text-stone-500 mb-6">
          Limited to 10 committed builders
        </p>

        <button
          onClick={() => {
            const element = document.getElementById("checkout")
            if (element) {
              element.scrollIntoView({ behavior: "smooth" })
            }
          }}
          className="w-full bg-blue-600 text-white py-4 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mb-4"
        >
          Apply Now
          <ArrowRight size={18} />
        </button>

        <p className="text-xs text-stone-500">
          Next Cohort: <span className="font-medium text-stone-900">{nextCohortDate}</span>
        </p>
      </div>

      <div className="space-y-3 pt-6 border-t border-stone-100">
        <div className="flex items-start gap-3 text-sm text-stone-600">
          <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <span>4 Weekly Live Calls</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-stone-600">
          <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <span>LinkedIn Alumni Group Access</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-stone-600">
          <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <span>Direct access to instructors</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-stone-600">
           <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
           <span>If you need to cancel, join any future cohort for free.</span>
        </div>
      </div>
    </div>
  )
}

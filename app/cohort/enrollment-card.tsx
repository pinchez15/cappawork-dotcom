"use client"

import React from "react"
import { ArrowRight, Check } from "lucide-react"
import Link from "next/link"

export default function EnrollmentCard({ className = "" }: { className?: string }) {
  // Hardcoded for now based on user request, but could be env vars
  const isEarlyBird = true
  const price = "$500"
  const fullPrice = "$1,000"
  const spotsRemaining = "24" // Example number
  const nextCohortDate = "January 2025"

  return (
    <div className={`bg-white rounded-2xl shadow-xl border border-stone-200 p-8 ${className}`}>
      <div className="mb-6 text-center">
        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full mb-4">
          Limited Early Bird
        </span>
        <div className="flex items-center justify-center gap-3 mb-2">
           <span className="text-4xl font-semibold tracking-tight text-stone-900">{price}</span>
           <span className="text-xl text-stone-400 line-through decoration-stone-400 decoration-2">{fullPrice}</span>
        </div>
        <p className="text-sm text-stone-500 mb-6">
          For the first 30 spots only.
        </p>

        <Link
          href="/cohort/checkout"
          className="w-full bg-blue-600 text-white py-4 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 mb-4"
        >
          Apply Now
          <ArrowRight size={18} />
        </Link>

        <p className="text-xs text-stone-500">
          Next Cohort: <span className="font-medium text-stone-900">{nextCohortDate}</span>
        </p>
      </div>

      <div className="space-y-3 pt-6 border-t border-stone-100">
        <div className="flex items-start gap-3 text-sm text-stone-600">
          <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <span>3 Weekly Live Calls</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-stone-600">
          <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <span>Private Community Access</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-stone-600">
          <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
          <span>Lifetime Curriculum Access</span>
        </div>
        <div className="flex items-start gap-3 text-sm text-stone-600">
           <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
           <span>100% Money-Back Guarantee</span>
        </div>
      </div>
    </div>
  )
}

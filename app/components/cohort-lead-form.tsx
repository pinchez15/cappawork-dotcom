"use client"

import { useState, FormEvent } from "react"
import { ArrowRight, Check, Loader2 } from "lucide-react"

type CohortType = "build" | "literacy"

export default function CohortLeadForm({
  cohortType,
  seatLabel = "Request my seat",
}: {
  cohortType: CohortType
  seatLabel?: string
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "submitting") return

    const form = e.currentTarget
    const data = new FormData(form)
    const payload = {
      linkedin: String(data.get("linkedin") || ""),
      email: String(data.get("email") || ""),
      cohortType,
    }

    setStatus("submitting")
    setError(null)

    try {
      const res = await fetch("/api/cohort/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Something went wrong. Please try again.")
      }

      setStatus("success")
    } catch (err) {
      setStatus("error")
      setError(err instanceof Error ? err.message : "Something went wrong.")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-white">
          <Check size={24} />
        </div>
        <p className="text-lg font-medium text-stone-900">Thanks — request received.</p>
        <p className="mt-2 text-stone-600">
          Nate will be in touch within 24 hours to see if you qualify for this cohort.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="space-y-2">
        <label htmlFor="linkedin" className="block text-sm font-medium text-stone-700">
          LinkedIn URL
        </label>
        <input
          id="linkedin"
          name="linkedin"
          type="text"
          required
          placeholder="linkedin.com/in/your-name"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          className="w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {status === "error" && error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-8 py-4 font-medium text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:bg-blue-700 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={18} className="mr-2 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            {seatLabel}
            <ArrowRight size={18} className="ml-2" />
          </>
        )}
      </button>

      <p className="text-center text-xs text-stone-400">
        Nate reviews every request personally and replies within 24 hours.
      </p>
    </form>
  )
}

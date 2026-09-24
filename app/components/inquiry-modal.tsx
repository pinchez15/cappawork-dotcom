"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { ArrowRight, X, Check, Loader2 } from "lucide-react"
import { REVENUE_BANDS } from "@/lib/discovery"

type InquiryContextType = {
  open: (preselect?: string) => void
  available: boolean
}

const InquiryContext = createContext<InquiryContextType>({ open: () => {}, available: false })

export function useInquiry() {
  return useContext(InquiryContext)
}

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const open = useCallback(() => {
    const el = document.getElementById("discovery")
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
      return
    }
    setIsOpen(true)
  }, [])

  return (
    <InquiryContext.Provider value={{ open, available: true }}>
      {children}
      {isOpen && <InquiryModalContent onClose={() => setIsOpen(false)} />}
    </InquiryContext.Provider>
  )
}

export function DiscoveryForm({ idPrefix = "discovery" }: { idPrefix?: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [company, setCompany] = useState("")
  const [revenue, setRevenue] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  const fieldClass =
    "w-full rounded-md border border-stone-300 bg-white px-4 py-3 text-navy placeholder:text-stone-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    try {
      const res = await fetch("/api/service-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          role: role.trim(),
          company: company.trim(),
          revenue,
          service: "Discovery",
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Something went wrong")
      }

      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="py-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 mb-5">
          <Check size={24} className="text-green-600" />
        </div>
        <h3 className="font-display text-2xl text-navy">We have it.</h3>
        <p className="mt-2 text-stone-600">
          We will reach out to schedule the discovery call.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field id={`${idPrefix}-name`} label="Your name">
        <input
          id={`${idPrefix}-name`}
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field id={`${idPrefix}-email`} label="Work email">
        <input
          id={`${idPrefix}-email`}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field id={`${idPrefix}-role`} label="Your role">
        <input
          id={`${idPrefix}-role`}
          type="text"
          required
          autoComplete="organization-title"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field id={`${idPrefix}-company`} label="Company name">
        <input
          id={`${idPrefix}-company`}
          type="text"
          required
          autoComplete="organization"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className={fieldClass}
        />
      </Field>
      <Field id={`${idPrefix}-revenue`} label="Company annual revenue">
        <select
          id={`${idPrefix}-revenue`}
          required
          value={revenue}
          onChange={(e) => setRevenue(e.target.value)}
          className={fieldClass}
        >
          <option value="" disabled>
            Select a range
          </option>
          {REVENUE_BANDS.map((band) => (
            <option key={band} value={band}>
              {band}
            </option>
          ))}
        </select>
      </Field>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-gold text-navy py-3.5 text-sm font-medium rounded-full hover:bg-gold/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Sending
          </>
        ) : (
          <>
            Book a Discovery Call
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </form>
  )
}

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-700">
        {label}
      </label>
      {children}
    </div>
  )
}

function InquiryModalContent({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-8 sm:py-16"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-warm-white text-navy shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} className="text-stone-500" />
        </button>
        <div className="p-8 sm:p-10">
          <p className="text-xs font-semibold tracking-[0.16em] uppercase text-gold mb-3">
            Discovery
          </p>
          <h2 className="font-display text-3xl tracking-tight mb-2">Book a discovery call</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            A short conversation on how the operation runs today, and where a change in the work would matter first.
          </p>
          <DiscoveryForm idPrefix="modal" />
        </div>
      </div>
    </div>
  )
}

"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { ArrowRight, X, Check, Loader2 } from "lucide-react"

type InquiryContextType = {
  open: (preselect?: string) => void
  available: boolean
}

const InquiryContext = createContext<InquiryContextType>({ open: () => {}, available: false })

export function useInquiry() {
  return useContext(InquiryContext)
}

const serviceOptions = [
  { value: "AI Team", label: "Your AI Team — $15K/month, 6 months" },
  { value: "AI Strategy Advisor", label: "1:1 Strategy Call — $2,000/hour" },
  { value: "AI VP Cohort", label: "AI VP Cohort — $3,500, 6 weeks" },
  { value: "Something else", label: "Something else" },
]

export function InquiryProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [preselectedService, setPreselectedService] = useState("")

  const open = useCallback((preselect?: string) => {
    setPreselectedService(preselect || "")
    setIsOpen(true)
  }, [])

  return (
    <InquiryContext.Provider value={{ open, available: true }}>
      {children}
      {isOpen && (
        <InquiryModalContent
          preselectedService={preselectedService}
          onClose={() => {
            setIsOpen(false)
            setPreselectedService("")
          }}
        />
      )}
    </InquiryContext.Provider>
  )
}

function InquiryModalContent({
  preselectedService,
  onClose,
}: {
  preselectedService: string
  onClose: () => void
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [linkedin, setLinkedin] = useState("")
  const [service, setService] = useState(preselectedService || "AI Team")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

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
          linkedin: linkedin.trim(),
          service,
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-8 sm:py-16"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="relative w-full max-w-lg bg-warm-white text-navy rounded-2xl shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200 transition-colors z-10"
          aria-label="Close"
        >
          <X size={20} className="text-stone-500" />
        </button>

        <div className="p-8 sm:p-10">
          {submitted ? (
            <div className="text-center py-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 mb-6">
                <Check size={28} className="text-green-600" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight mb-3">
                Got it — I&rsquo;ll reach out
              </h2>
              <p className="text-stone-600 mb-8">
                Expect to hear from me shortly.
              </p>
              <button
                onClick={onClose}
                className="text-sm font-medium text-stone-500 hover:text-navy transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight mb-2">
                Let&rsquo;s talk
              </h2>
              <p className="text-stone-600 mb-8">
                Drop your details and I&rsquo;ll reach out.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="inquiry-name" className="mb-1 block text-sm font-medium text-stone-700">
                    Name
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-navy placeholder:text-stone-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-email" className="mb-1 block text-sm font-medium text-stone-700">
                    Email
                  </label>
                  <input
                    id="inquiry-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-navy placeholder:text-stone-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-linkedin" className="mb-1 block text-sm font-medium text-stone-700">
                    LinkedIn profile
                  </label>
                  <input
                    id="inquiry-linkedin"
                    type="text"
                    required
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="linkedin.com/in/janesmith"
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-navy placeholder:text-stone-400 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-service" className="mb-1 block text-sm font-medium text-stone-700">
                    I&rsquo;m interested in
                  </label>
                  <select
                    id="inquiry-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 text-navy focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20"
                  >
                    {serviceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gold text-navy py-4 rounded-full font-semibold text-lg hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Let&rsquo;s Go
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

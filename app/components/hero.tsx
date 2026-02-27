"use client"

import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="hero" className="relative pt-32 pb-16 md:pt-48 md:pb-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm font-medium text-stone-600 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2"></span>
          Operational Analytics & Automation
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-stone-900 mb-6 leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Your operations are the most expensive <br className="hidden md:block" />
          thing you're not measuring.
        </h1>

        {/* Subheading */}
        <p className="mt-4 text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          We help founder-led businesses doing $3M–$10M find and fix the margin leaks that grow with revenue. Analytics first. Implementation second.
        </p>

        {/* CTA */}
        <div className="flex justify-center items-center mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <button
            onClick={handleBookCall}
            className="bg-blue-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 text-lg shadow-lg shadow-blue-500/20 hover:scale-105 transform"
          >
            Book a Diagnostic Call
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Hero Image */}
        <div
          className="relative mx-auto w-full max-w-5xl lg:max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500"
          style={{ perspective: "2000px" }}
        >
          <div
            className="relative rounded-2xl border border-stone-200 bg-stone-100/50 p-2 shadow-2xl lg:rounded-3xl lg:p-4 transition-all duration-500 hover:scale-[1.01]"
            style={{ transform: "rotateX(2deg)" }}
          >
            <Image
              src="/coworking.png"
              alt="CappaWork operational analytics dashboard for growing businesses"
              width={2400}
              height={1600}
              className="rounded-xl lg:rounded-2xl shadow-sm block w-full h-auto"
              priority
            />
          </div>

          {/* Decorative gradients */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-70"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl -z-10 mix-blend-multiply opacity-70"></div>
        </div>
      </div>
    </section>
  )
}

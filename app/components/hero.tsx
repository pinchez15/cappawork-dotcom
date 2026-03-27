"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function Hero() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center bg-navy overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-32">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-white mb-6 leading-[1.1]"
        >
          Elevate your people.{" "}
          <br className="hidden md:block" />
          Automate your process.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="text-xl md:text-2xl text-gold font-display mb-8"
        >
          Your AI transformation partner for founder-led businesses.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed space-y-4"
        >
          <p>
            Let computers do computer work — the data entry, the follow-ups, the reporting that eats your team&apos;s day. We help you implement AI so your people can focus on the work that actually moves the business forward.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
        >
          <button
            onClick={handleBookCall}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Start a Conversation
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

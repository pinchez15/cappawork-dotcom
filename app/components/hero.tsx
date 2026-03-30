"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useInquiry } from "./inquiry-modal"

export default function Hero() {
  const { open } = useInquiry()

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
          Let computers do computer work. So your people can work like people again.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed space-y-4"
        >
          <p>
            Your team is buried in manual work that machines should handle. We become your AI team — we find where the money is leaking, build the systems that fix it, and train your people to own what we build.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
        >
          <button
            onClick={() => open()}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Book a Call
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    </section>
  )
}

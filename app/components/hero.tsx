"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function Hero() {
  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  const handleBookCall = () => {
    window.open(calendlyLink, "_blank", "noopener,noreferrer")
  }

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center bg-navy overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-32">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-shrink-0"
          >
            <Image
              src="/nate-headshot.png"
              alt="Nate Pinches, founder of CappaWork"
              width={280}
              height={280}
              className="rounded-2xl object-cover"
              priority
            />
          </motion.div>

          {/* Copy */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-[1.1]"
            >
              CappaWork becomes your AI&nbsp;team.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-xl"
            >
              We work across your entire business — profitability, operations, product development, training — not one project at a time. We find the opportunity, decide on it with you, scope it, build it, and train your team to own&nbsp;it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            >
              <button
                onClick={handleBookCall}
                className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
              >
                Book a Call
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

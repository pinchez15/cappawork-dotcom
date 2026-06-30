"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useInquiry } from "./inquiry-modal"
import { useRef, useEffect } from "react"

export default function Hero() {
  const { open } = useInquiry()
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasPlayedRef = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.playbackRate = 0.6

    const handleScroll = () => {
      if (window.scrollY === 0 && hasPlayedRef.current) {
        hasPlayedRef.current = false
        video.currentTime = 0
        video.play()
      }
    }

    const handleEnded = () => {
      hasPlayedRef.current = true
    }

    video.addEventListener("ended", handleEnded)
    window.addEventListener("scroll", handleScroll)
    return () => {
      video.removeEventListener("ended", handleEnded)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center bg-navy overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          preload="auto"
          className="absolute top-0 left-0 w-full h-[110%] object-cover"
        >
          <source src="/CappaWork_video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-navy/60" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-32">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-sm font-semibold tracking-widest uppercase text-gold mb-6"
        >
          AI for Main Street
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="font-display text-5xl md:text-6xl lg:text-7xl tracking-tight text-white mb-8 leading-[1.1]"
        >
          Help your team do more human work.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg text-white/70 max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          We help founder-led businesses become AI-native with custom software and embedded engineering that moves the busywork to machines and the judgment back to your team.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.28, ease: "easeOut" }}
          className="text-base text-white/50 max-w-xl mx-auto mb-12 leading-relaxed"
        >
          Discover. Build. Modernize.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={() => open()}
            className="bg-gold text-navy px-8 py-3.5 rounded-full font-medium hover:bg-gold/90 transition-all duration-200 inline-flex items-center gap-2 text-lg"
          >
            Book a Free Working Session
            <ArrowRight size={18} />
          </button>
          <Link
            href="/#services"
            className="text-white/80 hover:text-white transition-colors duration-200 inline-flex items-center gap-1.5 text-base font-medium"
          >
            See how we work
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

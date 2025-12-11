"use client"

import Image from "next/image"

const logos = [
  { src: "/logos/chatgpt.png", alt: "ChatGPT", name: "ChatGPT" },
  { src: "/logos/Claude_AI_logo.png", alt: "Claude AI", name: "Claude AI" },
  { src: "/logos/claudecode.png", alt: "Claude Code", name: "Claude Code" },
  { src: "/logos/clerk.jpeg", alt: "Clerk", name: "Clerk" },
  { src: "/logos/cursor.jpg", alt: "Cursor", name: "Cursor" },
  { src: "/logos/github.png", alt: "GitHub", name: "GitHub" },
  { src: "/logos/google-gemini-new-rainbow-colours.jpg", alt: "Google Gemini", name: "Google Gemini" },
  { src: "/logos/posthog.png", alt: "PostHog", name: "PostHog" },
  { src: "/logos/supabase-logo_brandlogos.net_wahxg-scaled.png", alt: "Supabase", name: "Supabase" },
  { src: "/logos/vercel-logotype-dark.png", alt: "Vercel", name: "Vercel" },
]

export default function LogoBanner() {
  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos]

  return (
    <section className="py-12 md:py-16 bg-white border-y border-stone-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <h2 className="text-center text-2xl font-semibold text-stone-900">Tools we use</h2>
      </div>
      <div className="relative">
        {/* Gradient fade on left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        
        {/* Gradient fade on right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <div className="flex animate-logo-scroll gap-12 md:gap-16 items-center">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 flex items-center justify-center h-12 md:h-16 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={120}
                height={48}
                className="h-8 md:h-12 w-auto object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

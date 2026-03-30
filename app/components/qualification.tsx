"use client"

import { Check } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const qualifiers = [
  "You're doing $3–10M in revenue but profit margins are thinner than they should be and you can feel the manual work dragging",
  "You know AI could help but you don't know where to start and you don't trust a dev shop to figure out your business",
  "You've tried AI tools — they didn't move the needle because nobody rethought the workflow underneath",
  "You want someone who understands both business strategy and how to build, not a strategist who hands you a deck and walks away",
  "You want to own what gets built, not rent it",
  "You're a founder or CEO who makes decisions fast once you trust the person advising you",
]

export default function Qualification() {
  return (
    <section id="fit" className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
            Is This Right for You?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-white leading-tight mb-12">
            This is for you if&hellip;
          </h2>
        </FadeInUp>

        <StaggerContainer className="space-y-6">
          {qualifiers.map((item) => (
            <StaggerItem key={item}>
              <div className="flex gap-4 items-start">
                <div className="flex-shrink-0 mt-1">
                  <Check size={20} className="text-gold" />
                </div>
                <p className="text-white/80 leading-relaxed">
                  {item}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

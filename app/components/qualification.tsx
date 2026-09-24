"use client"

import { Check } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const qualifiers = [
  "You're over ~$50M in revenue (or running a department that size) and can fund a one-check engagement",
  "You know AI could help but you don't trust a year-long transformation theater or a pile of tool seats",
  "You've tried AI tools — they didn't move the needle because nobody rethought the workflow underneath",
  "You want someone who understands operations AND can ship production agents in your environment",
  "You want to own what gets built, not rent it",
  "You're an operator or executive who makes decisions fast once you trust the person advising you",
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

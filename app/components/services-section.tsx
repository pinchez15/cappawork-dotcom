"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"
import { SERVICES } from "../services/data"

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="max-w-3xl mb-12">
            <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-4">
              Services
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight">
              AI training, strategy, and builds — scoped to where you are right now.
            </h2>
          </div>
        </FadeInUp>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <StaggerItem key={service.slug}>
              <Link
                href={`/services/${service.slug}`}
                className="group flex flex-col h-full p-6 sm:p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300"
              >
                <span className="text-sm font-semibold tracking-widest uppercase text-gold mb-3">
                  {service.price}
                </span>
                <h3 className="text-xl font-semibold tracking-tight text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-white/60 mb-1">
                  {service.priceNote}
                </p>
                <p className="mt-3 text-white/70 text-sm leading-relaxed flex-1">
                  {service.cardDescription}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-gold group-hover:gap-3 transition-all">
                  Learn more
                  <ArrowRight size={14} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

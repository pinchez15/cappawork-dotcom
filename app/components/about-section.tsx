import Image from "next/image"
import { FadeInUp } from "./motion-wrapper"

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-warm-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-10 md:gap-16">
          <div className="flex-shrink-0">
            <Image
              src="/nate-headshot.png"
              alt="Nate Pinches, founder of CappaWork"
              width={280}
              height={280}
              className="rounded-2xl object-cover"
            />
          </div>
          <FadeInUp>
            <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-3">
              The Guide
            </span>
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-navy mb-6">
              Someone who has done this before.
            </h2>
            <div className="text-stone-600 leading-relaxed space-y-4">
              <p>
                I have sold operational software into Apollo and General Atlantic portfolio companies and built production systems with my own hands, live today in healthcare, property management, wealth management, and rural clinical settings.
              </p>
              <p className="text-stone-500 text-base">
                The person you talk to maps your operations and builds the software.
              </p>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  )
}

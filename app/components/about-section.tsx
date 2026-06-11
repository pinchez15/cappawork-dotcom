import Image from "next/image"
import { FadeInUp } from "./motion-wrapper"

export default function AboutSection() {
  return (
    <section id="guide" className="py-24 bg-warm-white">
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
              You don&rsquo;t need another tool. You need someone who&rsquo;s done this.
            </h2>
            <div className="text-stone-600 leading-relaxed space-y-4">
              <p>
                I&rsquo;ve sat on both sides of this problem — selling operational software into Apollo and General Atlantic portfolio companies, and building production systems with my own hands. CappaWork ships real systems, live today in property management, data consulting, wealth management, healthcare AI, and a clinical EHR running in rural clinics.
              </p>
              <p>
                No agency. No handoffs. No markup. The person you talk to is the person who builds it.
              </p>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  )
}

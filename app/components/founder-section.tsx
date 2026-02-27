import Image from "next/image"
import Link from "next/link"

export default function FounderSection() {
  return (
    <section className="py-24 bg-card-light">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-shrink-0">
            <Image
              src="/nate-headshot.png"
              alt="Nate Pinches, founder of CappaWork"
              width={240}
              height={240}
              className="rounded-2xl object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-gold uppercase tracking-wide mb-3">
              Meet the Founder
            </p>
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-navy mb-4">
              Nate Pinches
            </h2>
            <p className="text-stone-600 leading-relaxed mb-4">
              I&apos;ve spent years working inside founder-led service businesses—mapping
              workflows, measuring unit economics, and building the systems that turn
              operational chaos into measurable margin. CappaWork is how I bring that
              approach to operators who know they&apos;re leaving money on the table but
              can&apos;t see exactly where.
            </p>
            <p className="text-stone-600 leading-relaxed mb-6">
              Analytics first. Then automation. Always in that order.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-navy font-medium hover:text-gold transition-colors"
            >
              More about CappaWork &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

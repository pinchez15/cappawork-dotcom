import Image from "next/image"

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-card-light">
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
          <div>
            <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-3">
              About
            </span>
            <h2 className="font-display text-2xl sm:text-3xl tracking-tight text-navy mb-6">
              Nate Pinches
            </h2>
            <div className="text-stone-600 leading-relaxed space-y-4">
              <p>
                MBA. 15 years of experience. 7 years building products. I&apos;ve done C-suite strategy work up to $2B+ companies and I ship production AI systems every&nbsp;day.
              </p>
              <p>
                I started CappaWork because I kept seeing the same gap &mdash; businesses know AI matters but can&apos;t find someone who does strategy <em>and</em> builds <em>and</em> trains. That&apos;s what I&nbsp;do.
              </p>
              <p className="text-navy font-medium">
                One person. Full stack. Business strategy through production&nbsp;code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

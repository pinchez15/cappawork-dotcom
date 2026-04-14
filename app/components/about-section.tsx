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
                MBA. C-suite strategy work at companies up to $2B+. I ship production AI every&nbsp;day.
              </p>
              <p>
                I started CappaWork because businesses know AI matters but can&apos;t find someone who does strategy <em>and</em> builds <em>and</em> trains. That&apos;s what I&nbsp;do.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

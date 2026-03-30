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
                MBA. Four years in management consulting. C-suite strategy work up to $2B+ companies. Full-stack AI product builder shipping production systems every day.
              </p>
              <p>
                I&apos;ve spent years working inside founder-led service businesses — mapping workflows, measuring unit economics, building the systems that turn operational chaos into measurable margin.
              </p>
              <p>
                CappaWork is how I bring that to operators who know they&apos;re leaving money on the table but can&apos;t see exactly where. I&apos;m not a strategist who hands you a deck. I&apos;m not a dev shop that builds what you tell them. I diagnose the problem, build the solution, and train your team to own&nbsp;it.
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

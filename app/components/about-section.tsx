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
                My own business almost died from poor cashflow — so profitability isn&apos;t an abstract concept for me. It&apos;s the first thing I look at, every time. I&apos;ve spent years inside founder-led service businesses mapping workflows, measuring unit economics, and building the systems that turn operational chaos into measurable&nbsp;margin.
              </p>
              <p>
                I&apos;m not a strategist who hands you a deck. I&apos;m not a dev shop that builds what you tell them. I diagnose the problem, build the solution, and train your team to own&nbsp;it.
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

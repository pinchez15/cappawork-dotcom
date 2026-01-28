import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "LinkedIn Carousel - CappaWork",
  robots: "noindex, nofollow",
}

export default function LinkedInCarouselPage() {
  return (
    <main className="min-h-screen bg-stone-200 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 p-6 bg-white rounded-xl border border-stone-200">
          <h1 className="text-2xl font-semibold text-stone-900 mb-2">LinkedIn Carousel Export</h1>
          <p className="text-stone-600 mb-4">
            Each slide is 1080x1080px. To export: screenshot each slide or use browser print to PDF.
          </p>
          <p className="text-sm text-stone-500">
            Tip: Use Chrome DevTools (Cmd+Shift+P → "Capture node screenshot") on each slide, or print this page to PDF.
          </p>
        </div>

        <div className="space-y-8">
          {/* Slide 1: Hook */}
          <div className="relative">
            <div className="text-xs text-stone-500 mb-2 font-medium">Slide 1 — Hook</div>
            <div
              className="bg-stone-900 text-white flex flex-col items-center justify-center text-center p-16"
              style={{ width: '1080px', height: '1080px' }}
            >
              <div className="text-blue-400 text-2xl font-semibold tracking-wide uppercase mb-8">
                CappaWork
              </div>
              <h1 className="text-7xl font-semibold tracking-tight leading-tight mb-8">
                From Idea to Product.
                <br />
                <span className="italic font-serif text-stone-300">Built to Last.</span>
              </h1>
              <p className="text-2xl text-stone-400 max-w-2xl">
                Swipe to see how →
              </p>
            </div>
          </div>

          {/* Slide 2: Problem */}
          <div className="relative">
            <div className="text-xs text-stone-500 mb-2 font-medium">Slide 2 — Problem</div>
            <div
              className="bg-white flex flex-col items-center justify-center text-center p-16 border-8 border-stone-100"
              style={{ width: '1080px', height: '1080px' }}
            >
              <div className="text-blue-600 text-xl font-semibold tracking-wide uppercase mb-12">
                Sound Familiar?
              </div>
              <div className="space-y-8 text-4xl text-stone-700 max-w-3xl">
                <p>"We need a dev team to build this."</p>
                <p>"The agency quoted us $100K+"</p>
                <p>"Our internal tool is held together with duct tape."</p>
                <p>"I have the idea but can't ship it."</p>
              </div>
            </div>
          </div>

          {/* Slide 3: Solution Intro */}
          <div className="relative">
            <div className="text-xs text-stone-500 mb-2 font-medium">Slide 3 — Solution</div>
            <div
              className="bg-blue-600 text-white flex flex-col items-center justify-center text-center p-16"
              style={{ width: '1080px', height: '1080px' }}
            >
              <h2 className="text-6xl font-semibold tracking-tight leading-tight mb-8">
                You don't need a team.
                <br />
                You need one partner
                <br />
                who can build.
              </h2>
              <div className="w-24 h-1 bg-white/40 rounded-full mb-8"></div>
              <p className="text-2xl text-blue-100 max-w-2xl">
                Modern, scalable products for owner-led businesses — no tech team required.
              </p>
            </div>
          </div>

          {/* Slide 4: Strategic Blueprint */}
          <div className="relative">
            <div className="text-xs text-stone-500 mb-2 font-medium">Slide 4 — Strategic Blueprint</div>
            <div
              className="bg-stone-50 flex flex-col items-start justify-center p-20"
              style={{ width: '1080px', height: '1080px' }}
            >
              <div className="text-blue-600 text-xl font-semibold tracking-wide uppercase mb-6">
                Path 1
              </div>
              <h2 className="text-5xl font-semibold tracking-tight text-stone-900 mb-4">
                Strategic Blueprint
              </h2>
              <p className="text-6xl font-semibold text-blue-600 mb-8">$5,000</p>
              <p className="text-3xl text-stone-700 mb-10 max-w-2xl leading-relaxed">
                Find out if your idea is worth $500K — before you spend $50K building the wrong thing.
              </p>
              <div className="space-y-4 text-2xl text-stone-600">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span>Market & competitive analysis</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span>Interactive financial model</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span>Technical architecture spec</span>
                </div>
              </div>
              <div className="mt-auto pt-10 text-xl text-stone-500">
                2 weeks · 50% clarity guarantee
              </div>
            </div>
          </div>

          {/* Slide 5: Full Product Build */}
          <div className="relative">
            <div className="text-xs text-stone-500 mb-2 font-medium">Slide 5 — Full Product Build</div>
            <div
              className="bg-stone-900 text-white flex flex-col items-start justify-center p-20"
              style={{ width: '1080px', height: '1080px' }}
            >
              <div className="text-blue-400 text-xl font-semibold tracking-wide uppercase mb-6">
                Path 2
              </div>
              <h2 className="text-5xl font-semibold tracking-tight mb-4">
                Full Product Build
              </h2>
              <p className="text-6xl font-semibold text-blue-400 mb-8">$22,000</p>
              <p className="text-3xl text-stone-300 mb-10 max-w-2xl leading-relaxed">
                From idea to paying customers in 8 weeks.
              </p>
              <div className="space-y-4 text-2xl text-stone-400">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span>Everything in Blueprint</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span>Full-stack development</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span>Stripe billing integration</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  <span>Production deployment</span>
                </div>
              </div>
              <div className="mt-auto pt-10 text-xl text-stone-500">
                8 weeks · Milestone payments · 20% guarantee on delays
              </div>
            </div>
          </div>

          {/* Slide 6: Cohort */}
          <div className="relative">
            <div className="text-xs text-stone-500 mb-2 font-medium">Slide 6 — Cohort</div>
            <div
              className="bg-white flex flex-col items-start justify-center p-20 border-8 border-blue-600"
              style={{ width: '1080px', height: '1080px' }}
            >
              <div className="text-blue-600 text-xl font-semibold tracking-wide uppercase mb-6">
                For PMs & Designers
              </div>
              <h2 className="text-5xl font-semibold tracking-tight text-stone-900 mb-4">
                PM → Builder
                <br />
                in 30 Days
              </h2>
              <p className="text-6xl font-semibold text-blue-600 mb-8">$1,500</p>
              <p className="text-3xl text-stone-700 mb-10 max-w-2xl leading-relaxed">
                Stop writing specs.
                <br />
                Start shipping products.
              </p>
              <div className="space-y-4 text-2xl text-stone-600">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span>4 weekly live build sessions</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span>Async Slack support</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <span>Deploy a real product</span>
                </div>
              </div>
              <div className="mt-auto pt-10 text-xl text-stone-500">
                Only 10 spots · Money-back guarantee
              </div>
            </div>
          </div>

          {/* Slide 7: Social Proof */}
          <div className="relative">
            <div className="text-xs text-stone-500 mb-2 font-medium">Slide 7 — Outcomes</div>
            <div
              className="bg-stone-900 text-white flex flex-col items-center justify-center text-center p-20"
              style={{ width: '1080px', height: '1080px' }}
            >
              <div className="text-blue-400 text-xl font-semibold tracking-wide uppercase mb-12">
                What You Walk Away With
              </div>
              <div className="space-y-10 text-4xl max-w-3xl">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-3xl flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-left">A deployed, working product</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-3xl flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-left">Clean, scalable architecture</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-3xl flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-left">Full ownership of your code</span>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-3xl flex-shrink-0">
                    ✓
                  </div>
                  <span className="text-left">30 days post-launch support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide 8: CTA */}
          <div className="relative">
            <div className="text-xs text-stone-500 mb-2 font-medium">Slide 8 — CTA</div>
            <div
              className="bg-blue-600 text-white flex flex-col items-center justify-center text-center p-20"
              style={{ width: '1080px', height: '1080px' }}
            >
              <h2 className="text-6xl font-semibold tracking-tight leading-tight mb-12">
                Ready to build?
              </h2>
              <div className="space-y-8 mb-16">
                <div className="bg-white text-stone-900 px-12 py-6 rounded-full text-3xl font-semibold">
                  Book a free discovery call
                </div>
                <p className="text-2xl text-blue-100">or</p>
                <div className="bg-white/20 text-white px-12 py-6 rounded-full text-3xl font-semibold border-2 border-white/40">
                  Apply to the February Cohort
                </div>
              </div>
              <div className="text-2xl text-blue-200">
                cappawork.com
              </div>
            </div>
          </div>

        </div>

        {/* Export Instructions */}
        <div className="mt-12 p-6 bg-white rounded-xl border border-stone-200">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">How to Export as PDF</h2>
          <ol className="space-y-3 text-stone-600">
            <li><span className="font-medium text-stone-900">Option 1 - Screenshot each slide:</span> Use Chrome DevTools → Cmd+Shift+P → "Capture node screenshot" on each slide div</li>
            <li><span className="font-medium text-stone-900">Option 2 - Figma/Canva:</span> Recreate these slides using the text and layout as reference</li>
            <li><span className="font-medium text-stone-900">Option 3 - Print to PDF:</span> Print this page, selecting only the slides you need</li>
          </ol>
        </div>
      </div>
    </main>
  )
}

export default function WhyWorks() {
  return (
    <section id="why-works" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-8 text-center">
          Why CappaWork Works
        </h2>
        
        <div className="space-y-8 text-lg text-stone-700 leading-relaxed">
          <div>
            <p className="mb-4">
              Most dev shops build whatever you ask for.
            </p>
            <p className="font-medium text-stone-900">
              We build what your business actually needs.
            </p>
          </div>

          <div className="my-8">
            <p className="mb-4">Because you're not hiring "a developer."</p>
            <p className="mb-4">You're hiring:</p>
            <ul className="list-none space-y-2 ml-0">
              <li className="flex items-start gap-2">
                <span className="text-stone-400">•</span>
                <span>a full-stack product builder</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-stone-400">•</span>
                <span>a business owner</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-stone-400">•</span>
                <span>a change-management consultant</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-stone-400">•</span>
                <span>a profitability strategist</span>
              </li>
            </ul>
            <p className="mt-4">All in one.</p>
          </div>

          <div className="space-y-4">
            <p>
              That means your software doesn't just look good or function well.
            </p>
            <p className="font-medium text-stone-900">
              It fits the way your team thinks, works, and makes decisions.
            </p>
          </div>

          <div className="space-y-2 text-stone-600">
            <p>No wasted features.</p>
            <p>No fragile flows.</p>
            <p>No "why does this feel so complicated?" moments.</p>
          </div>

          <p className="text-lg font-medium text-stone-900 mt-6">
            Just clean, reliable tools that people adopt without a fight.
          </p>
        </div>
      </div>
    </section>
  )
}


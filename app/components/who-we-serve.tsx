export default function WhoWeServe() {
  return (
    <section id="who-we-serve" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-8 text-center">
          Who We Serve
        </h2>
        
        <div className="text-lg text-stone-700 leading-relaxed space-y-6">
          <p>
            We work with owner-operators doing $500K–$5M who:
          </p>
          
          <ul className="list-none space-y-3 ml-0">
            <li className="flex items-start gap-2">
              <span className="text-stone-400">•</span>
              <span>run on messy internal systems</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400">•</span>
              <span>have niche knowledge but no technical team</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400">•</span>
              <span>want to eliminate inefficiency</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400">•</span>
              <span>want to turn internal tools into a real software asset</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400">•</span>
              <span>want high-caliber work without hand-holding</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-stone-400">•</span>
              <span>prefer working with someone who understands business, not just code</span>
            </li>
          </ul>

          <p className="mt-8">
            If you do good work—and want tools that support it—we're a great fit.
          </p>
        </div>
      </div>
    </section>
  )
}


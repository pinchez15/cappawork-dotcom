export default function WhatWeDo() {
  return (
    <section id="approach" className="py-24 bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-sm font-semibold tracking-wide uppercase text-blue-600 block mb-8">
          Our Approach
        </span>

        <div className="text-lg text-stone-600 leading-relaxed space-y-6">
          <h2 className="text-2xl sm:text-3xl font-semibold text-stone-900 leading-snug">
            We help $3M–$10M companies increase profitability through operational analytics and targeted automation.
          </h2>
          <p className="font-medium text-stone-900">
            Diagnosis first. Implementation second. No guessing.
          </p>
        </div>

        {/* Proof Point Callout */}
        <div className="mt-12 bg-white border border-stone-200 rounded-2xl p-8 sm:p-10">
          <span className="text-sm font-semibold tracking-wide uppercase text-blue-600 block mb-4">
            Proof Point
          </span>
          <p className="text-lg text-stone-600 leading-relaxed mb-4">
            One founder came to us doing $1.5M in revenue with $45K in annual profit. Twelve months later: $1.8M in revenue, $225K in profit. Same team. Same market. We identified the margin leaks, removed the operational constraints, and the business kept the money it was already earning.
          </p>
          <p className="text-lg font-medium text-stone-900">
            5× profit improvement. Not from growth hacks. From operational precision.
          </p>
        </div>
      </div>
    </section>
  )
}

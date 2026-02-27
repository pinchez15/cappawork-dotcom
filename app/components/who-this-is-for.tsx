import { Check } from "lucide-react"

const criteria = [
  "5+ employees",
  "Growing revenue",
  "Increasing operational complexity",
  "Compressed or plateauing margins",
]

export default function WhoThisIsFor() {
  return (
    <section className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
            Who This Is For
          </h2>
          <p className="text-xl text-stone-600 max-w-3xl mx-auto">
            Founder-led companies doing $3M–$10M annually with:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          {criteria.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 bg-white p-6 rounded-2xl border border-stone-200"
            >
              <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-stone-700 text-lg">{item}</span>
            </div>
          ))}
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-2">
          <p className="text-lg text-stone-600">
            Industries matter less than pattern.
          </p>
          <p className="text-lg font-medium text-stone-900">
            The pattern is: real revenue, real team, hidden inefficiency.
          </p>
        </div>
      </div>
    </section>
  )
}

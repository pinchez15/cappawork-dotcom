import { Check } from "lucide-react"

const criteria = [
  "You're doing $3M–$10M in revenue and growing",
  "Your team is 15–75 people",
  "Your operations still run on spreadsheets and manual processes",
  "You've looked at enterprise software but it's too expensive or too complex",
  "Your best people are spending hours on work that should be automated",
  "You need better data to make better decisions — but you don't have a data team",
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
            We work with businesses that have outgrown their tools but haven't outgrown their
            ambition.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
      </div>
    </section>
  )
}

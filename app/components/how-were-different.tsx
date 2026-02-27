import { Stethoscope, Wrench, GraduationCap, TrendingUp } from "lucide-react"

const differentiators = [
  {
    icon: Stethoscope,
    title: "We diagnose first",
    description:
      "We don't start building until we understand exactly where your operations are breaking down. Every recommendation is rooted in data, not assumptions.",
    color: "blue",
  },
  {
    icon: Wrench,
    title: "We build what fits",
    description:
      "No bloated platforms. No features you'll never use. We build lean, specific tools that solve your actual problems — and integrate with what you already have.",
    color: "amber",
  },
  {
    icon: GraduationCap,
    title: "We train your team",
    description:
      "A tool your team can't use is a tool that doesn't exist. We train your people, document everything, and make sure adoption sticks.",
    color: "green",
  },
  {
    icon: TrendingUp,
    title: "We guarantee ROI",
    description:
      "If we don't find at least $50K in recoverable inefficiency during Phase 1, we refund the engagement. We only win when you win.",
    color: "purple",
  },
]

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
}

export default function HowWereDifferent() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
            We're not a dev shop. We're not a dashboard vendor.
          </h2>
          <p className="text-xl text-stone-600">
            We're operational strategists who build.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {differentiators.map((item) => {
            const colors = colorMap[item.color]
            return (
              <div key={item.title} className="space-y-6">
                <div
                  className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text}`}
                >
                  <item.icon size={24} />
                </div>
                <h3 className="text-2xl font-medium text-stone-900">{item.title}</h3>
                <p className="text-lg text-stone-600 leading-relaxed">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

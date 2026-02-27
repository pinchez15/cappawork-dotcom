import { Search, BarChart3, Workflow, Cable } from "lucide-react"

const services = [
  {
    icon: Search,
    title: "Operations Analysis",
    description:
      "We map your workflows end-to-end, identify bottlenecks, and find where time and money are leaking.",
    color: "blue",
  },
  {
    icon: BarChart3,
    title: "Dashboard Design",
    description:
      "Custom dashboards that show your team what matters — built around your data, not a generic template.",
    color: "amber",
  },
  {
    icon: Workflow,
    title: "Workflow Automation",
    description:
      "We automate the repetitive tasks your team does every day, so they can focus on the work that actually grows the business.",
    color: "green",
  },
  {
    icon: Cable,
    title: "Integration Architecture",
    description:
      "We connect your existing tools so data flows where it needs to go — no more copy-pasting between systems.",
    color: "purple",
  },
]

const colorMap: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-100", text: "text-blue-600" },
  amber: { bg: "bg-amber-100", text: "text-amber-600" },
  green: { bg: "bg-green-100", text: "text-green-600" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
}

export default function WhatWeDo() {
  return (
    <section id="approach" className="py-24 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
            What We Do
          </h2>
          <p className="text-xl text-stone-600">
            We find the gaps between how your business runs and how it should run — then we build
            the tools to close them.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {services.map((service) => {
            const colors = colorMap[service.color]
            return (
              <div key={service.title} className="space-y-6">
                <div
                  className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text}`}
                >
                  <service.icon size={24} />
                </div>
                <h3 className="text-2xl font-medium text-stone-900">{service.title}</h3>
                <p className="text-lg text-stone-600 leading-relaxed">{service.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

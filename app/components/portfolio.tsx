import { Clock, Users, Utensils } from "lucide-react"

export default function Portfolio() {
  const products = [
    {
      name: "CappaWork Planner",
      status: "retired",
      description: "Designed to restore rhythm in work and prayer",
      icon: Clock,
      color: "text-amber-600",
    },
    {
      name: "WorkPortfolio",
      status: "active",
      description: "A lightweight portfolio builder for generalists and indie workers",
      icon: Users,
      color: "text-blue-600",
    },
    {
      name: "Chef",
      status: "WIP",
      description: "An AI recipe assistant focused on real food and family rhythms",
      icon: Utensils,
      color: "text-green-600",
    },
  ]

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">Portfolio Snapshot</h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Showcase of our own products—proof of execution, clarity, and care.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const IconComponent = product.icon
            return (
              <div
                key={index}
                className="group bg-stone-50 p-8 rounded-sm border border-stone-200 hover:border-stone-300 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-3 mb-4">
                  <IconComponent className={`${product.color} w-6 h-6`} />
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      product.status === "active"
                        ? "bg-green-100 text-green-700"
                        : product.status === "WIP"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-medium text-stone-900 mb-3">{product.name}</h3>

                <p className="text-stone-600 leading-relaxed">{product.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

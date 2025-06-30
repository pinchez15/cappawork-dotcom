import { Zap, Hammer, Rocket } from "lucide-react"

export default function Services() {
  const services = [
    {
      name: "Sprint",
      icon: Zap,
      idealFor: "Early concept",
      whatYouGet: "Rapid prototyping, UI flows, basic front-end",
      duration: "1–2 days",
      color: "text-yellow-600",
    },
    {
      name: "Build",
      icon: Hammer,
      idealFor: "MVP stage",
      whatYouGet: "UX, development, AI integration, deploy-ready",
      duration: "2–3 weeks",
      color: "text-blue-600",
    },
    {
      name: "Launch",
      icon: Rocket,
      idealFor: "Ready to scale",
      whatYouGet: "Full stack dev, integrations, user onboarding",
      duration: "1–3 months",
      color: "text-green-600",
    },
  ]

  return (
    <section id="services" className="py-24 bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">Let's Build Yours</h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Whether you need a prototype, an MVP, or a full launch—we can help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-sm border border-stone-200 hover:border-stone-300 transition-all duration-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <IconComponent className={`${service.color} w-8 h-8`} />
                  <h3 className="text-2xl font-serif font-medium text-stone-900">{service.name}</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <dt className="text-sm font-medium text-stone-500 mb-1">Ideal For</dt>
                    <dd className="text-stone-900">{service.idealFor}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-stone-500 mb-1">What You Get</dt>
                    <dd className="text-stone-900">{service.whatYouGet}</dd>
                  </div>

                  <div>
                    <dt className="text-sm font-medium text-stone-500 mb-1">Duration</dt>
                    <dd className="text-stone-900 font-medium">{service.duration}</dd>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <p className="text-stone-600 italic">We use Cursor, v0, Supabase, Vercel, OpenAI and Claude.</p>
          <p className="text-stone-600 italic">We work in Next.js, Tailwind, and ShadCN.</p>
        </div>
      </div>
    </section>
  )
}

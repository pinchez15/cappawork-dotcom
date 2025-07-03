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
          <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">Product Development Services</h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            We offer three flexible ways to partner, depending on where you are in the journey:
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
                    <dt className="text-sm font-medium text-stone-500 mb-1">{service.name === 'Sprint' ? 'Rapid prototyping in 1–2 days' : service.name === 'Build' ? 'Launch your MVP in 2–3 weeks' : 'Full product build in 1–3 months'}</dt>
                    <dd className="text-stone-900">
                      <>
                        {service.name === 'Sprint' && 'Great for early-stage teams testing an idea or exploring what\'s possible. We join your team for a rapid prototyping session to help you visualize and scope fast, without wasting time or money.'}
                        {service.name === 'Build' && 'We handle design, development, and AI integration to create a usable product that gets in front of users—fast.'}
                        {service.name === 'Launch' && 'From backend to user onboarding, we\'ll partner with you to build something real, stable, and ready to scale.'}
                      </>
                    </dd>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="text-center mb-8">
          <p className="text-stone-600 text-lg mb-2">Tools we use: v0, Supabase, Next.js, OpenAI, Tailwind, Vercel.</p>
          <p className="text-stone-600 text-lg mb-6">Approach we take: thoughtful, fast, deeply human.</p>
          <button className="group bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 flex items-center gap-2">
            Book a Discovery Call
          </button>
        </div>
      </div>
    </section>
  )
}

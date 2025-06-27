import { Calendar } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-serif font-light text-stone-900 mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-stone-600 mb-8 max-w-2xl mx-auto">
          Let's discuss your project and see how we can help bring your vision to life.
        </p>

        <a
          href="https://calendly.com/your-calendly-link"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-stone-900 text-stone-50 px-8 py-4 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200 group"
        >
          <Calendar size={20} />
          Book a Free Intro Call
        </a>
      </div>
    </section>
  )
}

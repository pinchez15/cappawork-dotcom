export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-8 text-center">Why CappaWork?</h2>
        <div className="prose prose-lg prose-stone mx-auto text-left">
          <p className="text-lg leading-relaxed text-stone-700 text-left">
            We believe work is good.<br />
            Not just productive—but good in the deepest sense. Done rightly, work orders our lives, serves our neighbors, and brings us closer to God.<br /><br />
            CappaWork exists to support that kind of work. We're not here to chase hype. We're here to build clear, useful tools that make people's lives better.
          </p>
          <ul className="text-left mt-6 mb-0">
            <li>Founder-level thinking, not just code</li>
            <li>Fast, principled execution</li>
            <li>Clarity at every step</li>
            <li>A product you're proud to ship</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

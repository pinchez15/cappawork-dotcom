export default function ScaleProblem() {
  return (
    <section id="problem" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <span className="text-sm font-semibold tracking-wide uppercase text-blue-600 block mb-8">
          The Problem After $3M
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900 leading-tight mb-8">
          You built a real business.
        </h2>

        <div className="text-lg text-stone-600 leading-relaxed space-y-6">
          <p>
            You crossed $3M. You hired a team. Revenue is growing.
          </p>
          <p>
            But somewhere between $3M and $10M, every dollar of growth got more expensive to produce.
          </p>
          <p>
            More people. More tools. More coordination. More manual work holding it all together.
          </p>
          <p className="font-medium text-stone-900">
            Revenue goes up. Margin doesn't follow.
          </p>
          <p>
            This isn't a failure. It's a pattern. And it has a name:
          </p>
          <p className="text-2xl font-semibold text-stone-900">
            Scale inefficiency.
          </p>
          <p>
            It doesn't announce itself. It accumulates:
          </p>

          <ul className="space-y-3 pl-1">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5 flex-shrink-0" />
              <span>Manual data entry that scales linearly with revenue</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5 flex-shrink-0" />
              <span>Fragmented software that forces double work</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5 flex-shrink-0" />
              <span>Reporting that hides margin by segment</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5 flex-shrink-0" />
              <span>Hiring ahead of operational clarity</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2.5 flex-shrink-0" />
              <span>Decisions made from instinct instead of visibility</span>
            </li>
          </ul>

          <p>
            None of these feel urgent in any given month.
          </p>
          <p className="font-medium text-stone-900">
            Over 24–36 months, they compress your margin — and make growth progressively more expensive.
          </p>
        </div>
      </div>
    </section>
  )
}

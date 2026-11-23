import { Reveal } from "./reveal"

// Every line here is a commitment buyers will hold us to in security review.
// Only add a claim once it is true for every engagement.
const commitments = [
  {
    title: "BAA before PHI",
    body: "We sign a business associate agreement before any work touches protected health information.",
  },
  {
    title: "Inside your environment",
    body: "Agents and software run in your cloud account and region, under your identity and permissions.",
  },
  {
    title: "Minimum necessary access",
    body: "Access is scoped to the job, reviewed with your security team, and removed when the work ends.",
  },
  {
    title: "Every agent action logged",
    body: "Each action an agent takes is recorded in an audit trail your compliance team can read.",
  },
  {
    title: "No PHI in development",
    body: "We build and test on de-identified or synthetic data. Production data stays in production.",
  },
  {
    title: "You own it",
    body: "All code, prompts, and infrastructure are yours, documented for your security review.",
  },
]

export default function HomeCompliance() {
  return (
    <section id="compliance" className="bg-warm-white py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8">
        <div className="lg:col-span-4">
          <Reveal
            as="h2"
            className="text-balance font-display text-[2.5rem] leading-[1.05] tracking-[-0.015em] text-navy sm:text-[3.25rem]"
          >
            Built to HIPAA standards from day one.
          </Reveal>
          <Reveal index={1} className="mt-6">
            <p className="text-lg leading-relaxed text-stone-600">
              Your security review is part of the build, not a gate at the end. Compliance is
              included in every engagement. It is never an add-on.
            </p>
          </Reveal>
        </div>

        <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
          {commitments.map((item, i) => (
            <Reveal as="li" key={item.title} index={i % 2} className="border-t border-card-border py-7">
              <h3 className="font-display text-[1.5rem] leading-tight text-navy">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-stone-600">{item.body}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

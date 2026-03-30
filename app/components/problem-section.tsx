"use client"

import { FadeInUp, StaggerContainer, StaggerItem } from "./motion-wrapper"

const problems = [
  {
    title: "You don\u2019t know where the money is leaking.",
    text: "You have a sense that things are inefficient but you can\u2019t point to the exact workflows costing you the most margin. Nobody\u2019s done the diagnostic. You\u2019re guessing.",
  },
  {
    title: "You\u2019re building the wrong things first.",
    text: "Without a diagnosis, every AI investment is a coin flip. Dev shops build what you tell them to build, not what you should build. You\u2019re spending $100K on a product that moves the needle 2% when there\u2019s a $50K build that would move it 20%.",
  },
  {
    title: "Your tools aren\u2019t connected to your P&L.",
    text: "You bought Notion AI, ChatGPT Enterprise, Copilot \u2014 your team uses them for emails and summaries. Nobody connected them to the workflows that actually generate revenue. You\u2019re paying for AI and getting autocomplete.",
  },
  {
    title: "You can\u2019t hire for this.",
    text: "A Head of AI is $250\u2013400K, takes six months to find, six months to ramp, and still can\u2019t do strategy AND build AND train. You need someone who does all three and you need them now, not in a year.",
  },
  {
    title: "Your team is falling behind and you can\u2019t train them.",
    text: "Your people know AI proficiency matters. They\u2019re either scared or experimenting in the shadows with no governance. Business secrets are leaking into tools nobody vetted. Either way, you\u2019re losing.",
  },
  {
    title: "You don\u2019t trust the advice you\u2019re getting.",
    text: "Consultants hand you a deck and leave. Dev shops take orders without questioning them. Tool vendors sell you their product regardless of fit. Nobody is sitting on your side of the table with no incentive other than making you right.",
  },
  {
    title: "The strategy and the execution are disconnected.",
    text: "You\u2019ve maybe even done a strategy engagement before. You got a roadmap. It\u2019s in a drawer. Nobody built any of it because the strategist couldn\u2019t code and the coder didn\u2019t understand the strategy.",
  },
]

export default function ProblemSection() {
  return (
    <section id="problem" className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <span className="text-sm font-semibold tracking-widest uppercase text-gold block mb-8">
            The Problem
          </span>

          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white leading-tight mb-6">
            You know AI is supposed to help. You just don&apos;t know where to start.
          </h2>

          <p className="text-lg text-white/70 leading-relaxed mb-16">
            You&apos;re a $3&ndash;10M service business. Most of your revenue comes from knowledge work that&apos;s still done manually. You&apos;re profitable enough to survive but not enough to breathe. AI tools are everywhere &mdash; some of your people love them, some hate them, and nobody&apos;s in charge of the strategy. You have demand you can&apos;t meet and margin you can&apos;t find.
          </p>
        </FadeInUp>

        <StaggerContainer className="space-y-10">
          {problems.map((problem) => (
            <StaggerItem key={problem.title}>
              <div className="border-l-2 border-gold/40 pl-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  {problem.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {problem.text}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}

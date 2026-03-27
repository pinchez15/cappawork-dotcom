"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { FadeInUp } from "./motion-wrapper"

const faqs = [
  {
    question: "Where should I start?",
    answer:
      "It depends on what you need. If you want your team AI-fluent, start with a training or cohort. If you need a strategic plan for AI adoption, the advisory session gives you a written memo in half a day. If you know what you need built, the full build gets you a production product in 12\u201316 weeks. Not sure? That's what the first conversation is for.",
  },
  {
    question: "What kind of AI are we talking about?",
    answer:
      "Practical, operational AI \u2014 not gimmicks. Think automated data entry, intelligent document processing, AI-drafted communications, predictive scheduling, and workflow automation. The kind that saves your team hours every week on work they shouldn\u2019t be doing manually.",
  },
  {
    question: "Will AI replace my team?",
    answer:
      "No. The goal is to elevate your team, not reduce it. AI handles the repetitive work so your people can focus on client relationships, strategic thinking, and the high-value work you actually hired them to do. Let computers do computer work.",
  },
  {
    question: "Do you only work with service businesses?",
    answer:
      "Our deepest experience is in service businesses \u2014 consulting, agencies, professional services, staffing, trades. But the AI training, strategy advisory, and dev team workshops apply to any company figuring out how to adopt AI effectively.",
  },
  {
    question: "How does pricing work?",
    answer:
      "Every service has a clear starting price. Advisory starts at $4,000 for a half day. Training and workshops start at $3,500\u2013$5,000. Full builds start at $50,000. No hidden fees. We scope before you commit.",
  },
  {
    question: "How fast do we see results?",
    answer:
      "Advisory sessions deliver a written strategy memo the same week. Training gives your team actionable skills in a single session. Full builds deliver working software every week over 12\u201316 weeks. We move fast because we use the same AI tools we recommend.",
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-navy">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInUp>
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-white mb-4">
              Questions? Straight answers.
            </h2>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.1}>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-white/10">
                <AccordionTrigger className="text-left text-lg font-medium text-white hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeInUp>
      </div>
    </section>
  )
}

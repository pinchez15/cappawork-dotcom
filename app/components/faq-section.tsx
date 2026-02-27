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
    question: "Do I have to commit to Phase 2?",
    answer:
      "No. Phase 1 is standalone. You receive a full report with quantified opportunities and clear next steps. You can execute internally, work with us, or choose another partner.",
  },
  {
    question: "What kind of AI are we talking about?",
    answer:
      "Practical, operational AI — not gimmicks. Think automated data entry, intelligent document processing, AI-drafted communications, predictive scheduling, and workflow automation. The kind that saves your team hours every week on work they shouldn't be doing manually.",
  },
  {
    question: "Will AI replace my team?",
    answer:
      "No. The goal is to elevate your team, not reduce it. AI handles the repetitive work so your people can focus on client relationships, strategic thinking, and the high-value work you actually hired them to do.",
  },
  {
    question: "Do you only build custom software?",
    answer:
      "We implement the most capital-efficient solution for the constraint identified. Sometimes that's custom. Sometimes it's configuring existing tools. Sometimes it's connecting systems that already exist. The goal is profit — not tools.",
  },
  {
    question: "What if we're under $3M?",
    answer:
      "You're likely still in growth experimentation mode. This engagement is designed for companies where scale inefficiency is already emerging — where the cost of inaction compounds quarterly.",
  },
  {
    question: "How fast do we see results?",
    answer:
      "Phase 1 (Diagnostic) delivers a prioritized roadmap in 4–6 weeks. Phase 2 implementations typically show measurable impact within 60–90 days. We move fast because we use the same AI tools we recommend.",
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

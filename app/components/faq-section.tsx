"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Do I have to commit to Phase 2?",
    answer:
      "No. Phase 1 is standalone. You receive a full report with quantified opportunities and clear next steps.",
  },
  {
    question: "What does \"automation\" actually mean?",
    answer:
      "Targeted systems that eliminate manual work, increase throughput, and improve decision-making. Not gimmicks. Not chatbots. Real operational infrastructure tied to margin.",
  },
  {
    question: "Do you only build custom software?",
    answer:
      "We implement the most capital-efficient solution for the constraint identified. Sometimes that's custom. Sometimes it's consolidation. The goal is profit — not tools.",
  },
  {
    question: "What if we're under $3M?",
    answer:
      "You're likely still in product-market fit and growth experimentation. This engagement is designed for companies where scale inefficiency is already emerging.",
  },
]

export default function FAQSection() {
  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
            Frequently Asked Questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-stone-200">
              <AccordionTrigger className="text-left text-lg font-medium text-stone-900 hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-stone-600 text-base leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

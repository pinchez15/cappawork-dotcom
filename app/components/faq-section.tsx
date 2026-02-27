"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Do I need Phase 1 before Phase 2?",
    answer:
      "Yes. Phase 1 provides the diagnostic foundation that makes Phase 2 effective. Without a clear picture of where your operations are breaking down and which automations will deliver the highest ROI, you'd be building blind. Phase 1 ensures every dollar spent in Phase 2 is tied to a specific, measurable outcome. That said, Phase 1 is valuable on its own — you walk away with a live dashboard and a prioritized roadmap whether or not you continue.",
  },
  {
    question: "What tools do you use?",
    answer:
      "It depends on your existing stack. We're tool-agnostic — we work with whatever systems you already have in place (QuickBooks, HubSpot, Salesforce, Google Sheets, custom databases, etc.) and build integrations that connect them. For dashboards and custom tools, we typically use modern web technologies like Next.js and Supabase, but the specific tools are always chosen based on what fits your business, not what's trendy.",
  },
  {
    question: "Can we just get a dashboard?",
    answer:
      "Technically, yes — but we'd recommend against it. A dashboard without diagnosis is like a speedometer without a steering wheel. It'll tell you something is happening, but it won't tell you why or what to do about it. The businesses that get the most value from our dashboards are the ones where we've first mapped their operations and identified exactly what metrics actually matter. Otherwise, you end up with a pretty screen showing the wrong numbers.",
  },
  {
    question: "What if we already have a CRM?",
    answer:
      "Great — we work with your existing tools, not replace them. Most businesses we work with already have a CRM, accounting software, project management tools, and various other systems. The problem is usually that these systems don't talk to each other, so your team ends up manually moving data between them. We build the connective tissue that makes your existing tools work together as a system.",
  },
  {
    question: "How involved does my team need to be?",
    answer:
      "Moderately. We need access to 2–3 key operators for about 2–3 hours per week during Phase 1 — the people who actually run your day-to-day operations. They know where the bottlenecks are, what workarounds they've built, and what information they wish they had. During Phase 2, involvement shifts to training and feedback sessions. We're not going to take over your team's time — but we do need their expertise to build the right thing.",
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

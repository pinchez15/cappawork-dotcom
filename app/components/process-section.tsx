"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Code, TestTube, Rocket } from "lucide-react"
import Image from "next/image"

interface ProcessStep {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

const steps: ProcessStep[] = [
  {
    number: "01",
    title: "Discovery & Problem Definition",
    description: "We start by understanding your business, your pain points, and the specific problems you need to solve. Through stakeholder interviews and workflow analysis, we identify the core requirements and success metrics. This phase ensures we're building the right solution from day one.",
    icon: <Code className="w-5 h-5" />
  },
  {
    number: "02",
    title: "Architecture & UX Design",
    description: "We design the system architecture and user experience, creating wireframes, data models, and technical specifications. This includes database schema design, API planning, and user flow mapping. Security considerations are built into the architecture from the ground up, with proper authentication, authorization, and data protection strategies.",
    icon: <Code className="w-5 h-5" />
  },
  {
    number: "03",
    title: "Build & Development",
    description: "Using modern frameworks (Next.js, Supabase, Vercel), we build your product with clean, maintainable code. We follow best practices for scalability, performance, and code quality. Security is emphasized throughout: secure authentication, encrypted data storage, input validation, and protection against common vulnerabilities.",
    icon: <Code className="w-5 h-5" />
  },
  {
    number: "04",
    title: "Testing & Quality Assurance",
    description: "Comprehensive testing ensures your product is reliable and secure. We perform unit tests, integration tests, security audits, and user acceptance testing. This phase catches bugs early, validates security measures, and ensures the product meets all requirements before deployment.",
    icon: <TestTube className="w-5 h-5" />
  },
  {
    number: "05",
    title: "Deploy & Hand-off",
    description: "We deploy your product to production with proper monitoring, backups, and documentation. You receive full access to the codebase, deployment credentials, and a comprehensive hand-off session. We provide 30-45 days of support to ensure a smooth transition and address any questions.",
    icon: <Rocket className="w-5 h-5" />
  }
]

export default function ProcessSection() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null)

  const toggleStep = (number: string) => {
    setExpandedStep(expandedStep === number ? null : number)
  }

  return (
    <section className="py-24 bg-stone-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Text Content */}
          <div className="flex-1 space-y-8">
            <span className="text-sm font-semibold tracking-wide uppercase text-blue-600">
              The Process
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-stone-900 leading-tight">
              Discovery to Deploy. The Product Path.
            </h2>
            <div className="text-lg text-stone-600 leading-relaxed">
              <p>
                Every project follows a proven, gated track designed to reduce risk and increase speed.
              </p>
            </div>
            
            <div className="space-y-3">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="bg-white rounded-lg border border-stone-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <button
                    onClick={() => toggleStep(step.number)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <span className="text-stone-400 font-medium text-sm">{step.number}</span>
                    <span className="flex-1 font-medium text-stone-900">{step.title}</span>
                    {expandedStep === step.number ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </button>
                  {expandedStep === step.number && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="pl-8 border-l-2 border-blue-600">
                        <p className="text-stone-600 leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Image Content */}
          <div className="flex-1 w-full">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-stone-100 bg-stone-100 aspect-square sm:aspect-[4/3] rotate-1 transition-transform duration-500 hover:rotate-0">
              <Image
                src="/CW_buypage.png"
                alt="Product Development Timeline"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

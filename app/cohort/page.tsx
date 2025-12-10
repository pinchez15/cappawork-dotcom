import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Image from "next/image"
import { Check, Calendar, Code, Database, Globe, ArrowRight, Layers, Users, Zap } from "lucide-react"
import EnrollmentCard from "./enrollment-card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "CappaWork Builder Cohort | 0→1 in 1 Month",
  description:
    "A one-month, zero-to-one bootcamp where you build and deploy a real software product using Next.js, Cursor, and Supabase.",
  openGraph: {
    title: "CappaWork Builder Cohort",
    description: "One month. One idea. One deployed product.",
    images: ["/CW_homepage.png"],
  },
}

export default function CohortPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-stone-900 text-white relative overflow-hidden">
         {/* Background Elements */}
         <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div>
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                     </span>
                     Enrolling for January
                  </div>
                  <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
                     From Idea <span className="text-stone-500">→</span> Product.<br />
                     In 1 Month.
                  </h1>
                  <p className="text-xl text-stone-300 leading-relaxed mb-8 max-w-lg">
                     Stop building "tutorials." Join a cohort of builders shipping real, deployed software using the modern AI stack.
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-stone-400 font-medium">
                     <div className="flex items-center gap-2">
                        <Code size={16} className="text-blue-400" /> Cursor AI
                     </div>
                     <div className="flex items-center gap-2">
                        <Layers size={16} className="text-white" /> Next.js 14
                     </div>
                     <div className="flex items-center gap-2">
                        <Database size={16} className="text-green-400" /> Supabase
                     </div>
                  </div>
               </div>

               <div className="relative hidden lg:block">
                  <EnrollmentCard className="absolute top-0 right-0 z-20 w-full max-w-md" />
               </div>
            </div>
         </div>
      </section>

      {/* Mobile Enrollment Card (Visible only on small screens) */}
      <div className="lg:hidden px-4 -mt-12 relative z-20 mb-16">
         <EnrollmentCard />
      </div>

      {/* The Stack / "Learn by Building" */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-6">
                  Don't learn to code.<br />Learn to build.
               </h2>
               <p className="text-lg text-stone-600">
                  Most bootcamps teach you syntax. We teach you how to ship. You will build a real SaaS application with authentication, database, and payments.
               </p>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-stone-200 shadow-2xl bg-stone-900 aspect-video">
               <div className="absolute inset-0 flex items-center justify-center">
                  <Image 
                     src="/CW_homepage.png" 
                     alt="Builder Workflow" 
                     fill 
                     className="object-cover opacity-90"
                  />
                  {/* Overlay content explaining the visual */}
                  <div className="absolute inset-0 bg-stone-900/60 flex items-center justify-center">
                     <div className="text-center text-white p-8">
                        <Code size={48} className="mx-auto mb-4 text-blue-400" />
                        <h3 className="text-2xl font-semibold mb-2">The Modern Workflow</h3>
                        <p className="text-stone-300 max-w-md mx-auto">
                           You'll master Cursor (AI Editor), V0 (Generative UI), and Supabase to build 10x faster than traditional coding.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Curriculum */}
      <section className="py-24 bg-stone-50">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-12 text-center">
               The 4-Week Sprint
            </h2>

            <div className="space-y-4">
               <Accordion type="single" collapsible className="w-full space-y-4">
                  
                  <AccordionItem value="week-1" className="bg-white border border-stone-200 rounded-lg px-6">
                     <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                              01
                           </div>
                           <div>
                              <div className="text-sm font-medium text-stone-500 mb-1">Week 1</div>
                              <div className="text-lg font-semibold text-stone-900">Foundation & Architecture</div>
                           </div>
                        </div>
                     </AccordionTrigger>
                     <AccordionContent className="pl-[4.5rem] pb-6 text-stone-600 text-base leading-relaxed">
                        <ul className="space-y-2">
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Idea validation and scope definition</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Setting up the Next.js 14 environment</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Designing the Database Schema (Supabase)</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> implementing Authentication (Clerk)</li>
                        </ul>
                     </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="week-2" className="bg-white border border-stone-200 rounded-lg px-6">
                     <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                              02
                           </div>
                           <div>
                              <div className="text-sm font-medium text-stone-500 mb-1">Week 2</div>
                              <div className="text-lg font-semibold text-stone-900">The Core Build</div>
                           </div>
                        </div>
                     </AccordionTrigger>
                     <AccordionContent className="pl-[4.5rem] pb-6 text-stone-600 text-base leading-relaxed">
                        <ul className="space-y-2">
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Building UI with Tailwind + shadcn/ui</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Connecting Frontend to Backend</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Implementing core feature logic</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Using AI to generate components</li>
                        </ul>
                     </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="week-3" className="bg-white border border-stone-200 rounded-lg px-6">
                     <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                              03
                           </div>
                           <div>
                              <div className="text-sm font-medium text-stone-500 mb-1">Week 3</div>
                              <div className="text-lg font-semibold text-stone-900">AI Integration & Polish</div>
                           </div>
                        </div>
                     </AccordionTrigger>
                     <AccordionContent className="pl-[4.5rem] pb-6 text-stone-600 text-base leading-relaxed">
                        <ul className="space-y-2">
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Integrating OpenAI/Gemini APIs</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Handling edge cases and error states</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Performance optimization</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> User dashboard and settings</li>
                        </ul>
                     </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="week-4" className="bg-white border border-stone-200 rounded-lg px-6">
                     <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">
                              04
                           </div>
                           <div>
                              <div className="text-sm font-medium text-stone-500 mb-1">Week 4</div>
                              <div className="text-lg font-semibold text-stone-900">Launch & Deploy</div>
                           </div>
                        </div>
                     </AccordionTrigger>
                     <AccordionContent className="pl-[4.5rem] pb-6 text-stone-600 text-base leading-relaxed">
                        <ul className="space-y-2">
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Payments integration (Stripe)</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Deploying to Vercel Production</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Setting up custom domains</li>
                           <li className="flex gap-2"><Check size={16} className="text-blue-500 mt-1" /> Launch day checklist</li>
                        </ul>
                     </AccordionContent>
                  </AccordionItem>
               </Accordion>
            </div>
         </div>
      </section>

      {/* Who is this for? */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-12 text-center">
               Who is this for?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
               <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                     <Zap size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">Non-Technical Founders</h3>
                  <p className="text-stone-600">
                     You have an idea but are tired of waiting for a technical co-founder. You want to build the MVP yourself.
                  </p>
               </div>
               <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                     <Layers size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">Product Managers</h3>
                  <p className="text-stone-600">
                     You want to stop writing tickets and start shipping. You want to understand the full stack to be a better PM.
                  </p>
               </div>
               <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                     <Code size={20} />
                  </div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">Designers</h3>
                  <p className="text-stone-600">
                     You can design the perfect interface, but you want to bring it to life without relying on a dev team.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-stone-50">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-12 text-center">
               Frequently Asked Questions
            </h2>
            <div className="space-y-4">
               {[
                  { q: "Do I need to know how to code?", a: "Some basic familiarity with HTML/CSS helps, but you do not need to be a developer. The AI tools we use (Cursor, V0) lower the barrier significantly." },
                  { q: "What is the time commitment?", a: "Expect to spend about 5-8 hours per week. This includes the live call (1 hour) and build time." },
                  { q: "What if I miss a live call?", a: "All calls are recorded and posted to the community immediately after." },
                  { q: "Do I really build a full product?", a: "Yes. This isn't a theory course. The goal is to have a deployed URL by the end of Week 4." }
               ].map((item, i) => (
                  <div key={i} className="bg-white border border-stone-200 rounded-lg p-6">
                     <h3 className="font-semibold text-stone-900 mb-2">{item.q}</h3>
                     <p className="text-stone-600">{item.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-white text-center">
         <div className="max-w-2xl mx-auto px-4">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-6">
               What future will you build?
            </h2>
            <p className="text-xl text-stone-600 mb-10">
               30 days from now, you could have an idea in a notebook—or a product in the world.
            </p>
            <div className="flex justify-center">
               <EnrollmentCard className="shadow-none border-none p-0 max-w-sm" />
            </div>
         </div>
      </section>

    </main>
  )
}

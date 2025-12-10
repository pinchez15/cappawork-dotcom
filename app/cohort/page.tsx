import type { Metadata } from "next"
import Image from "next/image"
import { Check, Calendar, Code, Database, Globe, ArrowRight, Layers, Users, Zap, ShieldCheck, Lock } from "lucide-react"
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
  const isEarlyBird = true
  const price = "$500"
  const fullPrice = "$1,000"

  return (
    <main className="min-h-screen bg-stone-50">
      
      {/* Simple Header for Standalone Page */}
      <nav className="absolute top-0 left-0 right-0 z-50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <a href="/" className="text-xl font-semibold tracking-tight text-white/90 hover:text-white transition-colors">
            CappaWork
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-stone-900 text-white relative overflow-hidden">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
            <Image
              src="/CW_Productphotos.png"
              alt="Builder Workspace"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/80 via-transparent to-stone-900"></div>
         </div>

         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
               <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6 shadow-lg">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                     </span>
                     Enrolling for January
                  </div>
                  
                  {/* Glass Card for Text Pop */}
                  <div className="bg-stone-900/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1] mb-6 drop-shadow-lg">
                       0 <span className="text-blue-400">→</span> 1 in 1 Month.
                    </h1>
                    <p className="text-xl text-stone-100 leading-relaxed mb-8 max-w-lg drop-shadow-md">
                       Stop watching tutorials. Join a cohort of builders learning to ship on the modern AI software development stack.
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-stone-200 font-medium">
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
               </div>

               <div className="relative hidden lg:block">
                  <EnrollmentCard className="absolute top-0 right-0 z-20 w-full max-w-md" />
               </div>
            </div>
         </div>
      </section>

      {/* Mobile Enrollment Card */}
      <div className="lg:hidden px-4 -mt-12 relative z-20 mb-16">
         <EnrollmentCard />
      </div>

      {/* The Stack */}
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

      {/* Curriculum Section */}
      <section className="py-24 bg-stone-50">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-12 text-center">
               The 4-Week Sprint
            </h2>
            <div className="space-y-4">
               {/* Accordion Items - Keeping existing content */}
               <Accordion type="single" collapsible className="w-full space-y-4">
                  <AccordionItem value="week-1" className="bg-white border border-stone-200 rounded-lg px-6">
                     <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-center gap-4 text-left">
                           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">01</div>
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
                           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">02</div>
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
                           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">03</div>
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
                           <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold shrink-0">04</div>
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

      {/* Target Audience */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-12 text-center">
               Who is this for?
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
               <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4"><Zap size={20} /></div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">Non-Technical Founders</h3>
                  <p className="text-stone-600">You have an idea but are tired of waiting for a technical co-founder. You want to build the MVP yourself.</p>
               </div>
               <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4"><Layers size={20} /></div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">Product Managers</h3>
                  <p className="text-stone-600">You want to stop writing tickets and start shipping. You want to understand the full stack to be a better PM.</p>
               </div>
               <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100">
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4"><Code size={20} /></div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-2">Designers</h3>
                  <p className="text-stone-600">You can design the perfect interface, but you want to bring it to life without relying on a dev team.</p>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-stone-50">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
               {[{ q: "Do I need to know how to code?", a: "Some basic familiarity with HTML/CSS helps, but you do not need to be a developer. The AI tools we use (Cursor, V0) lower the barrier significantly." }, { q: "What is the time commitment?", a: "Expect to spend about 5-8 hours per week. This includes the live call (1 hour) and build time." }, { q: "What if I miss a live call?", a: "All calls are recorded and posted to the community immediately after." }, { q: "Do I really build a full product?", a: "Yes. This isn't a theory course. The goal is to have a deployed URL by the end of Week 4." }].map((item, i) => (
                  <div key={i} className="bg-white border border-stone-200 rounded-lg p-6">
                     <h3 className="font-semibold text-stone-900 mb-2">{item.q}</h3>
                     <p className="text-stone-600">{item.a}</p>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Checkout Section (Embedded) */}
      <section id="checkout" className="py-24 bg-white border-t border-stone-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-6">
                  Reserve Your Spot
               </h2>
               <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                  30 days from now, you could have an idea in a notebook—or a product in the world.
               </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-start">
               {/* Left: Summary */}
               <div className="lg:col-span-5 space-y-8">
                  <div className="bg-stone-50 p-6 rounded-xl border border-stone-200">
                     <div className="flex justify-between items-start mb-6 pb-6 border-b border-stone-200">
                        <div>
                           <h3 className="font-semibold text-stone-900">January 2025 Cohort</h3>
                           <p className="text-sm text-stone-500">4-Week Live Program</p>
                        </div>
                        <div className="text-right">
                           <div className="text-xl font-semibold text-stone-900">{price}</div>
                           <div className="text-sm text-stone-400 line-through">{fullPrice}</div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <h4 className="font-medium text-stone-900 text-sm">What's Included:</h4>
                        <ul className="space-y-3">
                           <li className="flex items-start gap-3 text-sm text-stone-600"><Check size={16} className="text-blue-600 mt-0.5" /> <span>3 Live Weekly Calls</span></li>
                           <li className="flex items-start gap-3 text-sm text-stone-600"><Check size={16} className="text-blue-600 mt-0.5" /> <span>Private Community Access</span></li>
                           <li className="flex items-start gap-3 text-sm text-stone-600"><Check size={16} className="text-blue-600 mt-0.5" /> <span>Lifetime Curriculum Access</span></li>
                           <li className="flex items-start gap-3 text-sm text-stone-600"><Check size={16} className="text-blue-600 mt-0.5" /> <span>Direct access to instructors</span></li>
                        </ul>
                     </div>
                     <div className="mt-6 pt-6 border-t border-stone-200 flex items-center gap-2 text-green-600 text-sm font-medium">
                        <ShieldCheck size={16} /> 100% Money-Back Guarantee
                     </div>
                  </div>
                  <div className="flex items-center gap-2 text-stone-400 text-sm justify-center lg:justify-start">
                     <Lock size={14} /> Secure SSL Encryption
                  </div>
               </div>

               {/* Right: Checkout Form Placeholder */}
               <div className="lg:col-span-7">
                  <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden min-h-[500px] flex flex-col items-center justify-center text-center p-12 relative">
                     <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                        <span className="font-bold text-stone-400 text-2xl">S</span>
                     </div>
                     <h3 className="text-xl font-semibold text-stone-900 mb-2">Stripe Checkout</h3>
                     <p className="text-stone-500 max-w-sm">
                        This is where the Stripe Embedded Checkout Element will be rendered.
                     </p>
                     <div className="mt-8 p-4 bg-stone-50 border border-stone-200 rounded text-xs text-stone-400 font-mono">
                        {`<EmbeddedCheckoutProvider stripe={stripePromise} options={options} />`}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

    </main>
  )
}

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
      <section className="pt-32 pb-20 md:pt-48 md:pb-32 bg-stone-900 text-white relative overflow-hidden w-full">
         {/* Background Image - Full Width */}
         <div className="absolute inset-0 z-0 w-screen left-1/2 -translate-x-1/2">
            <Image
              src="/cohort_background.png"
              alt="Builder Workspace"
              fill
              className="object-cover opacity-40"
              priority
            />
            <div className="absolute inset-0 bg-stone-900/60 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 via-transparent to-stone-900"></div>
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

      {/* Tech Stack Authority Strip */}
      <section className="py-12 bg-stone-50 border-b border-stone-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-semibold text-stone-500 uppercase tracking-wider mb-8">
               Built on the modern standard
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
               <div className="flex items-center gap-2">
                  <Image src="/logos/cursor.jpg" alt="Cursor" width={32} height={32} className="rounded-md" />
                  <span className="font-semibold text-stone-700">Cursor</span>
               </div>
               <div className="flex items-center gap-2">
                  <Image src="/logos/vercel-logotype-dark.png" alt="Vercel" width={100} height={24} className="h-6 w-auto object-contain" />
               </div>
               <div className="flex items-center gap-2">
                  <Image src="/logos/supabase-logo_brandlogos.net_wahxg-scaled.png" alt="Supabase" width={32} height={32} className="h-8 w-auto object-contain" />
                  <span className="font-semibold text-stone-700">Supabase</span>
               </div>
               <div className="flex items-center gap-2">
                  <Image src="/logos/clerk.jpeg" alt="Clerk" width={32} height={32} className="rounded-md" />
                  <span className="font-semibold text-stone-700">Clerk</span>
               </div>
            </div>
         </div>
      </section>

      {/* Project Showcase: The Tangible Outcome */}
      <section className="py-24 bg-white overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
               <div className="order-2 lg:order-1">
                  <div className="relative">
                     {/* Browser Frame */}
                     <div className="bg-stone-900 rounded-xl shadow-2xl overflow-hidden border border-stone-800 transform rotate-1 hover:rotate-0 transition-transform duration-700">
                        <div className="bg-stone-800 px-4 py-3 flex items-center gap-2 border-b border-stone-700">
                           <div className="w-3 h-3 rounded-full bg-red-500" />
                           <div className="w-3 h-3 rounded-full bg-yellow-500" />
                           <div className="w-3 h-3 rounded-full bg-green-500" />
                           <div className="ml-4 flex-1 bg-stone-900 rounded-md py-1 px-3 text-xs text-stone-500 font-mono text-center">
                              your-startup.vercel.app
                           </div>
                        </div>
                        <div className="relative aspect-[4/3] bg-stone-900">
                           {/* Placeholder for App Screenshot - Using code/abstract visual for now */}
                           <div className="absolute inset-0 flex flex-col">
                              {/* Fake Navbar */}
                              <div className="h-16 border-b border-stone-800 flex items-center justify-between px-6">
                                 <div className="w-24 h-6 bg-stone-800 rounded animate-pulse" />
                                 <div className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-stone-800" />
                                 </div>
                              </div>
                              {/* Fake Content */}
                              <div className="p-8 space-y-6">
                                 <div className="flex gap-4">
                                    <div className="w-1/3 h-32 bg-stone-800/50 rounded-lg border border-stone-800" />
                                    <div className="w-1/3 h-32 bg-stone-800/50 rounded-lg border border-stone-800" />
                                    <div className="w-1/3 h-32 bg-stone-800/50 rounded-lg border border-stone-800" />
                                 </div>
                                 <div className="h-48 bg-stone-800/30 rounded-lg border border-stone-800" />
                              </div>
                              
                              {/* Feature Callouts Overlay */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-blue-500/10 backdrop-blur-md border border-blue-500/30 px-4 py-2 rounded-lg text-blue-400 text-sm font-medium flex items-center gap-2">
                                       <Lock size={14} /> Secure Authentication
                                    </div>
                                    <div className="bg-green-500/10 backdrop-blur-md border border-green-500/30 px-4 py-2 rounded-lg text-green-400 text-sm font-medium flex items-center gap-2">
                                       <Database size={14} /> Real-time Database
                                    </div>
                                    <div className="bg-purple-500/10 backdrop-blur-md border border-purple-500/30 px-4 py-2 rounded-lg text-purple-400 text-sm font-medium flex items-center gap-2">
                                       <Zap size={14} /> AI Integration
                                    </div>
                                    <div className="bg-orange-500/10 backdrop-blur-md border border-orange-500/30 px-4 py-2 rounded-lg text-orange-400 text-sm font-medium flex items-center gap-2">
                                       <Globe size={14} /> Global CDN
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     
                     {/* Decorative Elements */}
                     <div className="absolute -bottom-6 -right-6 -z-10 w-full h-full bg-stone-100 rounded-xl" />
                  </div>
               </div>

               <div className="order-1 lg:order-2">
                  <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-6">
                     You walk away with a <span className="text-blue-600">deployed asset</span>.
                  </h2>
                  <p className="text-lg text-stone-600 mb-8 leading-relaxed">
                     This isn't a theory course. By Day 21, you will have a live URL you can send to customers, investors, or friends. 
                  </p>
                  
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                           <ShieldCheck size={20} />
                        </div>
                        <div>
                           <h3 className="font-semibold text-stone-900">Production-Ready Auth</h3>
                           <p className="text-stone-600 text-sm">Secure sign-up, login, and protected routes using Clerk.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 text-green-600">
                           <Database size={20} />
                        </div>
                        <div>
                           <h3 className="font-semibold text-stone-900">Scalable Database</h3>
                           <p className="text-stone-600 text-sm">A real Postgres database hosted on Supabase, ready for scale.</p>
                        </div>
                     </div>
                     <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 text-purple-600">
                           <Zap size={20} />
                        </div>
                        <div>
                           <h3 className="font-semibold text-stone-900">Payments Integrated</h3>
                           <p className="text-stone-600 text-sm">Accept credit cards from day one with Stripe.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* The Stack (Updated to be Philosophy) */}
      <section className="py-24 bg-stone-50">
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

      {/* Meet Your Teacher */}
      <section className="py-24 bg-white">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-12 text-center">
               Meet your teacher
            </h2>
            <div className="flex flex-col md:flex-row gap-8 items-start">
               <div className="flex-shrink-0">
                  <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border border-stone-200 shadow-lg">
                     <Image
                        src="/nate profile photo.jpeg"
                        alt="Nate - CappaWork Instructor"
                        fill
                        className="object-cover"
                     />
                  </div>
               </div>
               <div className="flex-1">
                  <p className="text-lg text-stone-700 leading-relaxed space-y-4">
                     <span className="font-semibold text-stone-900">I'm Nate.</span> I learned to build software in the cracks of a busy life—seven kids, a full family schedule, and product ideas that wouldn't leave me alone. I've worked for years in strategy and product development, but always relied on a developer to turn my ideas into products. Once I understood how to ship real products with modern AI tools, everything opened up: I could work when it fit my day, charge what my skills were worth, and create apps that earned money while I was with my family. But this story isn't about me, it's about you. I've just walked this path and can show you how to build something that gives you back control of your time, your income, and your future. This skill isn't easy, but it can change your life. Ready to get started??? Lets go!
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Curriculum Section */}
      <section className="py-24 bg-stone-50">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-12 text-center">
               The 3-Week Sprint
            </h2>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-stone-300 before:to-transparent">
               
               {/* Week 1 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-stone-200 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-stone-500 font-bold">
                     01
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                     <div className="text-sm font-medium text-blue-600 mb-1">Week 1</div>
                     <h3 className="text-xl font-bold text-stone-900 mb-4">Foundation & Architecture</h3>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Idea validation and scope definition</span>
                        </li>
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Setting up the Next.js 14 environment</span>
                        </li>
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Designing the Database Schema (Supabase)</span>
                        </li>
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Implementing Authentication (Clerk)</span>
                        </li>
                     </ul>
                  </div>
               </div>

               {/* Week 2 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-stone-200 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-stone-500 font-bold">
                     02
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                     <div className="text-sm font-medium text-blue-600 mb-1">Week 2</div>
                     <h3 className="text-xl font-bold text-stone-900 mb-4">The Core Build</h3>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Building UI with Tailwind + shadcn/ui</span>
                        </li>
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Connecting Frontend to Backend</span>
                        </li>
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Implementing core feature logic</span>
                        </li>
                     </ul>
                  </div>
               </div>

               {/* Week 3 */}
               <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-stone-200 bg-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-stone-500 font-bold">
                     03
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
                     <div className="text-sm font-medium text-blue-600 mb-1">Week 3</div>
                     <h3 className="text-xl font-bold text-stone-900 mb-4">Bug Squashing and Launch</h3>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Payments integration (Stripe)</span>
                        </li>
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Deploying to Vercel Production</span>
                        </li>
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Setting up custom domains</span>
                        </li>
                        <li className="flex items-start gap-3 text-stone-600">
                           <Check size={18} className="text-blue-500 mt-0.5 flex-shrink-0" />
                           <span>Launch day checklist</span>
                        </li>
                     </ul>
                  </div>
               </div>

            </div>
         </div>
      </section>

      {/* Target Audience / Community */}
      <section className="py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-6">
                  Join the Builder Class
               </h2>
               <p className="text-lg text-stone-600">
                  This cohort is curated for operators, not observers. You'll build alongside founders, product leaders, and designers who are tired of waiting for permission to ship.
               </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:border-blue-200 transition-colors duration-300">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6"><Zap size={24} /></div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-3">Non-Technical Founders</h3>
                  <p className="text-stone-600 leading-relaxed">
                     Stop trading equity for dev work. Build your MVP yourself this month, and own 100% of your product.
                  </p>
               </div>
               <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:border-blue-200 transition-colors duration-300">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6"><Layers size={24} /></div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-3">Product Managers</h3>
                  <p className="text-stone-600 leading-relaxed">
                     The best PMs can build. Stop writing Jira tickets and start shipping prototypes that actually work.
                  </p>
               </div>
               <div className="p-8 bg-stone-50 rounded-2xl border border-stone-100 hover:border-blue-200 transition-colors duration-300">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6"><Code size={24} /></div>
                  <h3 className="text-xl font-semibold text-stone-900 mb-3">Designers</h3>
                  <p className="text-stone-600 leading-relaxed">
                     You already know how it should look. Now make it real. Close the gap between Figma and Production.
                  </p>
               </div>
            </div>

            {/* Social Proof Placeholder - "Community" Vibe */}
            <div className="mt-16 pt-16 border-t border-stone-100 text-center">
               <p className="text-stone-500 font-medium mb-6">Join a small, high-signal cohort</p>
               <div className="inline-flex items-center justify-center p-1 rounded-full border border-stone-200 bg-white shadow-sm">
                  <div className="flex -space-x-4 px-4">
                     {[1,2,3,4,5].map((i) => (
                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-stone-200 flex items-center justify-center text-xs font-bold text-stone-400">
                           {/* Placeholder avatars */}
                        </div>
                     ))}
                  </div>
                  <div className="px-6 py-2 text-sm font-semibold text-stone-900">
                     Only 30 Spots Available
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-stone-50">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-12 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
               {[
                  { 
                     q: "Do I need to know how to code?", 
                     a: "No! The only prerequisite for this course is having built something - anything - in a vibe-coding tool. If you're familiar with Javascript and HTML that's a plus, but not needed." 
                  },
                  { 
                     q: "What is the time commitment?", 
                     a: "Expect to spend about 5-8 hours per week. This includes the live call (1 hour) and build time." 
                  },
                  { 
                     q: "What if I miss a live call?", 
                     a: "All calls are recorded and posted to the community immediately after." 
                  },
                  { 
                     q: "Do I really build a full product?", 
                     a: "Yes. This isn't a theory course. The goal is to have a deployed URL by the end of Week 3." 
                  },
                  { 
                     q: "What if I need to drop out?", 
                     a: "If life happens and you need to cancel after your purchase, we get it. You can roll your registration into a future cohort for no fee." 
                  }
               ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="bg-white border border-stone-200 rounded-lg px-6">
                     <AccordionTrigger className="hover:no-underline py-6 text-left font-semibold text-stone-900">
                        {item.q}
                     </AccordionTrigger>
                     <AccordionContent className="pb-6 text-stone-600 text-base leading-relaxed">
                        {item.a}
                     </AccordionContent>
                  </AccordionItem>
               ))}
            </Accordion>
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
                           <p className="text-sm text-stone-500">3-Week Live Program</p>
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

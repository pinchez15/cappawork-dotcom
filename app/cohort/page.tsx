import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Check, Calendar, Code, Database, Globe, ArrowRight, Layers, Users, Zap, ShieldCheck, Lock, Play } from "lucide-react"
import Footer from "../components/footer"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const metadata: Metadata = {
  title: "PM → Builder in 30 Days | CappaWork Builder Cohort",
  description:
    "Stop writing specs. Start shipping products. A 4-week intensive for Product Managers, Product Designers, and Designers who want to build and deploy real software.",
  openGraph: {
    title: "PM → Builder in 30 Days | CappaWork Builder Cohort",
    description: "Stop writing specs. Start shipping products. A 4-week intensive for Product Managers, Product Designers, and Designers who want to build and deploy real software.",
    type: "website",
    url: "https://cappawork.com/cohort",
    siteName: "CappaWork",
    images: [
      {
        url: "https://cappawork.com/cohort_background.png",
        width: 1200,
        height: 630,
        alt: "PM → Builder in 30 Days | CappaWork Builder Cohort",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PM → Builder in 30 Days | CappaWork Builder Cohort",
    description: "Stop writing specs. Start shipping products. A 4-week intensive for Product Managers, Product Designers, and Designers who want to build and deploy real software.",
    images: ["https://cappawork.com/cohort_background.png"],
  },
}

export const dynamic = "force-dynamic";

const techLogos = [
  { src: "/logos/cursor.jpg", alt: "Cursor" },
  { src: "/logos/vercel-logotype-dark.png", alt: "Vercel" },
  { src: "/logos/supabase-logo_brandlogos.net_wahxg-scaled.png", alt: "Supabase" },
  { src: "/logos/clerk.jpeg", alt: "Clerk" },
]

export default function CohortPage() {
  const price = "$1,500"
  const duplicatedTechLogos = [...techLogos, ...techLogos]
  const stripePaymentLink = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK

  return (
    <main className="min-h-screen bg-white">
      
      {/* 1. Header (Minimal) */}
      <nav className="fixed top-0 left-0 right-0 z-50 py-4 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <a href="/" className="text-xl font-semibold tracking-tight text-stone-900">
            CappaWork
          </a>
          <Link href="#checkout" className="text-sm font-medium text-stone-600 hover:text-stone-900">
            Apply for February
          </Link>
        </div>
      </nav>

      {/* 2. Asymmetric Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
               {/* Left: Copy & Value */}
               <div className="flex flex-col items-start z-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs font-medium mb-8 uppercase tracking-wide">
                     <span className="relative flex h-2 w-2">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                     </span>
                     Enrolling for February
                  </div>
                  
                  <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05] mb-8 text-stone-900">
                     PM <span className="text-stone-300">→</span> Builder<br />
                     <span className="italic">in 30 Days.</span>
                  </h1>

                  <p className="text-xl text-stone-600 leading-relaxed mb-4 max-w-lg">
                     Stop writing specs. Start shipping products.
                  </p>
                  <p className="text-base text-stone-500 leading-relaxed mb-10 max-w-lg">
                     Built for Product Managers, Product Designers, and Designers.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                     <Link 
                       href="#checkout"
                       className="inline-flex items-center justify-center bg-stone-900 text-white px-8 py-4 rounded-full font-medium hover:bg-stone-800 transition-all duration-200 group"
                     >
                       Reserve your spot
                       <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                     </Link>
                     <div className="flex items-center justify-center px-6 py-4 text-sm font-medium text-stone-500">
                        Only 10 seats available
                     </div>
                  </div>

                  {/* Trust / Stack Strip */}
                  <div className="mt-16 pt-8 border-t border-stone-100 w-full">
                     <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-4">
                        Master the modern stack
                     </p>
                     <div className="flex gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {techLogos.map((logo, i) => (
                           <div key={i} className="relative h-6 w-24">
                              <Image src={logo.src} alt={logo.alt} fill className="object-contain object-left" />
                           </div>
                        ))}
                     </div>
                  </div>
               </div>

               {/* Right: Visual (Bleed) */}
               <div className="relative lg:h-[800px] w-full lg:w-[120%] lg:-mr-[20%]">
                  <div className="relative h-full w-full rounded-tl-3xl overflow-hidden shadow-2xl border border-stone-100 bg-stone-900">
                     <Image
                       src="/cohort_background.png"
                       alt="Cursor IDE Interface"
                       fill
                       className="object-cover object-left-top"
                       priority
                     />
                     {/* Overlay Gradient for depth */}
                     <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent pointer-events-none" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* 3. Instructor Authority (Floating Card Style) */}
      <section className="py-32 bg-stone-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
               <div className="lg:col-span-7">
                  <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-8 leading-tight">
                     "I learned to build in the cracks of a busy life."
                  </h2>
                  <p className="text-lg text-stone-600 leading-relaxed mb-8 max-w-2xl">
                     Seven kids. A full-time career in product strategy. And a notebook full of ideas that wouldn't leave me alone.
                  </p>
                  <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
                     I'm Nate. I didn't go to bootcamp. I didn't get a CS degree. I learned to leverage AI tools like Cursor and V0 to bypass the syntax struggle and ship real products. Now, I build apps that generate revenue while I spend time with my family. I want to show you exactly how I do it.
                  </p>
               </div>
               
               {/* Instructor Card */}
               <div className="lg:col-span-5 relative">
                  <div className="bg-white p-8 rounded-2xl shadow-xl border border-stone-100 relative z-10 rotate-2 hover:rotate-0 transition-transform duration-500">
                     <div className="flex items-center gap-6 mb-6">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-stone-100">
                           <Image
                              src="/nate profile photo.jpeg"
                              alt="Nate"
                              fill
                              className="object-cover"
                           />
                        </div>
                        <div>
                           <div className="text-2xl font-semibold tracking-tight text-stone-900">Nate Pinches</div>
                           <div className="text-sm text-stone-500 font-medium uppercase tracking-wide">Instructor & Builder</div>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                           <span className="text-stone-600 text-sm">Background</span>
                           <span className="font-medium text-stone-900 text-sm">Product Strategy</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                           <span className="text-stone-600 text-sm">Stack</span>
                           <span className="font-medium text-stone-900 text-sm">Next.js, Supabase, AI</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                           <span className="text-stone-600 text-sm">Recent Build</span>
                           <span className="font-medium text-stone-900 text-sm">CappaWork Agency</span>
                        </div>
                     </div>
                  </div>
                  {/* Decorative backdrop */}
                  <div className="absolute inset-0 bg-stone-200 rounded-2xl rotate-6 translate-y-2 translate-x-2 z-0"></div>
               </div>
            </div>
         </div>
      </section>

      {/* 4. The Curriculum (Linear, Clean) */}
      <section className="py-32 bg-white">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
                  The 4-Week Sprint
               </h2>
               <p className="text-lg text-stone-600">
                  A structured path from blank text file to deployed production application.
               </p>
            </div>

            <div className="space-y-16 relative">
               {/* Vertical Line */}
               <div className="absolute left-4 sm:left-8 top-8 bottom-8 w-px bg-stone-200"></div>

               {/* Week 1 */}
               <div className="relative pl-16 sm:pl-24">
                  <div className="absolute left-0 sm:left-4 top-0 w-8 h-8 sm:w-9 sm:h-9 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-white">
                     1
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-stone-900 mb-2">Foundation & Architecture</h3>
                  <p className="text-stone-500 mb-6">Days 1-7</p>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Setup Cursor, V0, and Next.js 14 environment</span>
                     </li>
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Design the Database Schema in Supabase</span>
                     </li>
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Implement Authentication with Clerk</span>
                     </li>
                  </ul>
               </div>

               {/* Week 2 */}
               <div className="relative pl-16 sm:pl-24">
                  <div className="absolute left-0 sm:left-4 top-0 w-8 h-8 sm:w-9 sm:h-9 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-white">
                     2
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-stone-900 mb-2">The Core Build</h3>
                  <p className="text-stone-500 mb-6">Days 8-14</p>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Building UI with Tailwind + shadcn/ui</span>
                     </li>
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Connecting Client Components to Server Actions</span>
                     </li>
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Implementing core feature logic (CRUD)</span>
                     </li>
                  </ul>
               </div>

               {/* Week 3 */}
               <div className="relative pl-16 sm:pl-24">
                  <div className="absolute left-0 sm:left-4 top-0 w-8 h-8 sm:w-9 sm:h-9 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-white">
                     3
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-stone-900 mb-2">Launch & Monetize</h3>
                  <p className="text-stone-500 mb-6">Days 15-21</p>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Stripe Payment Integration</span>
                     </li>
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Production Deployment to Vercel</span>
                     </li>
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Launch Day checklist</span>
                     </li>
                  </ul>
               </div>

               {/* Week 4 */}
               <div className="relative pl-16 sm:pl-24">
                  <div className="absolute left-0 sm:left-4 top-0 w-8 h-8 sm:w-9 sm:h-9 bg-stone-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg ring-4 ring-white">
                     4
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-stone-900 mb-2">Polish & Ship</h3>
                  <p className="text-stone-500 mb-6">Days 22-30</p>
                  <ul className="space-y-4">
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Code review and refinement</span>
                     </li>
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Performance optimization</span>
                     </li>
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Final deployment and go-live</span>
                     </li>
                     <li className="flex items-start gap-3 text-stone-700">
                        <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></div>
                        <span>Post-launch checklist</span>
                     </li>
                  </ul>
               </div>
            </div>
         </div>
      </section>

      {/* 5. Portfolio / Outcome Section (Replacing "Target Audience") */}
      <section className="py-32 bg-stone-900 text-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
               <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-6">
                  Build production-grade apps.
               </h2>
               <p className="text-xl text-stone-400 max-w-2xl mx-auto">
                  We don't build "Hello World" apps. The webapp you make in this cohort could be your next revenue stream. Or it could be a fun way to learn by doing!
               </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               {/* Project 1 */}
               <div className="group relative rounded-2xl overflow-hidden bg-stone-800 border border-stone-700 hover:border-stone-500 transition-colors">
                  <div className="aspect-video relative bg-stone-950">
                     <Image 
                        src="/supernate.png" 
                        alt="SuperNate Game" 
                        fill 
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                     />
                  </div>
                  <div className="p-8">
                     <h3 className="text-2xl font-semibold tracking-tight mb-2">SuperNate</h3>
                     <p className="text-stone-400 text-sm mb-4">Turn your resume into an arcade game.</p>
                     <div className="flex gap-2">
                        <span className="px-3 py-1 bg-stone-900 rounded-full text-xs border border-stone-700">Next.js</span>
                        <span className="px-3 py-1 bg-stone-900 rounded-full text-xs border border-stone-700">Tailwind</span>
                     </div>
                  </div>
               </div>

               {/* Project 2 */}
               <div className="group relative rounded-2xl overflow-hidden bg-stone-800 border border-stone-700 hover:border-stone-500 transition-colors">
                  <div className="aspect-video relative bg-stone-950">
                      <Image 
                        src="/arborkey2.png" 
                        alt="ArborKey Dashboard" 
                        fill 
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                     />
                  </div>
                  <div className="p-8">
                     <h3 className="text-2xl font-semibold tracking-tight mb-2">SaaS Dashboard</h3>
                     <p className="text-stone-400 text-sm mb-4">Auth, Payments, and Database</p>
                     <div className="flex gap-2">
                        <span className="px-3 py-1 bg-stone-900 rounded-full text-xs border border-stone-700">Supabase</span>
                        <span className="px-3 py-1 bg-stone-900 rounded-full text-xs border border-stone-700">Stripe</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Alumni Spotlight Section */}
      <section className="py-32 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-6">
                  Alumni Spotlight
               </h2>
               <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                  See what our graduates are building.
               </p>
            </div>

            <div className="max-w-2xl mx-auto">
               {/* Project Card with Builder */}
               <a
                  href="https://oursbudget.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
               >
                  <div className="bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-blue-300">
                     <div className="aspect-[16/10] relative bg-stone-100">
                        <Image
                           src="/ours_homepage.png"
                           alt="OursBudget - A budgeting app for couples"
                           fill
                           className="object-cover object-top"
                        />
                     </div>
                     <div className="p-6">
                        <div className="flex items-center justify-between">
                           <div className="flex-1">
                              <h3 className="text-xl font-semibold text-stone-900 mb-1">OursBudget</h3>
                              <p className="text-stone-500 text-sm">A budgeting app for couples</p>
                           </div>
                           <div className="flex items-center gap-3">
                              {/* Builder headshot */}
                              <div className="flex items-center gap-3">
                                 <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-stone-900">Jordan Raycroft</p>
                                    <p className="text-xs text-stone-500">Product Manager</p>
                                 </div>
                                 <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-stone-200 shrink-0">
                                    <Image
                                       src="/JordanR.png"
                                       alt="Jordan Raycroft"
                                       fill
                                       className="object-cover"
                                    />
                                 </div>
                              </div>
                              <div className="bg-blue-600 text-white p-2 rounded-full group-hover:bg-blue-700 transition-colors">
                                 <ArrowRight size={20} />
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </a>
            </div>
         </div>
      </section>

      {/* 6. Pricing & Checkout (Refined) */}
      <section id="checkout" className="py-32 bg-stone-50">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100">
               <div className="p-12 text-center">
                  <div className="text-sm font-medium text-stone-500 uppercase tracking-widest mb-4">
                     February 2026 Cohort
                  </div>
                  <div className="mb-6">
                     <h2 className="text-5xl sm:text-7xl font-semibold tracking-tight text-stone-900 mb-2">
                        {price}
                     </h2>
                     <p className="text-sm text-stone-500 mt-2">Limited to 10 committed builders</p>
                  </div>
                  <p className="text-stone-500 mb-10 text-lg">
                     One-time payment. Lifetime access to materials.
                  </p>

                  <div className="bg-stone-50 rounded-xl p-4 mb-8 border border-stone-100">
                     <p className="text-sm font-medium text-stone-700 mb-2">Live Call Schedule (8PM EST)</p>
                     <div className="flex flex-wrap justify-center gap-3 text-sm text-stone-600">
                        <span className="bg-white px-3 py-1 rounded-full border border-stone-200">Feb 2</span>
                        <span className="bg-white px-3 py-1 rounded-full border border-stone-200">Feb 9</span>
                        <span className="bg-white px-3 py-1 rounded-full border border-stone-200">Feb 16</span>
                        <span className="bg-white px-3 py-1 rounded-full border border-stone-200">Feb 23</span>
                     </div>
                  </div>

                  <div className="flex flex-col gap-4 items-center justify-center mb-12">
                     <div className="flex items-center gap-2 text-stone-700">
                        <Check size={20} className="text-green-500" />
                        <span>4 weekly live build sessions (90 min each)</span>
                     </div>
                     <div className="flex items-center gap-2 text-stone-700">
                        <Check size={20} className="text-green-500" />
                        <span>Async Slack access for 30 days</span>
                     </div>
                     <div className="flex items-center gap-2 text-stone-700">
                        <Check size={20} className="text-green-500" />
                        <span>Production-ready starter template</span>
                     </div>
                     <div className="flex items-center gap-2 text-stone-700">
                        <Check size={20} className="text-green-500" />
                        <span>Deployment walkthrough</span>
                     </div>
                     <div className="flex items-center gap-2 text-stone-700">
                        <Check size={20} className="text-green-500" />
                        <span>Code review on your final project</span>
                     </div>
                  </div>

                  {/* Stripe Payment Link CTA */}
                  <div className="w-full max-w-sm mx-auto relative z-10">
                     {stripePaymentLink ? (
                        <a
                          href={stripePaymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-full font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/20 hover:scale-[1.02] transform"
                        >
                          Checkout with Stripe
                          <ArrowRight size={18} className="ml-2" />
                        </a>
                     ) : (
                        <div className="w-full rounded-2xl border border-stone-200 bg-stone-50 px-6 py-5 text-left">
                          <div className="text-sm font-medium text-stone-900 mb-1">Checkout is not configured</div>
                          <div className="text-sm text-stone-600">
                            Set <code className="font-mono text-xs bg-white px-1.5 py-0.5 rounded border">NEXT_PUBLIC_STRIPE_PAYMENT_LINK</code> in Vercel.
                          </div>
                        </div>
                     )}
                  </div>
                  
                  <div className="mt-8 text-xs text-stone-400 flex items-center justify-center gap-2">
                     <Lock size={12} /> Secure checkout via Stripe
                  </div>
               </div>
               
               <div className="bg-stone-50 p-6 border-t border-stone-100 text-center text-sm text-stone-600">
                  <span className="font-medium text-stone-900">Show Up, Do the Work, Ship — Or Your Money Back.</span> If you attend all 4 sessions, complete the weekly assignments, and still don't have a deployed product by Day 30 — full refund. If you skip calls or don't do the work — no refund.
               </div>
            </div>
         </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
         <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-stone-900 mb-12 text-center">Common Questions</h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
               {[
                  {
                     q: "Who is this for?",
                     a: "Product Managers, Product Designers, and Designers who want to stop being bottlenecked by engineering and start shipping their own ideas."
                  },
                  {
                     q: "Do I need to know how to code?",
                     a: "No. The premise of this cohort is that modern AI tools allow us to bypass syntax. If you are logic-minded and willing to learn, you can build."
                  },
                  {
                     q: "What is the time commitment?",
                     a: "Expect to spend about 5-8 hours per week. This includes the live call (90 min) and build time."
                  },
                  {
                     q: "What happens if I miss a live session?",
                     a: "Everything is recorded and posted to our private community immediately."
                  },
                  {
                     q: "Is there a refund policy?",
                     a: "Show Up, Do the Work, Ship — Or Your Money Back. If you attend all 4 sessions, complete the weekly assignments, and still don't have a deployed product by Day 30 — full refund. If you skip calls or don't do the work — no refund."
                  }
               ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="bg-stone-50 border border-stone-100 rounded-lg px-6">
                     <AccordionTrigger className="hover:no-underline py-6 text-left font-medium text-stone-900">
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

      <Footer />
    </main>
  )
}

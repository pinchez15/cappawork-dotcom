import { Layers, Zap, Users } from "lucide-react"

export default function WhatYouGet() {
  return (
    <section id="philosophy" className="py-24 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
           <h2 className="text-3xl sm:text-5xl font-serif font-medium text-stone-900 mb-6">
            Built for businesses that are ready to evolve.
           </h2>
           <p className="text-xl text-stone-600">
             We don't just write code. We build the operational systems that let you scale without breaking.
           </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {/* Card 1 */}
          <div className="space-y-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
               <Layers size={24} />
            </div>
            <h3 className="text-2xl font-medium text-stone-900">
              We understand operations.
            </h3>
            <p className="text-lg text-stone-600 leading-relaxed">
              We know the reports admins pull, the workflows managers rely on, and the places frontline users get frustrated. We design around your reality.
            </p>
          </div>

          {/* Card 2 */}
          <div className="space-y-6">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
               <Users size={24} />
            </div>
            <h3 className="text-2xl font-medium text-stone-900">
              We make adoption easy.
            </h3>
            <p className="text-lg text-stone-600 leading-relaxed">
              Good software is invisible. We reduce steps, remove confusion, and create flows that keep your team moving—so you don't have to fight for buy-in.
            </p>
          </div>

          {/* Card 3 */}
          <div className="space-y-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
               <Zap size={24} />
            </div>
            <h3 className="text-2xl font-medium text-stone-900">
              We ship the whole product.
            </h3>
            <p className="text-lg text-stone-600 leading-relaxed">
              Branding, UI, backend, auth, database, and deployment. You don't need a designer, a dev, and a PM. You just need one partner who can build.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}


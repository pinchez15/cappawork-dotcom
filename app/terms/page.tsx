import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"

export const metadata: Metadata = {
  title: "Terms of Service | CappaWork",
  description: "CappaWork Terms of Service",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-8">
            Terms of Service
          </h1>

          <div className="prose prose-stone max-w-none">
            <p className="text-sm text-stone-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Agreement to Terms</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                By accessing or using CappaWork's services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Services</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                CappaWork provides software development services, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
                <li>Custom software development</li>
                <li>Internal tool development</li>
                <li>MVP and early-stage product development</li>
                <li>Cohort-based educational programs</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Payment Terms</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                Payment terms are specified in individual service agreements. For cohort programs:
              </p>
              <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
                <li>Payments are processed through Stripe</li>
                <li>Cohort registrations are non-refundable because you are holding a spot</li>
                <li>If you need to cancel, you can join any other cohort for no additional charge</li>
                <li>All prices are in USD unless otherwise specified</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Intellectual Property</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                Unless otherwise agreed in writing:
              </p>
              <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
                <li>You retain ownership of your business data and proprietary information</li>
                <li>We retain ownership of our methodologies, tools, and general knowledge</li>
                <li>Custom code developed for you is owned by you upon full payment</li>
                <li>Cohort materials are provided for personal use and may not be redistributed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Limitation of Liability</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                To the maximum extent permitted by law, CappaWork shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Modifications</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any material changes by updating the "Last updated" date at the top of this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Contact Information</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us at{" "}
                <a href="/contact" className="text-blue-600 hover:underline">our contact page</a>.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}



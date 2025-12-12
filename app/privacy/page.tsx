import type { Metadata } from "next"
import Navigation from "../components/navigation"
import Footer from "../components/footer"

export const metadata: Metadata = {
  title: "Privacy Policy | CappaWork",
  description: "CappaWork Privacy Policy",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <Navigation />
      <div className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-stone-900 mb-8">
            Privacy Policy
          </h1>

          <div className="prose prose-stone max-w-none">
            <p className="text-sm text-stone-500 mb-8">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Information We Collect</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>Business information you share during consultations</li>
                <li>Payment information processed through Stripe (we do not store credit card details)</li>
                <li>Communication records when you contact us</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">How We Use Your Information</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send you technical notices, updates, and support messages</li>
                <li>Respond to your comments, questions, and requests</li>
                <li>Monitor and analyze trends, usage, and activities</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Information Sharing</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share your information only:
              </p>
              <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
                <li>With service providers who assist us in operating our business (e.g., payment processors, hosting providers)</li>
                <li>When required by law or to protect our rights</li>
                <li>With your consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Data Security</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Your Rights</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-stone-700 space-y-2 mb-4">
                <li>Access and receive a copy of your personal data</li>
                <li>Request correction of inaccurate data</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-stone-900 mt-8 mb-4">Contact Us</h2>
              <p className="text-stone-700 leading-relaxed mb-4">
                If you have questions about this Privacy Policy, please contact us at{" "}
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

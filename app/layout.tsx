import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Instrument_Serif } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

const instrumentSerif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CappaWork — Make Work Human Again",
  description:
    "AI transformation for founder-led service businesses doing $3M–$10M. We elevate your people and automate your process.",
  keywords: "AI transformation, automation, founder-led businesses, operational efficiency, human-first AI",
  authors: [{ name: "CappaWork" }],
  creator: "CappaWork",
  publisher: "CappaWork",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cappawork.com",
    title: "CappaWork — Make Work Human Again",
    description: "AI transformation for founder-led service businesses doing $3M–$10M.",
    siteName: "CappaWork",
    images: [
      {
        url: "https://cappawork.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "CappaWork — Make Work Human Again",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — Make Work Human Again",
    description: "AI transformation for founder-led service businesses doing $3M–$10M.",
    images: ["https://cappawork.com/og-image.png"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      signInFallbackRedirectUrl="/dashboard"
      signUpFallbackRedirectUrl="/dashboard"
      appearance={{
        elements: {
          // Hide signup link on sign-in page (invite-only model)
          footerAction: { display: "none" },
        },
      }}
    >
      <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
        <body className="font-sans">
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}

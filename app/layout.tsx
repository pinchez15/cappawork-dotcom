import type React from "react"
import type { Metadata } from "next"
import { DM_Sans, Instrument_Serif } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
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
  metadataBase: new URL("https://cappawork.com"),
  title: "CappaWork — AI systems that change how work gets done",
  description:
    "CappaWork designs and deploys AI systems that change how operational work gets done. Agents go in where the work calls for them.",
  keywords: "AI implementation, enterprise operations, custom AI systems, operational transformation, AI agents",
  authors: [{ name: "CappaWork" }],
  creator: "CappaWork",
  publisher: "CappaWork",
  robots: "index, follow",
  icons: {
    icon: "/cappawork-favicon.svg",
    apple: "/cappawork-favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cappawork.com",
    title: "CappaWork — AI systems that change how work gets done",
    description: "Custom AI systems for the operations that run a company. We redesign the workflow and use agents where the work calls for them.",
    siteName: "CappaWork",
    images: [
      {
        url: "/linkedin-preview.jpg",
        width: 1200,
        height: 630,
        alt: "CappaWork — AI systems that change how work gets done",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — AI systems that change how work gets done",
    description: "Custom AI systems for the operations that run a company. We redesign the workflow and use agents where the work calls for them.",
    images: ["/linkedin-preview.jpg"],
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
      <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`} suppressHydrationWarning>
        <body className="font-sans">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

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
  title: "CappaWork — Your AI Team",
  description:
    "CappaWork becomes your AI team. One engagement. Six months. You keep everything we build.",
  keywords: "AI team, AI consulting, AI transformation, founder-led businesses, operational efficiency, profit improvement",
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
    title: "CappaWork — Your AI Team",
    description: "CappaWork becomes your AI team. One engagement. Six months. You keep everything we build.",
    siteName: "CappaWork",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork — Your AI Team",
    description: "CappaWork becomes your AI team. One engagement. Six months. You keep everything we build.",
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

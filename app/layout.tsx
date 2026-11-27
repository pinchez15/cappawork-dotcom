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

const SITE_TITLE = "CappaWork | AI for Healthcare"
const SITE_DESCRIPTION =
  "We turn stuck initiatives into shipped products for healthcare and life sciences companies, in one-week sprints. AI for speed, scale, and capability. Never for truth, joy, or relationships."

export const metadata: Metadata = {
  metadataBase: new URL("https://cappawork.com"),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords:
    "healthcare product team, life sciences software, clinical trial operations, pharmacy operations, regulated content operations, embedded product team, AI agents",
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
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: "CappaWork",
    images: [
      {
        url: "/linkedin-preview.jpg",
        width: 1200,
        height: 630,
        alt: SITE_TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
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

import type React from "react"
import type { Metadata } from "next"
import { Inter, Crimson_Text } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const crimsonText = Crimson_Text({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
})

export const metadata: Metadata = {
  title: "CappaWork - Web Development Agency",
  description:
    "Build products that help people flourish. CappaWork is a web development agency crafting tools with clarity, utility, and restraint.",
  keywords: "product development, web development agency, MVP development, prototyping, Next.js, AI integration",
  authors: [{ name: "CappaWork" }],
  creator: "CappaWork",
  publisher: "CappaWork",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cappawork.com",
    title: "CappaWork - Build Products That Help People Flourish",
    description: "Web development agency crafting tools with clarity, utility, and restraint.",
    siteName: "CappaWork",
  },
  twitter: {
    card: "summary_large_image",
    title: "CappaWork - Build Products That Help People Flourish",
    description: "Web development agency crafting tools with clarity, utility, and restraint.",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`}>
      <body className="font-sans bg-stone-50">
        {children}
      </body>
    </html>
  )
}

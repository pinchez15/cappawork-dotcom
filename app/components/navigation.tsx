"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import Link from "next/link"
import { useInquiry } from "./inquiry-modal"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const { open, available } = useInquiry()

  useEffect(() => {
    const currentPath = window.location.pathname
    if (currentPath === "/blog") {
      setActiveSection("blog")
    } else if (currentPath === "/") {
      const handleScroll = () => {
        const sections = ["hero", "transform", "philosophy", "how-it-works", "outcomes", "judgment", "work", "faq", "discovery"]
        const scrollPosition = window.scrollY + 120

        for (const section of sections) {
          const element = document.getElementById(section)
          if (element) {
            const { offsetTop, offsetHeight } = element
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section)
              break
            }
          }
        }
      }

      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const navItems = [
    { id: "how-it-works", label: "How it works", href: "/#how-it-works" },
    { id: "work", label: "Work", href: "/#work" },
    { id: "about", label: "About", href: "/about" },
    { id: "blog", label: "Blog", href: "/blog" },
  ]

  const handleNavClick = (href: string, id: string) => {
    if (window.location.pathname === "/" && href.startsWith("/#")) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        setActiveSection(id)
      }
    } else {
      window.location.href = href
    }
    setIsOpen(false)
  }

  const handleBookCall = () => {
    setIsOpen(false)
    if (window.location.pathname === "/" && document.getElementById("discovery")) {
      document.getElementById("discovery")?.scrollIntoView({ behavior: "smooth" })
      return
    }
    if (available) {
      open()
      return
    }
    window.location.href = "/#discovery"
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-warm-white/90 backdrop-blur-md border-b border-card-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a
            href="/"
            className="font-display text-xl tracking-tight text-navy"
          >
            CappaWork
          </a>

          <div className="hidden md:flex items-center gap-7">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href, item.id)}
                className={`text-[13px] font-medium tracking-wide uppercase transition-colors ${
                  activeSection === item.id
                    ? "text-navy"
                    : "text-stone-500 hover:text-navy"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center gap-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-[13px] font-medium text-stone-500 hover:text-navy transition-colors">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-[13px] font-medium text-stone-500 hover:text-navy transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </div>
            <button
              onClick={handleBookCall}
              className="text-[13px] font-medium bg-gold text-navy px-4 py-2 rounded-full hover:bg-gold/90 transition-colors"
            >
              Book a Call
            </button>
          </div>

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-navy" aria-label="Menu">
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-black/5">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href, item.id)}
                className={`block w-full text-left py-3 text-sm transition-colors ${
                  activeSection === item.id ? "text-navy" : "text-stone-500"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col mt-2">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="block w-full text-left py-3 text-sm text-stone-500">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="block w-full text-left py-3 text-sm text-stone-500">
                  Dashboard
                </Link>
              </SignedIn>
            </div>
            <button
              onClick={handleBookCall}
              className="mt-3 w-full bg-gold text-navy py-3 text-sm font-medium rounded-full"
            >
              Book a Call
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

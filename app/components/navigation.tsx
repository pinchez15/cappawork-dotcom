"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs"
import Link from "next/link"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  useEffect(() => {
    const currentPath = window.location.pathname
    if (currentPath === "/blog") {
      setActiveSection("blog")
    } else if (currentPath === "/") {
      const handleScroll = () => {
        const sections = ["hero", "problem", "offer", "how-it-works", "capabilities", "fit", "math", "coaching", "about"]
        const scrollPosition = window.scrollY + 100

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
    { id: "how-it-works", label: "How It Works", href: "/#how-it-works" },
    { id: "coaching", label: "Coaching", href: "/#coaching" },
    { id: "about", label: "About", href: "/#about" },
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a
            href="/"
            className="text-xl font-display tracking-tight text-white hover:text-white/80 transition-colors"
          >
            CappaWork
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href, item.id)}
                className={`text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "text-gold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center space-x-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-white/60 hover:text-white transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-white/60 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </div>
            <a
              href={calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium bg-gold text-navy px-4 py-2 rounded-full hover:bg-gold/90 transition-colors"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Navigation Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-white/80 hover:text-white">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href, item.id)}
                className={`block w-full text-left py-3 transition-colors ${
                  activeSection === item.id
                    ? "text-gold"
                    : "text-white/60 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col space-y-2 mt-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="block w-full text-left py-3 text-white/60 hover:text-white transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="block w-full text-left py-3 text-white/60 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center justify-between py-2">
                  <span className="text-white/60">Account</span>
                  <UserButton />
                </div>
              </SignedIn>
            </div>
            <a
              href={calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center mt-4 font-medium bg-gold text-navy px-4 py-3 rounded-full hover:bg-gold/90 transition-colors"
            >
              Book a Call
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

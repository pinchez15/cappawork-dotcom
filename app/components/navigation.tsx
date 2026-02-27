"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { SignInButton, UserButton, SignedIn, SignedOut, useUser } from "@clerk/nextjs"
import Link from "next/link"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")
  const { user } = useUser()

  const calendlyLink =
    process.env.NEXT_PUBLIC_CALENDLY_LINK || "https://calendly.com/cappawork/discovery_call"

  useEffect(() => {
    const currentPath = window.location.pathname
    if (currentPath === "/blog") {
      setActiveSection("blog")
    } else if (currentPath === "/") {
      const handleScroll = () => {
        const sections = ["hero", "problem", "approach", "engagement", "faq"]
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
    { id: "problem", label: "Problem", href: "/#problem" },
    { id: "approach", label: "Approach", href: "/#approach" },
    { id: "engagement", label: "Engagement", href: "/#engagement" },
    { id: "faq", label: "FAQ", href: "/#faq" },
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <a
            href="/"
            className="text-xl font-semibold tracking-tight text-stone-900 hover:text-stone-700 transition-colors"
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
                    ? "text-blue-600 font-semibold"
                    : "text-stone-600 hover:text-stone-900"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="flex items-center space-x-3">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
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
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Book a Call
            </a>
          </div>

          {/* Mobile Navigation Button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-stone-600 hover:text-stone-900">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-stone-200">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.href, item.id)}
                className="block w-full text-left py-2 text-stone-600 hover:text-stone-900 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="flex flex-col space-y-2 mt-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="block w-full text-left py-2 text-stone-600 hover:text-stone-900 transition-colors">
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="block w-full text-left py-2 text-stone-600 hover:text-stone-900 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center justify-between py-2">
                  <span className="text-stone-600">Account</span>
                  <UserButton />
                </div>
              </SignedIn>
            </div>
            <a
              href={calendlyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center mt-4 font-medium bg-blue-600 text-white px-4 py-3 rounded-md hover:bg-blue-700 transition-colors"
            >
              Book a Call
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("hero")

  useEffect(() => {
    // Set active section based on current route
    const currentPath = window.location.pathname
    if (currentPath === "/blog") {
      setActiveSection("blog")
    } else if (currentPath === "/cohort") {
      setActiveSection("cohort")
    } else if (currentPath === "/") {
      // Only handle scroll detection on homepage
      const handleScroll = () => {
        const sections = ["hero", "portfolio", "services", "about", "blog"]
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
    { id: "hero", label: "Home", href: "/" },
    { id: "cohort", label: "Cohorts", href: "/cohort" },
    { id: "pricing", label: "Services", href: "/#pricing" },
    { id: "portfolio", label: "Work", href: "/#portfolio" },
    { id: "blog", label: "Blog", href: "/blog" },
  ]

  const handleNavClick = (href: string, id: string) => {
    // If we're on the home page and it's an anchor link
    if (window.location.pathname === "/" && href.startsWith("/#")) {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
        setActiveSection(id)
      }
    } else {
      // Otherwise just navigate
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
          <div className="hidden md:flex space-x-8">
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
            <a 
              href="/cohort"
              className="text-sm font-medium bg-stone-900 text-white px-4 py-2 rounded-full hover:bg-stone-800 transition-colors"
            >
              Apply to Cohort
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
             <a 
              href="/cohort"
              className="block w-full text-center mt-4 font-medium bg-stone-900 text-white px-4 py-3 rounded-md hover:bg-stone-800 transition-colors"
            >
              Apply to Cohort
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}

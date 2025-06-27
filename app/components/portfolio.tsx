"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Clock, Users, Utensils, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface PortfolioItem {
  name: string
  status: "retired" | "active" | "WIP"
  cardDescription: string
  fullDescription: string
  icon: any
  color: string
  link?: string
  images: string[]
}

export default function Portfolio() {
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [cardImageIndices, setCardImageIndices] = useState<{ [key: number]: number }>({})

  const products: PortfolioItem[] = [
    {
      name: "CappaWork Planner",
      status: "retired",
      cardDescription: "A digital planner that integrated monastic hours with modern task management.",
      fullDescription:
        "CappaWork Planner was our first attempt at building tools that honor both productivity and contemplation. This digital planner integrated traditional monastic hours with modern task management, helping users establish sustainable rhythms of work and rest. While retired, it taught us valuable lessons about the intersection of technology and spiritual practice that inform all our current work.",
      icon: Clock,
      color: "text-amber-600",
      images: [
        "/placeholder.svg?height=300&width=400&text=Planner+Dashboard",
        "/placeholder.svg?height=300&width=400&text=Daily+Schedule",
        "/placeholder.svg?height=300&width=400&text=Prayer+Times",
        "/placeholder.svg?height=300&width=400&text=Task+Management",
      ],
    },
    {
      name: "WorkPortfolio",
      status: "active",
      cardDescription: "Simple, beautiful portfolios for generalists and independent workers.",
      fullDescription:
        "WorkPortfolio addresses the unique challenge faced by generalists and independent workers: how to showcase diverse skills and projects in a cohesive, professional manner. Built with simplicity and flexibility in mind, it allows users to create beautiful, responsive portfolios without the complexity of traditional website builders. The platform emphasizes storytelling over flashy design, helping users communicate their value clearly and authentically.",
      icon: Users,
      color: "text-blue-600",
      link: "https://workportfolio.com",
      images: [
        "/placeholder.svg?height=300&width=400&text=Portfolio+Builder",
        "/placeholder.svg?height=300&width=400&text=Template+Gallery",
        "/placeholder.svg?height=300&width=400&text=Project+Showcase",
        "/placeholder.svg?height=300&width=400&text=Mobile+View",
      ],
    },
    {
      name: "Chef",
      status: "WIP",
      cardDescription: "AI-powered meal planning that brings families together around real food.",
      fullDescription:
        "Chef is our exploration into how AI can support family life and real food preparation. Rather than promoting convenience at all costs, Chef helps families plan meals that bring people together around the table. It considers seasonal ingredients, dietary restrictions, cooking skill levels, and time constraints to suggest recipes that nourish both body and relationships. Currently in development, it represents our vision for technology that serves human flourishing rather than efficiency alone.",
      icon: Utensils,
      color: "text-green-600",
      images: [
        "/placeholder.svg?height=300&width=400&text=Recipe+Assistant",
        "/placeholder.svg?height=300&width=400&text=Meal+Planning",
        "/placeholder.svg?height=300&width=400&text=Family+Preferences",
        "/placeholder.svg?height=300&width=400&text=Shopping+Lists",
      ],
    },
  ]

  const openProject = (project: PortfolioItem) => {
    setSelectedProject(project)
    setCurrentImageIndex(0)
    document.body.style.overflow = "hidden"
  }

  const closeProject = () => {
    setSelectedProject(null)
    setCurrentImageIndex(0)
    document.body.style.overflow = "unset"
  }

  const nextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev === selectedProject.images.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => (prev === 0 ? selectedProject.images.length - 1 : prev - 1))
    }
  }

  const nextCardImage = (productIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCardImageIndices((prev) => ({
      ...prev,
      [productIndex]: ((prev[productIndex] || 0) + 1) % products[productIndex].images.length,
    }))
  }

  const prevCardImage = (productIndex: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCardImageIndices((prev) => ({
      ...prev,
      [productIndex]:
        (prev[productIndex] || 0) === 0 ? products[productIndex].images.length - 1 : (prev[productIndex] || 0) - 1,
    }))
  }

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && selectedProject) {
        closeProject()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [selectedProject])

  // Handle click outside modal to close
  const handleModalClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeProject()
    }
  }

  return (
    <>
      <section id="portfolio" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-stone-900 mb-4">Portfolio Snapshot</h2>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto">
              Showcase of our own products—proof of execution, clarity, and care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const IconComponent = product.icon
              const currentCardImageIndex = cardImageIndices[index] || 0

              return (
                <div
                  key={index}
                  className="group bg-stone-50 rounded-sm border border-stone-200 hover:border-stone-300 transition-all duration-200 hover:shadow-lg overflow-hidden"
                >
                  {/* Image Gallery */}
                  <div className="relative aspect-video bg-stone-100">
                    <Image
                      src={product.images[currentCardImageIndex] || "/placeholder.svg"}
                      alt={`${product.name} preview ${currentCardImageIndex + 1}`}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />

                    {/* Image Navigation */}
                    <button
                      onClick={(e) => prevCardImage(index, e)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-1.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronLeft size={16} className="text-stone-700" />
                    </button>
                    <button
                      onClick={(e) => nextCardImage(index, e)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-1.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <ChevronRight size={16} className="text-stone-700" />
                    </button>

                    {/* Image Dots */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {product.images.map((_, imageIndex) => (
                        <div
                          key={imageIndex}
                          className={`w-1.5 h-1.5 rounded-full transition-all ${
                            imageIndex === currentCardImageIndex ? "bg-white" : "bg-white bg-opacity-50"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Card Content */}
                  <button
                    onClick={() => openProject(product)}
                    className="p-6 text-left w-full hover:bg-stone-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <IconComponent className={`${product.color} w-6 h-6`} />
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          product.status === "active"
                            ? "bg-green-100 text-green-700"
                            : product.status === "WIP"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif font-medium text-stone-900 mb-3 group-hover:text-stone-700 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-stone-600 leading-relaxed mb-4">{product.cardDescription}</p>

                    <div className="text-sm text-stone-500 group-hover:text-stone-700 transition-colors">
                      Click to learn more →
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {selectedProject && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={handleModalClick}
        >
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <div className="flex items-center gap-3">
                <selectedProject.icon className={`${selectedProject.color} w-8 h-8`} />
                <div>
                  <h2 className="text-2xl font-serif font-medium text-stone-900">{selectedProject.name}</h2>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      selectedProject.status === "active"
                        ? "bg-green-100 text-green-700"
                        : selectedProject.status === "WIP"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {selectedProject.status}
                  </span>
                </div>
              </div>
              <button
                onClick={closeProject}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X size={24} className="text-stone-600" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image Gallery */}
              <div className="relative mb-6">
                <div className="aspect-video bg-stone-100 rounded-lg overflow-hidden">
                  <Image
                    src={selectedProject.images[currentImageIndex] || "/placeholder.svg"}
                    alt={`${selectedProject.name} screenshot ${currentImageIndex + 1}`}
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Image Navigation */}
                {selectedProject.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} className="text-stone-700" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full shadow-lg transition-all"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} className="text-stone-700" />
                    </button>

                    {/* Image Dots */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProject.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex ? "bg-white" : "bg-white bg-opacity-50"
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="prose prose-stone max-w-none mb-6">
                <p className="text-stone-700 leading-relaxed text-lg">{selectedProject.fullDescription}</p>
              </div>

              {/* Link */}
              {selectedProject.link && (
                <div className="flex justify-center">
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-stone-900 text-stone-50 px-6 py-3 rounded-sm font-medium hover:bg-stone-800 transition-all duration-200"
                  >
                    Visit Project
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>

            {/* Close Instructions */}
            <div className="px-6 pb-4 text-center text-sm text-stone-500">
              Press <kbd className="px-1.5 py-0.5 bg-stone-100 rounded text-xs">Esc</kbd> or click outside to close
            </div>
          </div>
        </div>
      )}
    </>
  )
}

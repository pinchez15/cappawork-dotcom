"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Clock, Users, Utensils, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

interface PortfolioItem {
  name: string
  status: "retired" | "active" | "WIP" | "coming soon"
  cardDescription: string
  fullDescription: string
  modalTitle?: string
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
      cardDescription: "A 90-Day Goal Planner for Ambitious Christians",
      modalTitle: "A 90-Day Goal Planner for Ambitious Christians",
      fullDescription:
        "The CappaWork Planner was created for Christians who wanted structure in their work, clarity in their calling, and growth in their spiritual life. It helped users set one clear 90-day goal and take daily steps toward it—combining proven productivity habits with timeless Christian practices.\n\nEach day started with Scripture and planning. Each evening ended with a brief examen. The goal wasn't just efficiency—it was alignment with God's purpose.\n\nEvery detail was crafted with care: from the bleed-proof paper to the vegan leather cover. It was designed to be used, carried, and returned to day after day.\n\nThough it's been sunset due to unit economics, the Planner remains a core expression of CappaWork's mission: to build useful, beautiful tools that help people flourish in faith and work.",
      icon: Clock,
      color: "text-amber-600",
      images: [
        "/CW_homepage.png",
        "/CW_Productphotos.png", 
        "/CW_buypage.png",
        "/CW_reviews.png",
      ],
    },
    {
      name: "WorkPortfolio",
      status: "coming soon",
      cardDescription: "Simple, beautiful portfolios for generalists and independent workers.",
      modalTitle: "Simple, beautiful portfolios for generalists and independent workers.",
      fullDescription:
        "WorkPortfolio addresses the unique challenge faced by generalists and independent workers: how to showcase diverse skills and projects in a cohesive, professional manner. \n\nBuilt with simplicity and flexibility in mind, it allows users to create beautiful, responsive portfolios without the complexity of traditional website builders. \n\nThe platform emphasizes storytelling over flashy design, helping users show their value clearly and authentically.\n\n Launching July 2025",
      icon: Users,
      color: "text-blue-600",
      link: "https://workportfolio.io",
      images: [
        "/WP1.png",
        "/WP2.png",
        "/WP3.png",
        "/WP4.png",
      ],
    },
    {
      name: "Chef",
      status: "WIP",
      cardDescription: "Cook Better Meals. Build Stronger Families.",
      modalTitle: "Cook Better Meals. Build Stronger Families.",
      fullDescription:
        "Chef is a quiet, thoughtful recipe app designed to help you feed the people you love—without the noise, ads, or endless scrolling. It helps you remember what works for your family, so you can make healthy, simple meals again and again—with confidence.\n\nWith Chef, anyone can learn to cook well. You don't need to be a pro. You just need something that listens. Chef adapts to dietary needs, picky eaters, and the real rhythms of family life. It remembers your edits—\"less salt,\" \"no dairy,\" \"more garlic\"—and becomes your personal cookbook.\n\nYou spend less time searching for recipes, and more time cooking them together.\n\nChef helps restore peace to the kitchen, one meal at a time. \n\n Coming soon",
      icon: Utensils,
      color: "text-green-600",
      images: [
        "/Chef1.png",
        "/Chef2.png",
        "/Chef3.png",
        "/Chef4.png",
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
              Some of our own products—proof of execution, clarity, and care.
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
                      className={`w-full h-full ${product.name === 'Chef' ? 'object-contain bg-stone-50' : 'object-cover'}`}
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
                              : product.status === "coming soon"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-stone-200 text-stone-600"
                        }`}
                      >
                        {product.status === "coming soon" ? "Coming Soon" : product.status}
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
                          : selectedProject.status === "coming soon"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-stone-200 text-stone-600"
                    }`}
                  >
                    {selectedProject.status === "coming soon" ? "Coming Soon" : selectedProject.status}
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
                    className={`w-full h-full ${selectedProject.name === 'Chef' ? 'object-contain bg-stone-50' : 'object-cover'}`}
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
              <div className="mb-6">
                {/* Modal Title */}
                {selectedProject.modalTitle && (
                  <h3 className="text-xl font-bold text-stone-900 mb-4 leading-tight">
                    {selectedProject.modalTitle}
                  </h3>
                )}
                
                {/* Format description with proper paragraphs */}
                <div className="prose prose-stone max-w-none">
                  {selectedProject.fullDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-stone-700 leading-relaxed text-lg mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
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

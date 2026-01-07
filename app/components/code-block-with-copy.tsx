"use client"

import { useEffect, useRef } from "react"
import { Copy, Check } from "lucide-react"

interface CodeBlockWithCopyProps {
  html: string
}

export default function CodeBlockWithCopy({ html }: CodeBlockWithCopyProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const preElements = containerRef.current.querySelectorAll("pre")
    
    preElements.forEach((pre) => {
      // Skip if already has copy button
      if (pre.querySelector(".copy-code-button")) return

      // Create wrapper for button (React will handle this better)
      const buttonWrapper = document.createElement("div")
      buttonWrapper.className = "copy-code-button-wrapper"
      buttonWrapper.style.position = "absolute"
      buttonWrapper.style.top = "0.5rem"
      buttonWrapper.style.right = "0.5rem"
      buttonWrapper.style.zIndex = "10"

      // Create copy button
      const button = document.createElement("button")
      button.className = "copy-code-button inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-100 rounded-sm transition-colors text-xs font-medium"
      button.setAttribute("aria-label", "Copy code")
      button.type = "button"

      // Create icon container
      const iconContainer = document.createElement("span")
      iconContainer.className = "copy-icon"
      iconContainer.style.display = "inline-flex"
      iconContainer.style.alignItems = "center"
      
      // Use a simple SVG for copy icon
      iconContainer.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v8"/>
        </svg>
      `
      
      const buttonText = document.createElement("span")
      buttonText.textContent = "Copy"
      buttonText.className = "copy-text"

      button.appendChild(iconContainer)
      button.appendChild(buttonText)
      buttonWrapper.appendChild(button)

      // Add click handler
      button.addEventListener("click", async (e) => {
        e.stopPropagation()
        const codeElement = pre.querySelector("code")
        const textToCopy = codeElement?.textContent || pre.textContent || ""
        
        try {
          await navigator.clipboard.writeText(textToCopy)
          
          // Update button UI
          buttonText.textContent = "Copied!"
          button.classList.remove("bg-stone-700", "hover:bg-stone-600")
          button.classList.add("bg-green-600", "hover:bg-green-700")
          
          // Change icon to checkmark
          iconContainer.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          `
          
          // Reset after 2 seconds
          setTimeout(() => {
            buttonText.textContent = "Copy"
            button.classList.remove("bg-green-600", "hover:bg-green-700")
            button.classList.add("bg-stone-700", "hover:bg-stone-600")
            iconContainer.innerHTML = `
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
                <path d="M4 16c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v8"/>
              </svg>
            `
          }, 2000)
        } catch (err) {
          console.error("Failed to copy:", err)
          buttonText.textContent = "Error"
          setTimeout(() => {
            buttonText.textContent = "Copy"
          }, 2000)
        }
      })

      // Make pre element relative positioned if not already
      const computedStyle = window.getComputedStyle(pre)
      if (computedStyle.position === "static") {
        pre.style.position = "relative"
      }

      pre.appendChild(buttonWrapper)
    })
  }, [html])

  return (
    <div
      ref={containerRef}
      className="blog-content text-stone-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}


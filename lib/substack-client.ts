"use client"

import { useState, useEffect } from "react"
import type { SubstackPost } from "./substack"

export function useSubstackPosts() {
  const [posts, setPosts] = useState<SubstackPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch("/api/substack")
        if (!response.ok) {
          throw new Error("Failed to fetch posts")
        }
        const data = await response.json()
        setPosts(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        // Use fallback data on error
        setPosts([
          {
            title: "Building Products That Last: Lessons from Traditional Craftsmanship",
            excerpt:
              "What medieval cathedral builders can teach us about software development and the importance of building for the long term.",
            publishedDate: "2024-01-15T00:00:00Z",
            url: "https://natepinches.substack.com/p/building-products-that-last",
            guid: "fallback-1",
          },
          {
            title: "The Rhythm of Work: Why Rest Makes Us More Productive",
            excerpt:
              "Exploring how the monastic tradition of work and prayer can inform modern product development cycles.",
            publishedDate: "2024-01-08T00:00:00Z",
            url: "https://natepinches.substack.com/p/rhythm-of-work",
            guid: "fallback-2",
          },
          {
            title: "Technology in Service of Human Flourishing",
            excerpt: "A framework for evaluating whether our digital tools are helping or hindering human development.",
            publishedDate: "2024-01-01T00:00:00Z",
            url: "https://natepinches.substack.com/p/technology-human-flourishing",
            guid: "fallback-3",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return { posts, loading, error }
}

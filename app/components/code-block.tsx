"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
}

export default function CodeBlock({ code, language, filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="relative my-6">
      {filename && (
        <div className="bg-stone-800 text-stone-200 px-4 py-2 text-sm font-mono rounded-t-lg border-b border-stone-700">
          {filename}
        </div>
      )}
      <div className="relative">
        <pre className={`bg-stone-900 text-stone-100 p-4 rounded-lg overflow-x-auto ${filename ? "rounded-t-none" : ""}`}>
          <code className={`language-${language || "text"}`}>{code}</code>
        </pre>
        <button
          onClick={handleCopy}
          className={`absolute top-2 right-2 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm transition-colors text-xs font-medium ${
            copied
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-stone-700 hover:bg-stone-600 text-stone-100"
          }`}
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}


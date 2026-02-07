"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Code2, Copy, Check } from "lucide-react"

interface CodeCardProps {
  title: string
  content: string
  explanation?: string
}

//  CodeCard Component
 
//   Rendered dynamically by the AI when the response type is "code".
//   Displays a code snippet with copy functionality and an explanation.
 
 
export function CodeCard({ title, content, explanation }: CodeCardProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: do nothing silently
    }
  }

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 bg-chart-3/10 border-b border-border">
        <Code2 className="w-4 h-4 text-chart-3" />
        <span className="text-xs font-semibold uppercase tracking-wider text-chart-3">
          Code Example
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all",
            copied
              ? "bg-primary/20 text-primary"
              : "bg-secondary text-secondary-foreground hover:bg-muted"
          )}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-3">
          {title}
        </h3>

        {/* Code Block */}
        <div className="rounded-lg bg-background border border-border overflow-x-auto">
          <pre className="p-4 text-sm font-mono text-foreground leading-relaxed">
            <code>{content}</code>
          </pre>
        </div>

        {/* Explanation */}
        {explanation && (
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {explanation}
          </p>
        )}
      </div>
    </div>
  )
}

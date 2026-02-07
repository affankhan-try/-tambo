"use client"

import React from "react"

import { FileText, CircleDot } from "lucide-react"


export interface SummaryContent {
  points: string[]
  highlights: string[]
}

interface SummaryCardProps {
  title: string
  content: SummaryContent
}


//  .. Tambo Registration:
//     Registered in the Tambo component registry. The AI selects this
//     component when the user asks for a summary, quick revision,
//     or key takeaways of a topic.
 
export function SummaryCard({ title, content }: SummaryCardProps) {
 
  function highlightText(text: string): React.ReactNode {
    if (!content.highlights || content.highlights.length === 0) return text

    
    const escaped = content.highlights.map((h) =>
      h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    )
    const regex = new RegExp(`(${escaped.join("|")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, i) => {
      const isHighlight = content.highlights.some(
        (h) => h.toLowerCase() === part.toLowerCase()
      )
      if (isHighlight) {
        return (
          <span
            key={i}
            className="px-1 py-0.5 rounded bg-primary/15 text-primary font-medium"
          >
            {part}
          </span>
        )
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 bg-chart-1/10 border-b border-border">
        <FileText className="w-4 h-4 text-chart-1" />
        <span className="text-xs font-semibold uppercase tracking-wider text-chart-1">
          Quick Summary
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {content.points.length} key points
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          {title}
        </h3>

        {/* Bullet Points */}
        <ul className="flex flex-col gap-3">
          {content.points.map((point, i) => (
            <li key={i} className="flex gap-3 items-start">
              <CircleDot className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground leading-relaxed">
                {highlightText(point)}
              </span>
            </li>
          ))}
        </ul>

        {/* Highlighted Terms */}
        {content.highlights && content.highlights.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Key Terms
            </p>
            <div className="flex flex-wrap gap-2">
              {content.highlights.map((term, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                >
                  {term}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

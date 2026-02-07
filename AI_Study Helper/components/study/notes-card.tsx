"use client"

import { BookOpen, Bookmark } from "lucide-react"
import { cn } from "@/lib/utils"

interface NotesCardProps {
  title: string
  content: string
}


//  NotesCard Component
//  
//  * Rendered dynamically by the AI when the response type is "notes".
//  * Displays an explanation of a topic in a clean card layout.
//  
//   Tambo Registration:
//  *   This component is registered in the Tambo component registry
//  *   so the AI can decide to render it when the user asks for an explanation.
//  
export function NotesCard({ title, content }: NotesCardProps) {
  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card overflow-hidden">
      {/* Header bar with accent color */}
      <div className="flex items-center gap-2 px-5 py-3 bg-primary/10 border-b border-border">
        <BookOpen className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          Study Notes
        </span>
        <Bookmark className="w-4 h-4 ml-auto text-muted-foreground hover:text-primary cursor-pointer transition-colors" />
      </div>

      {/* Card Content */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-3">
          {title}
        </h3>
        <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  )
}

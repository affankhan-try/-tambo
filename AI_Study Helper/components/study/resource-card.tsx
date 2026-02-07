"use client"

import { cn } from "@/lib/utils"
import {
  Library,
  ExternalLink,
  FileText,
  Video,
  GraduationCap,
  BookOpen,
} from "lucide-react"


  // Single learning resource entry.
 
export interface Resource {
  title: string
  url: string
  type: "documentation" | "video" | "tutorial" | "article"
  description: string
}


  // Content shape expected from the AI for resource responses.

export interface ResourceContent {
  resources: Resource[]
  suggestion?: string
}

interface ResourceCardProps {
  title: string
  content: ResourceContent
}


const RESOURCE_ICONS: Record<string, typeof FileText> = {
  documentation: FileText,
  video: Video,
  tutorial: GraduationCap,
  article: BookOpen,
}


//  Type-to-color mapping for resource entry badges.
 
const RESOURCE_COLORS: Record<string, string> = {
  documentation: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  video: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  tutorial: "bg-primary/10 text-primary border-primary/20",
  article: "bg-chart-3/10 text-chart-3 border-chart-3/20",
}


//   ResourceCard Component
 
//   Tambo Registration:
//     Registered in the Tambo component registry. The AI selects this
//     component when the user asks for documentation, learning resources,
//     video references, or study material suggestions.

export function ResourceCard({ title, content }: ResourceCardProps) {
  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 bg-chart-2/10 border-b border-border">
        <Library className="w-4 h-4 text-chart-2" />
        <span className="text-xs font-semibold uppercase tracking-wider text-chart-2">
          Learning Resources
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {content.resources.length} resources
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          {title}
        </h3>

        {/* Resource List */}
        <div className="flex flex-col gap-3">
          {content.resources.map((resource, i) => {
            const Icon = RESOURCE_ICONS[resource.type] ?? FileText
            const colorClass = RESOURCE_COLORS[resource.type] ?? "bg-secondary text-secondary-foreground"

            return (
              <a
                key={i}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-secondary/50 hover:bg-secondary hover:border-chart-2/30 transition-all"
              >
                {/* Icon */}
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-chart-2 transition-colors" />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-card-foreground group-hover:text-chart-2 transition-colors truncate">
                      {resource.title}
                    </span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {resource.description}
                  </p>
                  {/* Type Badge */}
                  <span
                    className={cn(
                      "inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium border",
                      colorClass
                    )}
                  >
                    {resource.type}
                  </span>
                </div>
              </a>
            )
          })}
        </div>

        {/* Suggestion */}
        {content.suggestion && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-chart-2/5 border border-chart-2/10">
            <p className="text-sm text-chart-2 leading-relaxed">
              {content.suggestion}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

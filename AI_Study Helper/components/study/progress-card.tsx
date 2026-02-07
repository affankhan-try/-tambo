"use client"

import { TrendingUp, Trophy, Target } from "lucide-react"
import { cn } from "@/lib/utils"


//   Progress data for a single topic.
 
export interface TopicProgress {
  name: string
  progress: number
}


//  Content shape expected from the AI for progress responses.
 
export interface ProgressContent {
  topics: TopicProgress[]
  message: string
}

interface ProgressCardProps {
  title: string
  content: ProgressContent
}

//          Tambo Registration:
//  *   Registered in the Tambo component registry. The AI selects this
//  *   component when the user asks about their learning progress,
//  *   study tracking, or topic completion status.
//  
export function ProgressCard({ title, content }: ProgressCardProps) {
  const avgProgress = Math.round(
    content.topics.reduce((sum, t) => sum + t.progress, 0) /
      content.topics.length
  )

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 bg-chart-4/10 border-b border-border">
        <TrendingUp className="w-4 h-4 text-chart-4" />
        <span className="text-xs font-semibold uppercase tracking-wider text-chart-4">
          Learning Progress
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-chart-4" />
          <span className="text-xs font-medium text-chart-4">
            {avgProgress}% Avg
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          {title}
        </h3>

        {/* Topic Progress Bars */}
        <div className="flex flex-col gap-4">
          {content.topics.map((topic, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-medium text-card-foreground">
                    {topic.name}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-xs font-semibold",
                    topic.progress >= 80
                      ? "text-primary"
                      : topic.progress >= 50
                        ? "text-chart-2"
                        : "text-chart-5"
                  )}
                >
                  {topic.progress}%
                </span>
              </div>
              {/* Animated Progress Bar */}
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-1000 ease-out",
                    topic.progress >= 80
                      ? "bg-primary"
                      : topic.progress >= 50
                        ? "bg-chart-2"
                        : "bg-chart-5"
                  )}
                  style={{ width: `${topic.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Motivational Message */}
        {content.message && (
          <div className="mt-4 px-4 py-3 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-sm text-primary leading-relaxed">
              {content.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

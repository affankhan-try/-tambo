"use client"

import { BookOpen } from "lucide-react"


//  Full-screen loader displayed during authentication transitions.

 
export function Loader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      {/* Spinner ring */}
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full border-2 border-border" />
        <div className="absolute inset-0 w-16 h-16 rounded-full border-2 border-transparent border-t-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="w-6 h-6 text-primary animate-pulse" />
        </div>
      </div>

      {/* Status text */}
      <p className="text-sm font-medium text-foreground mb-1">{text}</p>
      <p className="text-xs text-muted-foreground">
        AI Study Assistant
      </p>
    </div>
  )
}

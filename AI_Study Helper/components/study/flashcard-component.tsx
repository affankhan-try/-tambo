"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Layers, RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff } from "lucide-react"

/**
 * Single flashcard data shape.
 */
export interface Flashcard {
  front: string
  back: string
}

interface FlashcardComponentProps {
  title: string
  content: Flashcard[]
}


//  * FlashcardComponent
  // * Rendered dynamically by the AI when the response type is "flashcards".
 
export function FlashcardComponent({ title, content }: FlashcardComponentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  const card = content[currentIndex]
  const total = content.length

  const handleNext = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev + 1) % total)
  }

  const handlePrev = () => {
    setFlipped(false)
    setCurrentIndex((prev) => (prev - 1 + total) % total)
  }

  const handleFlip = () => {
    setFlipped((prev) => !prev)
  }

  const handleReset = () => {
    setFlipped(false)
    setCurrentIndex(0)
  }

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 bg-chart-5/10 border-b border-border">
        <Layers className="w-4 h-4 text-chart-5" />
        <span className="text-xs font-semibold uppercase tracking-wider text-chart-5">
          Flashcards
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {currentIndex + 1} / {total}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          {title}
        </h3>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-4">
          {content.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setFlipped(false)
                setCurrentIndex(i)
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-200",
                i === currentIndex
                  ? "bg-chart-5 w-6"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
              aria-label={`Go to card ${i + 1}`}
            />
          ))}
        </div>

        {/* Flashcard */}
        <button
          type="button"
          onClick={handleFlip}
          className={cn(
            "w-full min-h-[160px] rounded-xl border-2 p-6 text-center transition-all duration-300 cursor-pointer",
            "flex flex-col items-center justify-center gap-3",
            flipped
              ? "border-primary/30 bg-primary/5"
              : "border-border bg-secondary hover:border-chart-5/30"
          )}
          aria-label={flipped ? "Showing answer. Click to see question." : "Showing question. Click to reveal answer."}
        >
          {/* Label */}
          <span
            className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              flipped ? "text-primary" : "text-chart-5"
            )}
          >
            {flipped ? "Answer" : "Question"}
          </span>

          {/* Card Text */}
          <p
            className={cn(
              "text-sm leading-relaxed",
              flipped ? "text-primary" : "text-card-foreground"
            )}
          >
            {flipped ? card.back : card.front}
          </p>

          {/* Flip hint */}
          <div className="flex items-center gap-1.5 mt-2">
            {flipped ? (
              <EyeOff className="w-3 h-3 text-muted-foreground" />
            ) : (
              <Eye className="w-3 h-3 text-muted-foreground" />
            )}
            <span className="text-xs text-muted-foreground">
              {flipped ? "Click to hide" : "Click to reveal"}
            </span>
          </div>
        </button>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-4">
          <button
            type="button"
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

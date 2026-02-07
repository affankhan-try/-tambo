"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { HelpCircle, CheckCircle2, XCircle, Eye } from "lucide-react"

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
}

interface QuizCardProps {
  title: string
  content: QuizQuestion[]
}


//  * QuizCard Component

//    Tambo Registration:
//  *   Registered in the Tambo component registry for AI-driven rendering
//  *   when the user requests a quiz or self-assessment.

export function QuizCard({ title, content }: QuizCardProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number | null>
  >({})
  const [revealedAnswers, setRevealedAnswers] = useState<
    Record<number, boolean>
  >({})

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (revealedAnswers[questionIndex]) return
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }))
  }

  const handleReveal = (questionIndex: number) => {
    setRevealedAnswers((prev) => ({ ...prev, [questionIndex]: true }))
  }

  return (
    <div className="animate-fade-in-up rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3 bg-chart-2/10 border-b border-border">
        <HelpCircle className="w-4 h-4 text-chart-2" />
        <span className="text-xs font-semibold uppercase tracking-wider text-chart-2">
          Quick Quiz
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          {title}
        </h3>
        <div className="flex flex-col gap-6">
          {content.map((q, qi) => {
            const isRevealed = revealedAnswers[qi]
            const selected = selectedAnswers[qi]

            return (
              <div key={qi} className="flex flex-col gap-2">
                <p className="text-sm font-medium text-card-foreground">
                  {qi + 1}. {q.question}
                </p>
                <div className="flex flex-col gap-1.5">
                  {q.options.map((option, oi) => {
                    const isCorrect = oi === q.answer
                    const isSelected = selected === oi

                    let optionStyle =
                      "border-border bg-secondary text-secondary-foreground hover:bg-muted"
                    if (isRevealed) {
                      if (isCorrect) {
                        optionStyle =
                          "border-primary bg-primary/10 text-primary"
                      } else if (isSelected && !isCorrect) {
                        optionStyle =
                          "border-destructive bg-destructive/10 text-destructive"
                      } else {
                        optionStyle =
                          "border-border bg-secondary/50 text-muted-foreground"
                      }
                    } else if (isSelected) {
                      optionStyle =
                        "border-chart-2 bg-chart-2/10 text-chart-2"
                    }

                    return (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => handleSelectOption(qi, oi)}
                        disabled={isRevealed}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm text-left transition-all",
                          optionStyle,
                          isRevealed
                            ? "cursor-default"
                            : "cursor-pointer"
                        )}
                      >
                        <span className="w-5 h-5 flex items-center justify-center rounded-full border border-current text-xs shrink-0">
                          {String.fromCharCode(65 + oi)}
                        </span>
                        <span className="flex-1">{option}</span>
                        {isRevealed && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                        )}
                        {isRevealed && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-destructive shrink-0" />
                        )}
                      </button>
                    )
                  })}
                </div>
                {!isRevealed && (
                  <button
                    type="button"
                    onClick={() => handleReveal(qi)}
                    className="flex items-center gap-1.5 self-start text-xs text-muted-foreground hover:text-foreground mt-1 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Show Answer
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

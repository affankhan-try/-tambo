"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import {
  Send,
  BookOpenText,
  HelpCircle,
  Code2,
  Layers,
  FileText,
  TrendingUp,
  Library,
  Beaker,
} from "lucide-react"


//  * Quick action buttons that prepopulate the input with common queries.
//  * Each maps to one of the 7 Tambo dynamic component types.
 
const QUICK_ACTIONS = [
  { label: "Explain Topic", icon: BookOpenText, prompt: "Explain the concept of " },
  { label: "Generate Quiz", icon: HelpCircle, prompt: "Generate a quiz about " },
  { label: "Show Code", icon: Code2, prompt: "Show me a code example for " },
  { label: "Create Flashcards", icon: Layers, prompt: "Create flashcards for " },
  { label: "Show Summary", icon: FileText, prompt: "Give me a summary of " },
  { label: "Track Progress", icon: TrendingUp, prompt: "Show my learning progress" },
  { label: "Find Resources", icon: Library, prompt: "Show me learning resources for " },
] as const


const DEMO_PRESETS = [
  { label: "Explain recursion", prompt: "Explain recursion" },
  { label: "Quiz React hooks", prompt: "Quiz me on React hooks" },
  { label: "Binary search code", prompt: "Show me a code example for binary search" },
  { label: "JS flashcards", prompt: "Create flashcards for JavaScript closures" },
  { label: "React summary", prompt: "Give me a summary of React fundamentals" },
  { label: "Python resources", prompt: "Show me learning resources for Python" },
  { label: "Track my progress", prompt: "Show my learning progress" },
] as const

interface InputBarProps {
  onSend: (message: string) => void
  isLoading: boolean
 
  showDemoPresets?: boolean
}


export function InputBar({ onSend, isLoading, showDemoPresets = false }: InputBarProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSend = () => {
    const trimmed = message.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setMessage("")
  }

  const handleQuickAction = (prompt: string) => {
    // If prompt ends with a space, it's a prefix for the user to complete
    if (prompt.endsWith(" ")) {
      setMessage(prompt)
      textareaRef.current?.focus()
    } else {
      // Complete prompts are sent directly
      onSend(prompt)
    }
  }

  return (
    <div className="border-t border-border bg-background p-4">
      {/* Demo Preset Buttons */}
      {showDemoPresets && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <Beaker className="w-3.5 h-3.5 text-chart-4" />
            <span className="text-xs font-medium text-chart-4 uppercase tracking-wider">
              Demo Presets
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {DEMO_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleQuickAction(preset.prompt)}
                disabled={isLoading}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium",
                  "bg-chart-4/10 text-chart-4 border border-chart-4/20",
                  "hover:bg-chart-4/20 hover:border-chart-4/40",
                  "transition-all duration-200",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => handleQuickAction(action.prompt)}
            disabled={isLoading}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-border",
              "bg-secondary text-secondary-foreground",
              "hover:bg-primary hover:text-primary-foreground hover:border-primary",
              "transition-all duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <action.icon className="w-3.5 h-3.5" />
            {action.label}
          </button>
        ))}
      </div>

      {/* Input Area */}
      <div className="flex items-end gap-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask me anything about your studies..."
            rows={1}
            disabled={isLoading}
            className={cn(
              "w-full resize-none rounded-xl border border-border bg-secondary px-4 py-3 text-sm",
              "text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "transition-all duration-200"
            )}
          />
        </div>
        <button
          type="button"
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className={cn(
            "flex items-center justify-center w-11 h-11 rounded-xl",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90 transition-colors",
            "disabled:opacity-40 disabled:cursor-not-allowed"
          )}
          aria-label="Send message"
        >
          {isLoading ? (
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse-dot-1" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse-dot-2" />
              <span className="w-1.5 h-1.5 rounded-full bg-primary-foreground animate-pulse-dot-3" />
            </div>
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  )
}

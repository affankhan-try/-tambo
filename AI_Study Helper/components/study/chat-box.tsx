"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { User, Bot, Sparkles } from "lucide-react"
import { resolveTamboComponent } from "@/lib/tambo-registry"
import type {
  AIResponse,
  QuizQuestion,
  CodeContent,
  ProgressContentData,
  SummaryContentData,
  FlashcardData,
  ResourceContentData,
} from "@/lib/tambo-registry"

/**
 * A single chat message in the conversation.
 */
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  text: string
  /** Structured AI response data for dynamic component rendering */
  aiData?: AIResponse | null
  timestamp: Date
}

interface ChatBoxProps {
  messages: ChatMessage[]
  isLoading: boolean
}


//   ChatBox 
 
export function ChatBox({ messages, isLoading }: ChatBoxProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
      {/* Empty State */}
      {messages.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2 text-balance">
            What would you like to study?
          </h2>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Ask me to explain a topic, generate a quiz, create flashcards, or
            show resources. I will adapt my response with the right UI component.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {[
              "Explain recursion",
              "Quiz me on React",
              "Create flashcards for JS",
              "Summarize Python basics",
              "Show learning resources",
            ].map((suggestion) => (
              <span
                key={suggestion}
                className="px-3 py-1.5 rounded-full text-xs border border-border bg-secondary text-secondary-foreground"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {messages.map((msg, index) => {
          // Message grouping: check if the previous message is from the same role
          const prevMsg = index > 0 ? messages[index - 1] : null
          const isSameGroup = prevMsg && prevMsg.role === msg.role
          const showAvatar = !isSameGroup

          return (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 animate-fade-in-up",
                msg.role === "user" ? "justify-end" : "justify-start",
                isSameGroup && "mt-[-12px]"
              )}
            >
              {/* Assistant avatar */}
              {msg.role === "assistant" && (
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-1",
                    !showAvatar && "invisible"
                  )}
                >
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}

              <div
                className={cn(
                  "flex flex-col max-w-[85%] lg:max-w-[75%]",
                  msg.role === "user" ? "items-end" : "items-start"
                )}
              >
                {/* Text bubble for user messages */}
                {msg.role === "user" && (
                  <div className="px-4 py-2.5 rounded-2xl rounded-br-md bg-primary text-primary-foreground text-sm">
                    {msg.text}
                  </div>
                )}

                {/* AI text message (fallback if no structured data) */}
                {msg.role === "assistant" && !msg.aiData && (
                  <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-secondary text-secondary-foreground text-sm leading-relaxed">
                    {msg.text}
                  </div>
                )}

                {/*
                  Dynamic AI Component Rendering (Tambo pattern)

                  The AI response includes a `type` field. We look up the
                  corresponding component in the Tambo registry and render it
                  with the appropriate props. This is how AI decides the UI.

                  Supported types: notes | quiz | code | progress | summary | flashcards | resources
                */}
                {msg.role === "assistant" && msg.aiData && (
                  <DynamicAIComponent data={msg.aiData} />
                )}

                {/* Timestamp */}
                <span className="text-xs text-muted-foreground mt-1.5 px-1">
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* User avatar */}
              {msg.role === "user" && (
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 mt-1",
                    !showAvatar && "invisible"
                  )}
                >
                  <User className="w-4 h-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          )
        })}

        {/* Loading Indicator with skeleton card preview */}
        {isLoading && (
          <div className="flex gap-3 animate-fade-in-up">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="flex flex-col gap-3 flex-1 max-w-[75%]">
              {/* Typing dots */}
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-secondary w-fit">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot-1" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot-2" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse-dot-3" />
                </div>
              </div>
              {/* Skeleton card placeholder */}
              <SkeletonCard />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}

// ---------- Skeleton Loading Card ----------


function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
      {/* Skeleton header */}
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-secondary/30">
        <div className="w-4 h-4 rounded bg-muted" />
        <div className="w-24 h-3 rounded bg-muted" />
      </div>
      {/* Skeleton body */}
      <div className="px-5 py-4 flex flex-col gap-3">
        <div className="w-2/3 h-5 rounded bg-muted" />
        <div className="w-full h-3 rounded bg-muted/70" />
        <div className="w-5/6 h-3 rounded bg-muted/70" />
        <div className="w-3/4 h-3 rounded bg-muted/70" />
        <div className="w-1/2 h-3 rounded bg-muted/70" />
      </div>
    </div>
  )
}

// ---------- Dynamic Component Resolver ----------


  // Resolves and renders the correct component from the Tambo registry
  // based on the AI response type.

function DynamicAIComponent({ data }: { data: AIResponse }) {
  const Component = resolveTamboComponent(data.type)

  if (!Component) {
    return (
      <div className="px-4 py-2.5 rounded-2xl rounded-bl-md bg-secondary text-secondary-foreground text-sm">
        Unknown response type: {data.type}
      </div>
    )
  }

  // Build props based on component type
  // Each type has a unique content shape defined in the Tambo registry types
  switch (data.type) {
    case "notes":
      return <Component title={data.title} content={data.content as string} />

    case "quiz":
      return (
        <Component
          title={data.title}
          content={data.content as QuizQuestion[]}
        />
      )

    case "code": {
      const codeData = data.content as CodeContent
      return (
        <Component
          title={data.title}
          content={codeData.code}
          explanation={codeData.explanation}
        />
      )
    }

    case "progress":
      return (
        <Component
          title={data.title}
          content={data.content as ProgressContentData}
        />
      )

    case "summary":
      return (
        <Component
          title={data.title}
          content={data.content as SummaryContentData}
        />
      )

    case "flashcards":
      return (
        <Component
          title={data.title}
          content={data.content as FlashcardData[]}
        />
      )

    case "resources":
      return (
        <Component
          title={data.title}
          content={data.content as ResourceContentData}
        />
      )

    default:
      return null
  }
}

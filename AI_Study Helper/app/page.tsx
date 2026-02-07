"use client"

import { useState, useEffect, useCallback } from "react"
import { Sidebar, type ChatHistoryEntry } from "@/components/study/sidebar"
import { ChatBox, type ChatMessage } from "@/components/study/chat-box"
import { InputBar } from "@/components/study/input-bar"
import { initializeTamboComponents } from "@/lib/register-components"
import { getRegistrySummary } from "@/lib/tambo-registry"
import type { AIResponse } from "@/lib/tambo-registry"
import { cn } from "@/lib/utils"
import { Beaker, X, Component, Moon, Sun, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/auth-context"
import { useTheme } from "@/components/auth/theme-context"
import { AuthPage } from "@/components/auth/auth-page"
import { Loader } from "@/components/auth/loader"

/**

 * Supported Tambo component types:
 * - notes      -> NotesCard
 * - quiz       -> QuizCard
 * - code       -> CodeCard
 * - progress   -> ProgressCard.....
 * - summary    -> SummaryCard......
 * - flashcards -> FlashcardComponent....
 * - resources  -> ResourceCard....
 */

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  timestamp: string
}

export default function Page() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDemoMode, setShowDemoMode] = useState(true)
  const [showRegistryPanel, setShowRegistryPanel] = useState(false)

  const createNewSession = useCallback((): string => {
    const id = `chat-${Date.now()}`
    const newSession: ChatSession = {
      id,
      title: "New Chat",
      messages: [],
      timestamp: new Date().toLocaleDateString(),
    }
    setSessions((prev) => [newSession, ...prev])
    setActiveSessionId(id)
    return id
  }, [])

  const handleNewChat = useCallback(() => {
    createNewSession()
  }, [createNewSession])

  const handleSelectChat = useCallback((id: string) => {
    setActiveSessionId(id)
  }, [])

  const handleDeleteChat = useCallback(
    (id: string) => {
      setSessions((prev) => prev.filter((s) => s.id !== id))
      if (activeSessionId === id) {
        setActiveSessionId(null)
      }
    },
    [activeSessionId]
  )

  
    // Send a message to the AI backend.
  //  The backend returns structured JSON which is then rendered
    // as a dynamic component via the Tambo registry.
  
  const handleSend = useCallback(
    async (text: string) => {
      let sessionId = activeSessionId
      if (!sessionId) {
        sessionId = createNewSession()
      }

      const userMessage: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        text,
        timestamp: new Date(),
      }

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s
          const updatedMessages = [...s.messages, userMessage]
          return {
            ...s,
            messages: updatedMessages,
            title:
              s.messages.length === 0
                ? text.slice(0, 40) + (text.length > 40 ? "..." : "")
                : s.title,
          }
        })
      )

      setIsLoading(true)

      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        })

        if (!response.ok) throw new Error("API request failed")

        const data: AIResponse = await response.json()

        
          // The AI has returned structured data with a `type` field.
        //  The ChatBox component will use resolveTamboComponent(type)
        //  to look up the matching React component and render it.
         
        const assistantMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          text: data.title,
          aiData: data,
          timestamp: new Date(),
        }

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== sessionId) return s
            return { ...s, messages: [...s.messages, assistantMessage] }
          })
        )
      } catch {
        const errorMessage: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          role: "assistant",
          text: "Sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        }

        setSessions((prev) =>
          prev.map((s) => {
            if (s.id !== sessionId) return s
            return { ...s, messages: [...s.messages, errorMessage] }
          })
        )
      } finally {
        setIsLoading(false)
      }
    },
    [activeSessionId, createNewSession]
  )

  // Initialize Tambo component registry 
  useEffect(() => {
    initializeTamboComponents()
  }, [])

  // Get current active session
  const activeSession = sessions.find((s) => s.id === activeSessionId)
  const messages = activeSession?.messages ?? []

  // Registry summary for the debug panel
  const registrySummary = getRegistrySummary()

  // Convert sessions to sidebar chat history format
  const chatHistory: ChatHistoryEntry[] = sessions.map((s) => ({
    id: s.id,
    title: s.title,
    timestamp: s.timestamp,
  }))

  /**
   AUTH GATE:
   If the user is not authenticated (and not a guest), show the auth page.
  
   */
  if (authLoading) {
    return <Loader text="Preparing AI assistant..." />
  }

  if (!isAuthenticated) {
    return <AuthPage />
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* left Sidebar */}
      <Sidebar
        chatHistory={chatHistory}
        activeChatId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onSendMessage={handleSend}
      />

      {/* main Chat Area for user */}
      <main className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-foreground">
              {activeSession?.title ?? "AI Study Assistant"}
            </h1>
            {activeSession && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary font-medium">
                Tambo Adaptive UI
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {/* Tambo Registry Panel Toggle */}
            <button
              type="button"
              onClick={() => setShowRegistryPanel(!showRegistryPanel)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                showRegistryPanel
                  ? "bg-chart-4/20 text-chart-4"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <Component className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Registry</span>
            </button>

            {/* Demo Mode Toggle */}
            <button
              type="button"
              onClick={() => setShowDemoMode(!showDemoMode)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all",
                showDemoMode
                  ? "bg-chart-4/20 text-chart-4"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              <Beaker className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Demo</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>

            <div className="w-px h-5 bg-border" />

            {/* User info + Logout */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">
                {user?.isGuest ? "Guest" : user?.email?.split("@")[0] ?? "User"}
              </span>
              {user?.isGuest && (
                <span className="px-1.5 py-0.5 rounded text-xs bg-chart-3/10 text-chart-3 font-medium">
                  Guest
                </span>
              )}
              <button
                type="button"
                onClick={logout}
                className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>

        {/* Tambo Registry Panel (slide-in overlay) */}
        {showRegistryPanel && (
          <div className="border-b border-border bg-card/80 backdrop-blur-sm px-6 py-4 animate-fade-in-up">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Component className="w-4 h-4 text-chart-4" />
                <h3 className="text-sm font-semibold text-foreground">
                  Tambo Component Registry
                </h3>
                <span className="text-xs text-muted-foreground">
                  {registrySummary.length} components registered
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowRegistryPanel(false)}
                className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
              {registrySummary.map((entry) => (
                <div
                  key={entry.type}
                  className="px-3 py-2 rounded-lg border border-border bg-secondary/50"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-1.5 py-0.5 rounded text-xs font-mono bg-primary/10 text-primary">
                      {entry.type}
                    </span>
                    <span className="text-xs font-medium text-card-foreground">
                      {entry.name}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        <ChatBox messages={messages} isLoading={isLoading} />

        {/* Input Bar with optional demo presets */}
        <InputBar
          onSend={handleSend}
          isLoading={isLoading}
          showDemoPresets={showDemoMode}
        />
      </main>
    </div>
  )
}

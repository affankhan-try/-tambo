"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  MessageSquarePlus,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Layers,
  FileText,
  Zap,
} from "lucide-react"


  // Chat history entry representing a past conversation.
 
export interface ChatHistoryEntry {
  id: string
  title: string
  timestamp: string
}


//  * Quick revision shortcuts for the sidebar.

 
const REVISION_SHORTCUTS = [
  { label: "Flashcards", icon: Layers, prompt: "Create flashcards for JavaScript closures" },
  { label: "Summary", icon: FileText, prompt: "Give me a summary of React hooks" },
  { label: "Progress", icon: TrendingUp, prompt: "Show my learning progress" },
]


  // Recent topics that appear in the sidebar for quick access.
 
const RECENT_TOPICS = [
  "React Hooks",
  "Binary Search",
  "Python Basics",
  "CSS Flexbox",
  "TypeScript",
]

interface SidebarProps {
  chatHistory: ChatHistoryEntry[]
  activeChatId: string | null
  onNewChat: () => void
  onSelectChat: (id: string) => void
  onDeleteChat: (id: string) => void
  onSendMessage?: (message: string) => void
}

export function Sidebar({
  chatHistory,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onSendMessage,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)

  const handleShortcut = (prompt: string) => {
    if (onSendMessage) {
      onSendMessage(prompt)
    }
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-full border-r border-border bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-72"
      )}
    >
      {/* Logo and Brand */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground tracking-tight">
              AI Study Assistant
            </span>
            <span className="text-xs text-muted-foreground">
              Powered by Tambo
            </span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* New Chat Button */}
      <div className="px-3 py-3">
        <button
          type="button"
          onClick={onNewChat}
          className={cn(
            "flex items-center gap-2 w-full rounded-lg bg-primary text-primary-foreground font-medium transition-colors hover:bg-primary/90",
            collapsed ? "justify-center p-2.5" : "px-4 py-2.5 text-sm"
          )}
        >
          <MessageSquarePlus className="w-4 h-4 shrink-0" />
          {!collapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Progress Widget (visible when not collapsed) */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <div className="rounded-lg border border-border bg-sidebar-accent/50 p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground">
                Study Progress
              </span>
            </div>
            <div className="flex items-center gap-3 mb-1.5">
              <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full w-[68%] rounded-full bg-primary transition-all duration-1000" />
              </div>
              <span className="text-xs font-medium text-primary">68%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {chatHistory.length} sessions completed
            </p>
          </div>
        </div>
      )}

      {/* Quick Revision Shortcuts */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            Quick Revision
          </p>
          <div className="flex flex-col gap-1">
            {REVISION_SHORTCUTS.map((shortcut) => (
              <button
                key={shortcut.label}
                type="button"
                onClick={() => handleShortcut(shortcut.prompt)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <shortcut.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span>{shortcut.label}</span>
                <Zap className="w-3 h-3 ml-auto text-primary/50" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recent Topics */}
      {!collapsed && (
        <div className="px-3 pb-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            Recent Topics
          </p>
          <div className="flex flex-wrap gap-1.5 px-2">
            {RECENT_TOPICS.map((topic) => (
              <button
                key={topic}
                type="button"
                onClick={() => handleShortcut(`Explain ${topic}`)}
                className="px-2.5 py-1 rounded-full text-xs border border-border bg-sidebar-accent/30 text-sidebar-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {!collapsed && (
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2 mb-2">
            Chat History
          </p>
        )}
        <nav className="flex flex-col gap-1" aria-label="Chat history">
          {chatHistory.length === 0 && !collapsed && (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <Sparkles className="w-6 h-6 mb-2 opacity-40" />
              <p className="text-xs text-center">
                No chats yet. Start a conversation!
              </p>
            </div>
          )}
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "group flex items-center gap-2 rounded-lg transition-colors cursor-pointer",
                collapsed ? "justify-center p-2.5" : "px-3 py-2",
                activeChatId === chat.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
              onClick={() => onSelectChat(chat.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSelectChat(chat.id)
              }}
              role="button"
              tabIndex={0}
            >
              <Clock className="w-4 h-4 shrink-0 text-muted-foreground" />
              {!collapsed && (
                <>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{chat.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {chat.timestamp}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteChat(chat.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 hover:text-destructive transition-all"
                    aria-label={`Delete chat: ${chat.title}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Tambo SDK Integration Demo
          </p>
        </div>
      )}
    </aside>
  )
}

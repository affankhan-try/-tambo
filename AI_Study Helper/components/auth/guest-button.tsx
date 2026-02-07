"use client"

import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface GuestButtonProps {
  onClick: () => void
  isLoading: boolean
}

//  * Outline-styled button that allows users to skip authentication
//  * and enter the AI Study Assistant dashboard immediately.
//  * Guest users are marked with isGuest = true in AuthContext and
//  * do not have saved history or preferences.
 
export function GuestButton({ onClick, isLoading }: GuestButtonProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-4 w-full">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium",
          "bg-transparent border border-border text-muted-foreground",
          "hover:border-primary/40 hover:text-primary transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        Continue as Guest
        <ArrowRight className="w-3.5 h-3.5" />
      </button>

      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        Try instantly without an account. Save progress later.
      </p>
    </div>
  )
}

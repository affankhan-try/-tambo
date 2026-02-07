"use client"

import { useState, type FormEvent } from "react"
import { LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>
  onSwitchToSignup: () => void
  isLoading: boolean
}


export function LoginForm({ onSubmit, onSwitchToSignup, isLoading }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.trim()) {
      setError("Please enter your email address.")
      return
    }
    if (!password.trim()) {
      setError("Please enter your password.")
      return
    }

    try {
      await onSubmit(email.trim(), password)
    } catch {
      setError("Login failed. Please try again.")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <h2 className="text-xl font-semibold text-foreground">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Log in to your study assistant
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="px-3 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
          {error}
        </div>
      )}

      {/* Email field */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-email" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={isLoading}
            className={cn(
              "w-full pl-10 pr-4 py-2.5 rounded-lg text-sm",
              "bg-secondary border border-border text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "disabled:opacity-50 transition-all"
            )}
          />
        </div>
      </div>

      {/* Password field */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="login-password" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            disabled={isLoading}
            className={cn(
              "w-full pl-10 pr-10 py-2.5 rounded-lg text-sm",
              "bg-secondary border border-border text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
              "disabled:opacity-50 transition-all"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-medium",
          "bg-secondary text-secondary-foreground border border-border",
          "hover:bg-muted transition-all",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <LogIn className="w-4 h-4" />
        {isLoading ? "Logging in..." : "Log In"}
      </button>

      {/* Switch to signup */}
      <p className="text-center text-xs text-muted-foreground">
        {"Don't have an account? "}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-primary hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </form>
  )
}

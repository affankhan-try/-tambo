"use client"

import { useState } from "react"
import { BookOpen, Sparkles, Zap, Shield } from "lucide-react"
import { useAuth } from "./auth-context"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"
import { GuestButton } from "./guest-button"
import { Loader } from "./loader"

type AuthMode = "login" | "signup"


export function AuthPage() {
  const { login, signup, continueAsGuest, isLoading } = useAuth()
  const [mode, setMode] = useState<AuthMode>("login")

  // Show full-screen loader during auth transitions
  if (isLoading) {
    return (
      <Loader
        text={mode === "login" ? "Authenticating..." : mode === "signup" ? "Creating your account..." : "Preparing AI assistant..."}
      />
    )
  }

  return (
    <div className="flex items-center justify-center min-h-dvh bg-background p-4">
      <div className="flex w-full max-w-4xl rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-primary/5 animate-fade-in-up">

        {/* Left branding panel - hidden on mobile */}
        <div className="hidden md:flex flex-col justify-between w-[45%] p-8 bg-secondary/50 border-r border-border">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground tracking-tight">AI Study Assistant</h1>
                <p className="text-xs text-muted-foreground">Powered by Tambo SDK</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-3 text-balance leading-tight">
              Learn smarter with AI-adaptive interfaces
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your study assistant dynamically generates notes, quizzes, flashcards, and code examples -- the AI decides the best UI for every question.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="flex flex-col gap-3 mt-8">
            {[
              { icon: Sparkles, text: "7 adaptive AI components" },
              { icon: Zap, text: "Dynamic Tambo-driven rendering" },
              { icon: Shield, text: "Interactive quizzes and flashcards" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm text-secondary-foreground">{text}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            Hackathon Demo Project
          </p>
        </div>

        {/* Right auth forms panel */}
        <div className="flex-1 flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          {/* Mobile-only branding */}
          <div className="flex items-center gap-3 mb-6 md:hidden">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-bold text-foreground">AI Study Assistant</h1>
              <p className="text-xs text-muted-foreground">Powered by Tambo SDK</p>
            </div>
          </div>

          {/* Form */}
          {mode === "login" ? (
            <LoginForm
              onSubmit={login}
              onSwitchToSignup={() => setMode("signup")}
              isLoading={isLoading}
            />
          ) : (
            <SignupForm
              onSubmit={signup}
              onSwitchToLogin={() => setMode("login")}
              isLoading={isLoading}
            />
          )}

          {/* User access */}
          <div className="mt-4">
            <GuestButton onClick={continueAsGuest} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}

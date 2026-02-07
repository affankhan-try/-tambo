import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { AuthProvider } from "@/components/auth/auth-context"
import { ThemeProvider } from "@/components/auth/theme-context"

import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Study Assistant - Smart Learning Powered by AI",
  description:
    "AI-powered study assistant that dynamically generates notes, quizzes, and code examples. Built with Tambo SDK for adaptive AI-driven interfaces.",
}

export const viewport: Viewport = {
  themeColor: "#0a0c10",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}


  // Tambo SDK Component Registry
 
 

import type { ComponentType } from "react"

export interface AIResponse {
  type: "notes" | "quiz" | "code" | "progress" | "summary" | "flashcards" | "resources"
  title: string
  content: string | QuizQuestion[] | CodeContent | ProgressContentData | SummaryContentData | FlashcardData[] | ResourceContentData
}

export interface QuizQuestion {
  question: string
  options: string[]
  answer: number
}

export interface CodeContent {
  code: string
  explanation: string
}

export interface ProgressContentData {
  topics: { name: string; progress: number }[]
  message: string
}

export interface SummaryContentData {
  points: string[]
  highlights: string[]
}

export interface FlashcardData {
  front: string
  back: string
}

export interface ResourceContentData {
  resources: { title: string; url: string; type: "documentation" | "video" | "tutorial" | "article"; description: string }[]
  suggestion?: string
}


 
  // Maps a response type to a React component and metadata.
 
interface TamboComponentEntry {
 
  type: string
  
  name: string
  
  description: string
 
  component: ComponentType<any>
}

// ---------- Registry --------

const registry: Map<string, TamboComponentEntry> = new Map()


//  The AI can then select this component based on user intent.

export function registerTamboComponent(entry: TamboComponentEntry) {
  registry.set(entry.type, entry)
}

export function resolveTamboComponent(
  type: string
): ComponentType<any> | null {
  const entry = registry.get(type)
  return entry?.component ?? null
}


  // Get all registered components (useful for debugging / demo panels).

export function getRegisteredComponents(): TamboComponentEntry[] {
  return Array.from(registry.values())
}


  // Get a summary of the registry for display purposes.
 
export function getRegistrySummary(): { type: string; name: string; description: string }[] {
  return Array.from(registry.values()).map(({ type, name, description }) => ({
    type,
    name,
    description,
  }))
}

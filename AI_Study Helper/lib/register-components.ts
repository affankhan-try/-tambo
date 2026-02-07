/**
 * Component Registration Module
 *
 * This file registers all dynamic UI components with the Tambo registry.
 * Each component is associated with a type key that the AI uses to decide
 * which UI to render in response to a user query.
 
 
 * In a full Tambo SDK integration, this would use:
 *
 *   <TamboProvider>
 *     <TamboComponent type="notes" component={NotesCard} />
 *     <TamboComponent type="quiz" component={QuizCard} />
 *     <TamboComponent type="code" component={CodeCard} />
 *     <TamboComponent type="progress" component={ProgressCard} />
 *     <TamboComponent type="summary" component={SummaryCard} />
 *     <TamboComponent type="flashcards" component={FlashcardComponent} />
 *     <TamboComponent type="resources" component={ResourceCard} />
 *   </TamboProvider>
 */

import { registerTamboComponent } from "./tambo-registry"
import { NotesCard } from "@/components/study/notes-card"
import { QuizCard } from "@/components/study/quiz-card"
import { CodeCard } from "@/components/study/code-card"
import { ProgressCard } from "@/components/study/progress-card"
import { SummaryCard } from "@/components/study/summary-card"
import { FlashcardComponent } from "@/components/study/flashcard-component"
import { ResourceCard } from "@/components/study/resource-card"

let initialized = false


//   Initialize the Tambo component registry.
 
 
export function initializeTamboComponents() {
  if (initialized) return
  initialized = true

  // --- ORIGINAL COMPONENTS ---

  // Register NotesCard: AI renders this for topic explanations
  registerTamboComponent({
    type: "notes",
    name: "NotesCard",
    description:
      "Renders study notes when the user asks for an explanation of a concept or topic. " +
      "The AI returns a title and text content, which are displayed in a readable card layout.",
    component: NotesCard,
  })

  // Register QuizCard: AI renders this for self-assessment quizzes
  registerTamboComponent({
    type: "quiz",
    name: "QuizCard",
    description:
      "Renders an interactive quiz when the user asks for a quiz or test. " +
      "The AI returns multiple-choice questions with options and correct answers.",
    component: QuizCard,
  })

  // Register CodeCard: AI renders this for code examples
  registerTamboComponent({
    type: "code",
    name: "CodeCard",
    description:
      "Renders a code snippet with copy functionality when the user asks for a code example. " +
      "The AI returns the code string and an explanation of how it works.",
    component: CodeCard,
  })

  // --- NEW ADAPTIVE COMPONENTS ---

  // Register ProgressCard: AI renders this for learning progress tracking
  registerTamboComponent({
    type: "progress",
    name: "ProgressCard",
    description:
      "Renders a learning progress tracker when the user asks about their study progress, " +
      "topic completion, or learning status. Shows animated progress bars and motivational messages.",
    component: ProgressCard,
  })

  // Register SummaryCard: AI renders this for concise topic summaries
  registerTamboComponent({
    type: "summary",
    name: "SummaryCard",
    description:
      "Renders a concise topic summary with bullet points and highlighted key terms. " +
      "Selected when the user asks for a summary, quick revision, or key takeaways.",
    component: SummaryCard,
  })

  // Register FlashcardComponent: AI renders this for interactive flashcard revision
  registerTamboComponent({
    type: "flashcards",
    name: "FlashcardComponent",
    description:
      "Renders interactive flip-to-reveal flashcards for memory testing and revision. " +
      "Selected when the user asks for flashcards, revision cards, or quick memory tests.",
    component: FlashcardComponent,
  })

  // Register ResourceCard: AI renders this for learning resource recommendations
  registerTamboComponent({
    type: "resources",
    name: "ResourceCard",
    description:
      "Renders curated learning resources including documentation, videos, and tutorials. " +
      "Selected when the user asks for documentation, resources, or learning materials.",
    component: ResourceCard,
  })
}

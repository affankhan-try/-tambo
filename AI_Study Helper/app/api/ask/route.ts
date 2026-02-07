import { NextResponse } from "next/server"
import { generateText } from "ai"

/**
 

 

  Supported response types:
  - "notes"      -> NotesCard       (topic explanations)
  - "quiz"       -> QuizCard        (MCQ self-assessment)
  - "code"       -> CodeCard        (code snippets)
  - "progress"   -> ProgressCard    (learning progress tracking)
  - "summary"    -> SummaryCard     (bullet-point summaries)
  - "flashcards" -> FlashcardComponent (interactive flashcards)
  - "resources"  -> ResourceCard    (learning resource links)
 */


const SYSTEM_PROMPT = `You are an AI study assistant. Based on the user's message, you must return a JSON response in one of these formats:

1. If the user asks to EXPLAIN a topic or concept:
{
  "type": "notes",
  "title": "Topic Title",
  "content": "A clear, detailed explanation of the topic. Use multiple paragraphs if needed."
}

2. If the user asks for a QUIZ or test:
{
  "type": "quiz",
  "title": "Quiz Title",
  "content": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": 0
    }
  ]
}
(Include exactly 3 questions. "answer" is the 0-based index of the correct option.)

3. If the user asks for a CODE example:
{
  "type": "code",
  "title": "Code Title",
  "content": {
    "code": "// The code snippet here",
    "explanation": "A brief explanation of how the code works."
  }
}

4. If the user asks about PROGRESS or learning tracking:
{
  "type": "progress",
  "title": "Progress Title",
  "content": {
    "topics": [
      { "name": "Topic Name", "progress": 75 }
    ],
    "message": "A motivational message about their progress."
  }
}
(Include 4-5 topics with progress values between 20-95.)

5. If the user asks for a SUMMARY or quick revision:
{
  "type": "summary",
  "title": "Summary Title",
  "content": {
    "points": ["Key point 1", "Key point 2", "Key point 3"],
    "highlights": ["Important Term 1", "Important Term 2"]
  }
}
(Include 4-6 bullet points and 3-5 highlighted terms.)

6. If the user asks for FLASHCARDS or revision cards:
{
  "type": "flashcards",
  "title": "Flashcards Title",
  "content": [
    { "front": "Question text?", "back": "Answer text." }
  ]
}
(Include 4-5 flashcards.)

7. If the user asks for RESOURCES, documentation, or learning materials:
{
  "type": "resources",
  "title": "Resources Title",
  "content": {
    "resources": [
      {
        "title": "Resource Title",
        "url": "https://example.com",
        "type": "documentation",
        "description": "Brief description."
      }
    ],
    "suggestion": "A helpful learning suggestion."
  }
}
(Include 3-4 resources. Type must be one of: "documentation", "video", "tutorial", "article".)

Rules:
- ALWAYS return valid JSON and nothing else.
- Decide the type based on the user's intent.
- If the intent is unclear, default to "notes" type.
- Make content educational, accurate, and well-structured.
- For code, use clean, commented code examples.
- For quizzes, make questions challenging but fair.`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    
    try {
      const result = await generateText({
        model: "openai/gpt-4o-mini" as any,
        system: SYSTEM_PROMPT,
        prompt: message,
      })

      // Parse the AI response as JSON
      const parsed = JSON.parse(
        result.text.replace(/```json\n?|\n?```/g, "").trim()
      )
      return NextResponse.json(parsed)
    } catch {
      // Fallback: Generate intelligent structured response without AI model
      const response = generateFallbackResponse(message)
      return NextResponse.json(response)
    }
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function generateFallbackResponse(message: string) {
  const lower = message.toLowerCase()

  // Detect intent: progress tracking
  if (
    lower.includes("progress") ||
    lower.includes("tracking") ||
    lower.includes("how am i doing") ||
    lower.includes("my learning")
  ) {
    return generateProgressResponse(lower)
  }

  // Detect intent: flashcards
  if (
    lower.includes("flashcard") ||
    lower.includes("revision card") ||
    lower.includes("memory test") ||
    lower.includes("revise")
  ) {
    return generateFlashcardsResponse(lower)
  }

  // Detect intent: summary
  if (
    lower.includes("summary") ||
    lower.includes("summarize") ||
    lower.includes("key points") ||
    lower.includes("takeaway") ||
    lower.includes("overview")
  ) {
    return generateSummaryResponse(lower)
  }

  // Detect intent: resources
  if (
    lower.includes("resource") ||
    lower.includes("documentation") ||
    lower.includes("learning material") ||
    lower.includes("where can i learn") ||
    lower.includes("tutorial") ||
    lower.includes("video")
  ) {
    return generateResourcesResponse(lower)
  }

  // Detect intent: quiz
  if (
    lower.includes("quiz") ||
    lower.includes("test") ||
    lower.includes("question") ||
    lower.includes("assess")
  ) {
    return generateQuizResponse(lower)
  }

  // Detect intent: code
  if (
    lower.includes("code") ||
    lower.includes("example") ||
    lower.includes("implement") ||
    lower.includes("function") ||
    lower.includes("program") ||
    lower.includes("algorithm") ||
    lower.includes("snippet")
  ) {
    return generateCodeResponse(lower)
  }

  // Default intent: notes / explanation
  return generateNotesResponse(lower)
}

// ---------- Progress Responses ----..

function generateProgressResponse(_message: string): object {
  return {
    type: "progress",
    title: "Your Learning Progress",
    content: {
      topics: [
        { name: "JavaScript Fundamentals", progress: 85 },
        { name: "React & Hooks", progress: 72 },
        { name: "Data Structures", progress: 58 },
        { name: "Algorithms", progress: 45 },
        { name: "TypeScript", progress: 30 },
      ],
      message:
        "Great progress! You are excelling in JavaScript fundamentals. Focus on Algorithms and TypeScript to round out your skill set. Keep up the momentum!",
    },
  }
}

// ---------- Flashcard Responses ----------

function generateFlashcardsResponse(message: string): object {
  if (message.includes("javascript") || message.includes("js") || message.includes("closure")) {
    return {
      type: "flashcards",
      title: "JavaScript Closures Flashcards",
      content: [
        {
          front: "What is a closure in JavaScript?",
          back: "A closure is a function that retains access to its outer scope variables even after the outer function has finished executing.",
        },
        {
          front: "What are the two main use cases for closures?",
          back: "1. Data privacy / encapsulation (creating private variables). 2. Function factories (creating specialized functions from a template).",
        },
        {
          front: "What is the relationship between closures and scope?",
          back: "Closures 'close over' their lexical scope. They remember the environment in which they were created, including all variables in scope at that time.",
        },
        {
          front: "How do closures relate to memory management?",
          back: "Closures prevent garbage collection of their enclosed variables. This can cause memory leaks if closures are not properly cleaned up.",
        },
        {
          front: "Give a practical example of closure usage.",
          back: "Counter function: function makeCounter() { let count = 0; return () => ++count; } — Each call to makeCounter() creates a new independent counter.",
        },
      ],
    }
  }

  if (message.includes("react")) {
    return {
      type: "flashcards",
      title: "React Fundamentals Flashcards",
      content: [
        {
          front: "What is the Virtual DOM?",
          back: "A lightweight JavaScript representation of the actual DOM. React uses it to batch and minimize real DOM updates for better performance.",
        },
        {
          front: "What is the difference between state and props?",
          back: "Props are passed from parent to child (read-only). State is managed within a component and can be updated using setState or useState.",
        },
        {
          front: "What does useEffect do?",
          back: "useEffect handles side effects in functional components — like API calls, subscriptions, and DOM manipulation. It runs after render.",
        },
        {
          front: "What is JSX?",
          back: "JSX is a syntax extension that lets you write HTML-like code in JavaScript. It gets compiled to React.createElement() calls.",
        },
        {
          front: "What are React keys and why are they important?",
          back: "Keys help React identify which items in a list have changed, been added, or removed. They should be stable, unique identifiers.",
        },
      ],
    }
  }

  // Default flashcards
  return {
    type: "flashcards",
    title: "Computer Science Flashcards",
    content: [
      {
        front: "What is Big O notation?",
        back: "A mathematical notation describing the upper bound of an algorithm's time or space complexity as the input size grows.",
      },
      {
        front: "What is the difference between a stack and a queue?",
        back: "Stack: LIFO (Last In, First Out). Queue: FIFO (First In, First Out). Stacks use push/pop, queues use enqueue/dequeue.",
      },
      {
        front: "What is recursion?",
        back: "A technique where a function calls itself with a smaller input, eventually reaching a base case that stops the recursion.",
      },
      {
        front: "What is a hash table?",
        back: "A data structure that maps keys to values using a hash function. Provides O(1) average-case lookup, insertion, and deletion.",
      },
      {
        front: "What is the difference between DFS and BFS?",
        back: "DFS (Depth-First Search) explores as deep as possible first. BFS (Breadth-First Search) explores all neighbors at the current depth first.",
      },
    ],
  }
}

// ---------- Summary Responses ----------

function generateSummaryResponse(message: string): object {
  if (message.includes("react")) {
    return {
      type: "summary",
      title: "React Fundamentals Summary",
      content: {
        points: [
          "React is a JavaScript library for building user interfaces using a component-based architecture.",
          "Components can be functional or class-based, with functional components being the modern standard.",
          "State management is handled through hooks like useState and useReducer for local state, and Context API or external libraries for global state.",
          "The Virtual DOM enables efficient rendering by computing minimal DOM updates through a diffing algorithm.",
          "React follows a unidirectional data flow where props flow down from parent to child components.",
          "Side effects like API calls and subscriptions are managed through the useEffect hook with dependency arrays.",
        ],
        highlights: [
          "Virtual DOM",
          "Components",
          "useState",
          "useEffect",
          "Props",
          "Unidirectional Data Flow",
        ],
      },
    }
  }

  if (message.includes("python")) {
    return {
      type: "summary",
      title: "Python Basics Summary",
      content: {
        points: [
          "Python is dynamically typed and uses indentation instead of braces for code blocks.",
          "Lists, tuples, dictionaries, and sets are the core built-in data structures.",
          "List comprehensions provide a concise way to create and transform lists in a single expression.",
          "Functions are first-class objects and support decorators, closures, and generators.",
          "Python supports multiple paradigms: procedural, object-oriented, and functional programming.",
          "The standard library provides modules for file I/O, networking, regular expressions, and more.",
        ],
        highlights: [
          "Dynamic Typing",
          "List Comprehensions",
          "Decorators",
          "Generators",
          "First-Class Functions",
        ],
      },
    }
  }

  // Default summary
  const topic = extractTopic(message)
  return {
    type: "summary",
    title: `${topic} Summary`,
    content: {
      points: [
        `${topic} is a fundamental concept in modern software development and computer science.`,
        "Understanding the core principles helps in building scalable and maintainable applications.",
        "Key patterns include abstraction, modularity, and separation of concerns.",
        "Practical applications include web development, system design, and algorithm optimization.",
        "Best practices emphasize clean code, thorough testing, and clear documentation.",
      ],
      highlights: [
        "Abstraction",
        "Modularity",
        "Separation of Concerns",
        "Clean Code",
      ],
    },
  }
}

// ---------- Resource Responses ----------

function generateResourcesResponse(message: string): object {
  if (message.includes("react")) {
    return {
      type: "resources",
      title: "React Learning Resources",
      content: {
        resources: [
          {
            title: "Official React Documentation",
            url: "https://react.dev",
            type: "documentation",
            description:
              "The official React docs with interactive examples, tutorials, and API reference for hooks, components, and more.",
          },
          {
            title: "React Tutorial for Beginners",
            url: "https://www.youtube.com/watch?v=SqcY0GlETPk",
            type: "video",
            description:
              "A comprehensive video tutorial covering React fundamentals including JSX, components, state, and hooks.",
          },
          {
            title: "React Patterns & Best Practices",
            url: "https://www.patterns.dev/react",
            type: "article",
            description:
              "In-depth guide to React design patterns including render props, compound components, and custom hooks.",
          },
          {
            title: "Build a Full-Stack App with React",
            url: "https://nextjs.org/learn",
            type: "tutorial",
            description:
              "Hands-on tutorial for building a full-stack application with Next.js and React from scratch.",
          },
        ],
        suggestion:
          "Start with the official docs for fundamentals, then move to the patterns guide for advanced concepts. Build along with the tutorial to solidify your learning.",
      },
    }
  }

  if (message.includes("python")) {
    return {
      type: "resources",
      title: "Python Learning Resources",
      content: {
        resources: [
          {
            title: "Python Official Documentation",
            url: "https://docs.python.org/3/",
            type: "documentation",
            description:
              "Comprehensive official Python documentation including the language reference, standard library, and tutorials.",
          },
          {
            title: "Python for Everybody",
            url: "https://www.py4e.com",
            type: "tutorial",
            description:
              "Free course and textbook designed for beginners to learn Python programming from scratch.",
          },
          {
            title: "Corey Schafer Python Tutorials",
            url: "https://www.youtube.com/user/schaaborern",
            type: "video",
            description:
              "High-quality video tutorials covering Python basics, OOP, web frameworks, and data science.",
          },
          {
            title: "Real Python Tutorials",
            url: "https://realpython.com",
            type: "article",
            description:
              "In-depth Python tutorials and articles for all skill levels, covering core concepts to advanced topics.",
          },
        ],
        suggestion:
          "Begin with Python for Everybody for a solid foundation, then explore Real Python for intermediate and advanced topics. Practice daily with small projects!",
      },
    }
  }

  // Default resources
  return {
    type: "resources",
    title: "Programming Learning Resources",
    content: {
      resources: [
        {
          title: "MDN Web Docs",
          url: "https://developer.mozilla.org",
          type: "documentation",
          description:
            "The most comprehensive reference for web technologies including HTML, CSS, JavaScript, and Web APIs.",
        },
        {
          title: "freeCodeCamp",
          url: "https://www.freecodecamp.org",
          type: "tutorial",
          description:
            "Free, project-based learning platform with thousands of coding challenges and certifications.",
        },
        {
          title: "CS50 by Harvard",
          url: "https://cs50.harvard.edu",
          type: "video",
          description:
            "Harvard's renowned introduction to computer science and programming, available free online.",
        },
        {
          title: "The Pragmatic Programmer",
          url: "https://pragprog.com/titles/tpp20/",
          type: "article",
          description:
            "Classic software engineering book covering best practices, design principles, and career advice.",
        },
      ],
      suggestion:
        "Combine structured learning (courses) with hands-on practice (projects). Consistency matters more than intensity - aim for 30-60 minutes of focused study daily.",
    },
  }
}

//  Notes Responses ----------

function generateNotesResponse(message: string): object {
  if (message.includes("recursion")) {
    return {
      type: "notes",
      title: "Understanding Recursion",
      content:
        "Recursion is a programming technique where a function calls itself to solve a problem. It breaks down complex problems into smaller, identical sub-problems.\n\nKey Concepts:\n\n1. Base Case: Every recursive function needs a stopping condition to prevent infinite loops. This is the simplest version of the problem that can be solved directly.\n\n2. Recursive Case: The part where the function calls itself with a modified input, moving closer to the base case.\n\n3. Call Stack: Each recursive call is added to the call stack. When the base case is reached, the stack unwinds and results are combined.\n\nExample: Computing factorial(5)\n- factorial(5) = 5 x factorial(4)\n- factorial(4) = 4 x factorial(3)\n- factorial(3) = 3 x factorial(2)\n- factorial(2) = 2 x factorial(1)\n- factorial(1) = 1 (base case)\n\nCommon applications include tree traversal, divide-and-conquer algorithms, and mathematical computations like Fibonacci sequences.",
    }
  }

  if (message.includes("react") && message.includes("hook")) {
    return {
      type: "notes",
      title: "React Hooks Explained",
      content:
        "React Hooks are functions that let you use state and lifecycle features in functional components, introduced in React 16.8.\n\nCore Hooks:\n\n1. useState - Manages local component state. Returns a state value and a setter function.\n\n2. useEffect - Handles side effects like API calls, subscriptions, and DOM manipulation. Runs after render.\n\n3. useContext - Accesses context values without nesting Consumer components.\n\n4. useRef - Creates a mutable reference that persists across renders without causing re-renders.\n\n5. useMemo - Memoizes expensive computations, recalculating only when dependencies change.\n\n6. useCallback - Memoizes function references to prevent unnecessary child re-renders.\n\nRules of Hooks:\n- Only call hooks at the top level (not inside loops or conditions)\n- Only call hooks from React functions\n- Custom hooks must start with 'use'",
    }
  }

  if (message.includes("javascript") || message.includes("js")) {
    return {
      type: "notes",
      title: "JavaScript Fundamentals",
      content:
        "JavaScript is a dynamic, interpreted programming language that powers the modern web.\n\nCore Concepts:\n\n1. Variables & Types: JavaScript has primitive types (string, number, boolean, null, undefined, symbol, bigint) and reference types (objects, arrays, functions).\n\n2. Closures: A function that has access to variables from its outer scope, even after the outer function has returned. This is fundamental to JavaScript patterns.\n\n3. Prototypal Inheritance: Objects can inherit properties from other objects through the prototype chain, unlike class-based inheritance in languages like Java.\n\n4. Event Loop: JavaScript is single-threaded but uses an event loop for asynchronous operations. The call stack, callback queue, and microtask queue work together.\n\n5. ES6+ Features: Arrow functions, destructuring, template literals, spread/rest operators, promises, async/await, and modules.",
    }
  }

  if (message.includes("python")) {
    return {
      type: "notes",
      title: "Python Programming Essentials",
      content:
        "Python is a high-level, interpreted language known for its readability and versatility.\n\nKey Features:\n\n1. Dynamic Typing: Variables don't need type declarations. Python infers types at runtime.\n\n2. Indentation-Based Syntax: Python uses whitespace indentation to define code blocks instead of braces.\n\n3. List Comprehensions: Elegant one-liners for creating lists: [x**2 for x in range(10)]\n\n4. Decorators: Functions that modify other functions using the @decorator syntax. Common for logging, authentication, and caching.\n\n5. Generators: Functions that yield values one at a time using 'yield', enabling memory-efficient iteration over large datasets.\n\n6. Popular Libraries: NumPy (numerical computing), Pandas (data analysis), Flask/Django (web), TensorFlow/PyTorch (ML).",
    }
  }

  const topic = extractTopic(message)
  return {
    type: "notes",
    title: `Understanding ${topic}`,
    content: `${topic} is an important concept in computer science and software development.\n\nKey Points:\n\n1. Definition: ${topic} refers to the fundamental principles and patterns that underlie how this concept works in practice.\n\n2. Why It Matters: Understanding ${topic} is crucial for building efficient, maintainable, and scalable software systems.\n\n3. Core Principles: The main ideas behind ${topic} involve abstraction, modularity, and clear separation of concerns.\n\n4. Practical Application: In real-world projects, ${topic} is commonly used to solve problems related to data management, performance optimization, and code organization.\n\n5. Best Practices: When working with ${topic}, focus on writing clean, well-documented code and follow established design patterns.`,
  }
}

// ---------- Quiz Responses ----------

function generateQuizResponse(message: string): object {
  if (message.includes("react")) {
    return {
      type: "quiz",
      title: "React Knowledge Quiz",
      content: [
        {
          question:
            "What hook is used to manage local state in a React functional component?",
          options: ["useEffect", "useState", "useContext", "useReducer"],
          answer: 1,
        },
        {
          question:
            "Which of the following is NOT a rule of React Hooks?",
          options: [
            "Only call hooks at the top level",
            "Only call hooks from React functions",
            "Hooks must start with 'use'",
            "Hooks can be called inside loops",
          ],
          answer: 3,
        },
        {
          question: "What does the useEffect hook do?",
          options: [
            "Manages component state",
            "Handles side effects after render",
            "Creates mutable references",
            "Memoizes expensive computations",
          ],
          answer: 1,
        },
      ],
    }
  }

  if (message.includes("python")) {
    return {
      type: "quiz",
      title: "Python Fundamentals Quiz",
      content: [
        {
          question:
            "Which keyword is used to define a function in Python?",
          options: ["function", "func", "def", "fn"],
          answer: 2,
        },
        {
          question: "What is the output of: print(type([]))?",
          options: [
            "<class 'tuple'>",
            "<class 'list'>",
            "<class 'dict'>",
            "<class 'set'>",
          ],
          answer: 1,
        },
        {
          question:
            "Which of these is a valid list comprehension?",
          options: [
            "[x for x in range(5)]",
            "{x for x in range(5)}",
            "(x for x in range(5))",
            "list(x in range(5))",
          ],
          answer: 0,
        },
      ],
    }
  }

  return {
    type: "quiz",
    title: "Computer Science Quiz",
    content: [
      {
        question:
          "What data structure uses LIFO (Last In, First Out) ordering?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: 1,
      },
      {
        question:
          "What is the time complexity of binary search?",
        options: ["O(n)", "O(n log n)", "O(log n)", "O(1)"],
        answer: 2,
      },
      {
        question:
          "Which sorting algorithm has the best average-case time complexity?",
        options: [
          "Bubble Sort - O(n^2)",
          "Merge Sort - O(n log n)",
          "Selection Sort - O(n^2)",
          "Insertion Sort - O(n^2)",
        ],
        answer: 1,
      },
    ],
  }
}

// ---------- Code Responses ----------

function generateCodeResponse(message: string): object {
  if (
    message.includes("binary search") ||
    message.includes("search")
  ) {
    return {
      type: "code",
      title: "Binary Search Implementation",
      content: {
        code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid; // Target found
    } else if (arr[mid] < target) {
      left = mid + 1; // Search right half
    } else {
      right = mid - 1; // Search left half
    }
  }

  return -1; // Target not found
}

// Usage
const sorted = [1, 3, 5, 7, 9, 11, 13];
console.log(binarySearch(sorted, 7)); // Output: 3`,
        explanation:
          "Binary search works on sorted arrays by repeatedly dividing the search interval in half. It compares the target with the middle element and eliminates half of the remaining elements each iteration, achieving O(log n) time complexity.",
      },
    }
  }

  if (message.includes("sort") || message.includes("sorting")) {
    return {
      type: "code",
      title: "Quick Sort Algorithm",
      content: {
        code: `function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivot = arr[arr.length - 1];
  const left = [];
  const right = [];

  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return [...quickSort(left), pivot, ...quickSort(right)];
}

console.log(quickSort([38, 27, 43, 3, 9, 82, 10]));
// Output: [3, 9, 10, 27, 38, 43, 82]`,
        explanation:
          "Quick Sort uses divide-and-conquer. It selects a pivot, partitions the array into elements less than and greater than the pivot, then recursively sorts each partition. Average time complexity: O(n log n).",
      },
    }
  }

  if (message.includes("fibonacci")) {
    return {
      type: "code",
      title: "Fibonacci Sequence",
      content: {
        code: `function fibonacci(n) {
  if (n <= 1) return n;

  let prev = 0;
  let curr = 1;

  for (let i = 2; i <= n; i++) {
    const next = prev + curr;
    prev = curr;
    curr = next;
  }

  return curr;
}

const sequence = Array.from({ length: 10 }, (_, i) => fibonacci(i));
console.log(sequence);
// Output: [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]`,
        explanation:
          "This iterative approach computes Fibonacci numbers in O(n) time and O(1) space, avoiding the exponential time complexity of the naive recursive approach.",
      },
    }
  }

  return {
    type: "code",
    title: "Array Map, Filter, and Reduce",
    content: {
      code: `const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Map: Transform each element
const doubled = numbers.map(n => n * 2);

// Filter: Keep elements matching a condition
const evens = numbers.filter(n => n % 2 === 0);

// Reduce: Combine all into one value
const sum = numbers.reduce((acc, n) => acc + n, 0);

// Chain them together
const result = numbers
  .filter(n => n % 2 !== 0)
  .map(n => n ** 2)
  .reduce((acc, n) => acc + n, 0);

console.log(result); // 165`,
      explanation:
        "Map transforms elements, filter selects matching elements, and reduce combines them into a single value. They can be chained for powerful data transformations.",
    },
  }
}


  // extract a topic from the user message for generating relevant content.
 
function extractTopic(message: string): string {
  const cleaned = message
    .replace(
      /\b(explain|what is|what are|tell me about|describe|how does|how do|the|a|an|please|can you|could you|give me|show me|summary of|summarize)\b/gi,
      ""
    )
    .trim()

  if (cleaned.length < 3) return "Programming Concepts"

  return cleaned
    .split(" ")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

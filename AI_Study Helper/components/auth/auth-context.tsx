"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react"


//   Supports three modes:
//    1. Signed-up user (email + password)
//    2. Logged-in user (email + password)
//    3. Guest user (no credentials, isGuest = true)
 
export interface AuthUser {
  email: string
  isGuest: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  continueAsGuest: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)


function simulateAuthDelay(ms = 1500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = useCallback(async (email: string, _password: string) => {
    setIsLoading(true)
    await simulateAuthDelay(1400)
    setUser({ email, isGuest: false })
    setIsLoading(false)
  }, [])

  const signup = useCallback(async (email: string, _password: string) => {
    setIsLoading(true)
    await simulateAuthDelay(1800)
    setUser({ email, isGuest: false })
    setIsLoading(false)
  }, [])

  const continueAsGuest = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setUser({ email: "guest", isGuest: true })
      setIsLoading(false)
    }, 800)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        signup,
        continueAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

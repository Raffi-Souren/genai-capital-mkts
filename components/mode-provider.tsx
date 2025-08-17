"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Mode = "mock" | "live"

interface ModeContextType {
  mode: Mode
  setMode: (mode: Mode) => void
  isLiveAvailable: boolean
}

const ModeContext = createContext<ModeContextType | undefined>(undefined)

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("mock")
  const [isLiveAvailable, setIsLiveAvailable] = useState(false)

  useEffect(() => {
    // Check if OpenAI API key is available
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setIsLiveAvailable(data.llm_available || false)
      })
      .catch(() => {
        setIsLiveAvailable(false)
      })
  }, [])

  return <ModeContext.Provider value={{ mode, setMode, isLiveAvailable }}>{children}</ModeContext.Provider>
}

export function useMode() {
  const context = useContext(ModeContext)
  if (context === undefined) {
    throw new Error("useMode must be used within a ModeProvider")
  }
  return context
}

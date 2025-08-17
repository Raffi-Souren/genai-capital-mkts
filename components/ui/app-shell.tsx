"use client"
import Link from "next/link"
import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { Home, ArrowLeft, Sun, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useMode } from "@/components/mode-provider"
import { useState, useEffect } from "react"

interface AppShellProps {
  title?: string
  children: React.ReactNode
  showFavorite?: boolean
  agentId?: string
}

export default function AppShell({ title, children, showFavorite = false, agentId }: AppShellProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { mode } = useMode()
  const isHome = pathname === "/"

  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (agentId) {
      const favorites = JSON.parse(localStorage.getItem("agent-favorites") || "[]")
      setIsFavorite(favorites.includes(agentId))
    }
  }, [agentId])

  const toggleFavorite = () => {
    if (!agentId) return
    const favorites = JSON.parse(localStorage.getItem("agent-favorites") || "[]")
    const newFavorites = isFavorite ? favorites.filter((id: string) => id !== agentId) : [...favorites, agentId]
    localStorage.setItem("agent-favorites", JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen">
      {/* top bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-semibold text-slate-900 hover:text-slate-700 transition-colors"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white text-xs">
                CM
              </span>
              <span>Capital Markets Agent Factory</span>
            </Link>
            {!isHome && title && (
              <>
                <span className="mx-2 text-slate-300">/</span>
                <span className="text-slate-600">{title}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {mode.toUpperCase()}
            </Badge>

            {showFavorite && agentId && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                className={isFavorite ? "text-red-500 hover:text-red-600" : "text-slate-400 hover:text-slate-600"}
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              </Button>
            )}

            <Button variant="ghost" size="icon" aria-label="Go home" onClick={() => router.push("/")}>
              <Home className="h-4 w-4" />
            </Button>
            {!isHome && (
              <Button variant="outline" size="sm" onClick={handleBack}>
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* page content */}
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}

function ThemeToggle() {
  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme">
      <Sun className="h-4 w-4" />
    </Button>
  )
}

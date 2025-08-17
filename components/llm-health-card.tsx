"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Shield } from "lucide-react"

interface HealthStatus {
  live: boolean
  model: string
  at: string
  mode: string
}

export function LLMHealthCard() {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(false)

  const checkHealth = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/llm/health")
      const data = await response.json()
      setHealth(data)
    } catch (error) {
      console.error("Health check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">LLM Health</CardTitle>
        <Button variant="ghost" size="sm" onClick={checkHealth} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Mode:</span>
            <Badge variant={health?.live ? "default" : "secondary"}>{health?.mode || "Checking..."}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Model:</span>
            <span className="text-sm font-mono">{health?.model || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Last Check:</span>
            <span className="text-xs text-muted-foreground">
              {health?.at ? new Date(health.at).toLocaleTimeString() : "—"}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>LLM calls happen server-side only. No secrets sent to browser.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

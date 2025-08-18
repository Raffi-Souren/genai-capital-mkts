"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

interface MetricsData {
  mode: string
  model: string
  latencyMs: number
  costUsd: number
}

export function GlobalHeaderChips() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null)

  useEffect(() => {
    // Listen for metrics updates from API responses
    const handleMetricsUpdate = (event: CustomEvent<MetricsData>) => {
      setMetrics(event.detail)
    }

    window.addEventListener("metricsUpdate", handleMetricsUpdate as EventListener)
    return () => window.removeEventListener("metricsUpdate", handleMetricsUpdate as EventListener)
  }, [])

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
        Mode: {metrics?.mode || "—"}
      </Badge>
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        Model: {metrics?.model || "—"}
      </Badge>
      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
        Latency: {metrics?.latencyMs ? `${metrics.latencyMs}ms` : "—"}
      </Badge>
      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
        Cost: {metrics?.costUsd ? `$${metrics.costUsd.toFixed(4)}` : "—"}
      </Badge>
    </div>
  )
}

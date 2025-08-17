"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, Zap, TrendingUp } from "lucide-react"

interface PerformanceMetricsProps {
  startTime?: number
  endTime?: number
  tokensUsed?: number
  costEstimate?: number
  speedImprovement?: string
  className?: string
}

export function PerformanceMetrics({
  startTime,
  endTime,
  tokensUsed,
  costEstimate,
  speedImprovement,
  className = "",
}: PerformanceMetricsProps) {
  const [duration, setDuration] = useState<number | null>(null)

  useEffect(() => {
    if (startTime && endTime) {
      setDuration(endTime - startTime)
    }
  }, [startTime, endTime])

  // Mock performance data for demo
  const mockMetrics = {
    duration: duration || 2.3,
    tokens: tokensUsed || 1247,
    cost: costEstimate || 0.73,
    improvement: speedImprovement || "8x faster than manual",
  }

  return (
    <Card className={`bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Zap className="h-4 w-4 text-green-600" />
          Performance Metrics
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{mockMetrics.duration}s</div>
              <div className="text-xs text-muted-foreground">Processing time</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-3 w-3 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">${mockMetrics.cost}</div>
              <div className="text-xs text-muted-foreground">API cost</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{mockMetrics.tokens}</div>
              <div className="text-xs text-muted-foreground">Tokens used</div>
            </div>
          </div>

          <div className="col-span-2">
            <Badge variant="secondary" className="w-full justify-center text-xs">
              {mockMetrics.improvement}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

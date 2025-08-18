"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReasoningStep {
  step: number
  description: string
  assumptions?: string[]
  citations?: string[]
}

interface ReasoningSummaryProps {
  steps: ReasoningStep[]
  title?: string
}

export function ReasoningSummary({ steps, title = "Reasoning Summary" }: ReasoningSummaryProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mt-4">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="flex items-center gap-2 text-sm">
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {title}
        </CardTitle>
      </CardHeader>
      {isExpanded && (
        <CardContent className="space-y-3">
          {steps.map((step) => (
            <div key={step.step} className="border-l-2 border-blue-200 pl-4">
              <div className="font-medium text-sm">Step {step.step}</div>
              <div className="text-sm text-slate-600">{step.description}</div>
              {step.assumptions && step.assumptions.length > 0 && (
                <div className="text-xs text-slate-500 mt-1">
                  <strong>Assumptions:</strong> {step.assumptions.join(", ")}
                </div>
              )}
              {step.citations && step.citations.length > 0 && (
                <div className="text-xs text-slate-500 mt-1">
                  <strong>Citations:</strong> {step.citations.join(", ")}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
}

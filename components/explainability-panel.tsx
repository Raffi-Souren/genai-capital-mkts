"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, ChevronDown, ChevronUp } from "lucide-react"

interface ExplainabilityPanelProps {
  reasoning?: string
  confidence?: number
  sources?: string[]
  className?: string
}

export function ExplainabilityPanel({ reasoning, confidence, sources = [], className = "" }: ExplainabilityPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!reasoning) return null

  return (
    <Card className={`bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="h-4 w-4 text-blue-600" />
            GPT-5 Reasoning
            {confidence && (
              <Badge variant="secondary" className="ml-2">
                {Math.round(confidence * 100)}% confidence
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="h-6 w-6 p-0">
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Chain of Thought:</h4>
              <div className="bg-white dark:bg-gray-900 rounded-md p-3 text-xs leading-relaxed border">
                <pre className="whitespace-pre-wrap font-mono">{reasoning}</pre>
              </div>
            </div>

            {sources.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Sources Referenced:</h4>
                <div className="flex flex-wrap gap-1">
                  {sources.map((source, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {source}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}

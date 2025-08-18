"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface CompareResult {
  model: string
  text: string
  validator: "pass" | "fail"
  latency: number
  cost: number
}

interface CompareToggleProps {
  onCompare: (enabled: boolean) => void
  results?: CompareResult[]
}

export function CompareToggle({ onCompare, results }: CompareToggleProps) {
  const [enabled, setEnabled] = useState(false)

  const handleToggle = (checked: boolean) => {
    setEnabled(checked)
    onCompare(checked)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="compare-mode" checked={enabled} onCheckedChange={handleToggle} />
        <Label htmlFor="compare-mode">Compare GPT-4 vs GPT-5</Label>
      </div>

      {enabled && results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.map((result, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{result.model}</h3>
                <Badge variant={result.validator === "pass" ? "default" : "destructive"}>{result.validator}</Badge>
              </div>
              <p className="text-sm text-slate-600">{result.text}</p>
              <div className="flex gap-4 text-xs text-slate-500">
                <span>Latency: {result.latency}ms</span>
                <span>Cost: ${result.cost.toFixed(4)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

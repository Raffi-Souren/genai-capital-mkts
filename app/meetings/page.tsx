"use client"

import { useState, useEffect } from "react"
import AppShell from "@/components/ui/app-shell"
import { TopActions } from "@/components/top-actions"
import { CompareToggle } from "@/components/compare-toggle"
import { ReasoningSummary } from "@/components/reasoning-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, FileText, TrendingUp, AlertTriangle } from "lucide-react"

interface MeetingAnalysis {
  keyInsights: string[]
  sentiment: "positive" | "negative" | "neutral"
  financialMetrics: {
    revenue: string
    guidance: string
    margins: string
  }
  riskFactors: string[]
  managementTone: string
  actionItems: string[]
}

export default function MeetingsPage() {
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [compareResults, setCompareResults] = useState(null)

  const handleUseSample = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/meetings/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useSample: true }),
      })
      const data = await response.json()
      setAnalysis(data.analysis)

      // Dispatch metrics update
      window.dispatchEvent(
        new CustomEvent("metricsUpdate", {
          detail: {
            mode: data.mode,
            model: data.model,
            latencyMs: data.latencyMs,
            costUsd: data.costUsd,
          },
        }),
      )
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = () => {
    // File upload logic
    console.log("Upload transcript")
  }

  const handleGenerate = () => {
    // Generate new analysis
    console.log("Generate analysis")
  }

  const handleCompare = async (enabled: boolean) => {
    if (enabled) {
      // Run comparison between GPT-4 and GPT-5
      console.log("Running comparison...")
    }
  }

  // Auto-run sample on mount
  useEffect(() => {
    handleUseSample()
  }, [])

  const reasoningSteps = [
    {
      step: 1,
      description: "Analyzed transcript for key financial metrics and guidance",
      assumptions: ["Q4 guidance is forward-looking", "Management tone reflects confidence"],
      citations: ["CEO remarks on revenue growth", "CFO guidance statements"],
    },
    {
      step: 2,
      description: "Extracted sentiment indicators from management language",
      assumptions: ["Positive language correlates with business performance"],
      citations: ["Management Q&A responses", "Prepared remarks tone"],
    },
    {
      step: 3,
      description: "Identified risk factors and mitigation strategies",
      assumptions: ["Disclosed risks are material", "Mitigation plans are actionable"],
      citations: ["Risk factor discussions", "Strategic initiative mentions"],
    },
  ]

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Meetings Analysis</h1>
          <p className="text-slate-600">
            Analyze earnings calls and meeting transcripts for key insights and sentiment
          </p>
        </div>

        <TopActions
          onUseSample={handleUseSample}
          onUpload={handleUpload}
          onGenerate={handleGenerate}
          loading={loading}
        />

        <CompareToggle onCompare={handleCompare} results={compareResults} />

        {analysis && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.keyInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-slate-700">
                      • {insight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.riskFactors.map((risk, index) => (
                    <li key={index} className="text-sm text-slate-700">
                      • {risk}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Revenue:</span>
                    <div className="text-slate-600">{analysis.financialMetrics.revenue}</div>
                  </div>
                  <div>
                    <span className="font-medium">Guidance:</span>
                    <div className="text-slate-600">{analysis.financialMetrics.guidance}</div>
                  </div>
                  <div>
                    <span className="font-medium">Margins:</span>
                    <div className="text-slate-600">{analysis.financialMetrics.margins}</div>
                  </div>
                  <div>
                    <span className="font-medium">Sentiment:</span>
                    <Badge
                      variant={
                        analysis.sentiment === "positive"
                          ? "default"
                          : analysis.sentiment === "negative"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {analysis.sentiment}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Management Tone & Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="font-medium text-sm">Overall Tone:</span>
                  <p className="text-sm text-slate-600 mt-1">{analysis.managementTone}</p>
                </div>
                <div>
                  <span className="font-medium text-sm">Action Items:</span>
                  <ul className="mt-1 space-y-1">
                    {analysis.actionItems.map((item, index) => (
                      <li key={index} className="text-sm text-slate-600">
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {analysis && <ReasoningSummary steps={reasoningSteps} title="Analysis Reasoning" />}

        {analysis && (
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Analysis
            </Button>
            <Button variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  )
}

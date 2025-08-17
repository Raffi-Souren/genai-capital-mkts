"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, BarChart3, Download, AlertTriangle } from "lucide-react"
import { EnhancedAuditPanel } from "@/components/enhanced-audit-panel"
import { useMode } from "@/components/mode-provider"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import AppShell from "@/components/ui/app-shell"
import { ExplainabilityPanel } from "@/components/explainability-panel"
import { PerformanceMetrics } from "@/components/performance-metrics"

export default function SurveillancePage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [performanceData, setPerformanceData] = useState<any>(null)
  const { mode } = useMode()

  const runSurveillance = async () => {
    const startTime = Date.now()
    setLoading(true)
    setPerformanceData({ startTime })

    try {
      const response = await fetch("/api/surveillance/triage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      })

      const data = await response.json()
      const endTime = Date.now()

      if (data.success) {
        setResults(data.data)
        setPerformanceData({
          startTime,
          endTime,
          tokensUsed: data.metadata?.tokens_used,
          costEstimate: data.metadata?.cost_estimate,
          speedImprovement: "40x faster than manual surveillance",
        })
      }
    } catch (error) {
      console.error("Failed to run surveillance:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadSarMemo = (format: "json" | "txt") => {
    if (!results) return
    const content = format === "json" ? JSON.stringify(results.sarMemoJson, null, 2) : results.sarMemoText

    const blob = new Blob([content], {
      type: format === "json" ? "application/json" : "text/plain",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `sar-memo-${new Date().toISOString().split("T")[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  // Mock chart data
  const timeSeriesData = [
    { time: "09:00", count: 12 },
    { time: "10:00", count: 19 },
    { time: "11:00", count: 8 },
    { time: "12:00", count: 15 },
    { time: "13:00", count: 22 },
    { time: "14:00", count: 18 },
    { time: "15:00", count: 25 },
    { time: "16:00", count: 14 },
  ]

  return (
    <AppShell title="Surveillance" showFavorite={true} agentId="surveillance">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Trading Surveillance</h1>
                  <p className="text-muted-foreground">
                    Monitor trading patterns and generate SAR-compliant surveillance reports
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Mode: {mode.toUpperCase()}
                </Badge>
                <Badge variant="secondary">Pattern Detection</Badge>
              </div>
            </div>

            {/* Control Panel */}
            <Card className="card-shadow mb-6">
              <CardHeader>
                <CardTitle>Surveillance Analysis</CardTitle>
                <CardDescription>
                  Analyze trading data for suspicious patterns and generate compliance reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Button onClick={runSurveillance} disabled={loading}>
                    {loading ? "Analyzing..." : "Run Surveillance"}
                  </Button>
                  <div className="text-sm text-muted-foreground">Using sample watchlist and trade data</div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <>
                {/* Performance & Explainability */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  <PerformanceMetrics {...performanceData} />
                  <ExplainabilityPanel
                    reasoning={results.reasoning}
                    confidence={results.confidence}
                    sources={results.sources}
                  />
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="card-shadow">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">{results.metrics.self_match_pct}%</div>
                        <div className="text-sm text-muted-foreground">Self-Match Rate</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="card-shadow">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-600">
                          {results.metrics.round_trip_avg_secs?.toFixed(1) || "N/A"}s
                        </div>
                        <div className="text-sm text-muted-foreground">Avg Round-Trip</div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="card-shadow">
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary">{results.metrics.top_accounts.length}</div>
                        <div className="text-sm text-muted-foreground">Flagged Accounts</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <Card className="card-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Trade Count Over Time
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={timeSeriesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="count" stroke="#0047AB" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="card-shadow">
                    <CardHeader>
                      <CardTitle>Account Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={results.metrics.top_accounts.slice(0, 5)}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="account_id" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="flip_count" fill="#4A90E2" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* SAR Memo */}
                <Tabs defaultValue="memo-text" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="memo-text">SAR Memo</TabsTrigger>
                    <TabsTrigger value="memo-json">JSON Data</TabsTrigger>
                  </TabsList>

                  <TabsContent value="memo-text" className="space-y-4">
                    <Card className="card-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Suspicious Activity Report
                          </CardTitle>
                          <Button variant="outline" size="sm" onClick={() => downloadSarMemo("txt")}>
                            <Download className="h-4 w-4 mr-2" />
                            Download TXT
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed">{results.sarMemoText}</pre>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="memo-json" className="space-y-4">
                    <Card className="card-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Structured SAR Data</CardTitle>
                          <Button variant="outline" size="sm" onClick={() => downloadSarMemo("json")}>
                            <Download className="h-4 w-4 mr-2" />
                            Download JSON
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <pre className="text-xs leading-relaxed overflow-x-auto">
                            {JSON.stringify(results.sarMemoJson, null, 2)}
                          </pre>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>

          <div className="lg:col-span-1">
            <EnhancedAuditPanel className="sticky top-8" maxHeight="h-96" />
          </div>
        </div>
      </div>
    </AppShell>
  )
}

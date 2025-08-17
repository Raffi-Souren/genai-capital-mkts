"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Download } from "lucide-react"
import { EnhancedAuditPanel } from "@/components/enhanced-audit-panel"
import { useMode } from "@/components/mode-provider"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import AppShell from "@/components/ui/app-shell"

export default function RegimePage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { mode } = useMode()

  const analyzeRegime = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/regime/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      })

      const data = await response.json()
      if (data.success) {
        setResults(data.data)
      }
    } catch (error) {
      console.error("Failed to analyze regime:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadHedges = () => {
    if (!results) return
    const content = JSON.stringify(
      {
        current_regime: results.currentRegime,
        hedge_recommendations: results.hedges,
        analysis_date: new Date().toISOString(),
      },
      null,
      2,
    )

    const blob = new Blob([content], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `hedge-recommendations-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const getRegimeColor = (regime: string) => {
    return regime === "Risk-On"
      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
  }

  return (
    <AppShell title="Regime & Hedge" showFavorite={true} agentId="regime">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Regime Detection & Hedging</h1>
                  <p className="text-muted-foreground">
                    Detect market regime changes and generate hedge recommendations by desk
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Mode: {mode.toUpperCase()}
                </Badge>
                <Badge variant="secondary">Regime Analysis</Badge>
              </div>
            </div>

            {/* Control Panel */}
            <Card className="card-shadow mb-6">
              <CardHeader>
                <CardTitle>Market Regime Analysis</CardTitle>
                <CardDescription>Analyze market conditions and generate hedge strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Button onClick={analyzeRegime} disabled={loading}>
                    {loading ? "Analyzing..." : "Analyze Market Regime"}
                  </Button>
                  <div className="text-sm text-muted-foreground">Using sample regime detection data</div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {results && (
              <>
                {/* Current Regime */}
                <Card className="card-shadow mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Current Market Regime</CardTitle>
                      <Badge className={getRegimeColor(results.currentRegime)} variant="outline">
                        {results.currentRegime}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <div className="text-4xl font-bold mb-2">{results.currentRegime}</div>
                      <div className="text-muted-foreground">Based on correlation and volatility analysis</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline Chart */}
                <Card className="card-shadow mb-6">
                  <CardHeader>
                    <CardTitle>Regime Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={results.timeline.slice(-20)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="confidence" stroke="#0047AB" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Change Points */}
                <Card className="card-shadow mb-6">
                  <CardHeader>
                    <CardTitle>Recent Regime Changes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.changes.slice(-5).map((change: any, index: number) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <div className="font-medium">
                              {change.from_regime} → {change.to_regime}
                            </div>
                            <div className="text-sm text-muted-foreground">{change.date}</div>
                          </div>
                          <Badge variant="outline">{(change.significance * 100).toFixed(0)}% significance</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Hedge Recommendations */}
                <Card className="card-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Hedge Recommendations by Desk</CardTitle>
                      <Button variant="outline" size="sm" onClick={downloadHedges}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Hedges
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {results.hedges.map((hedge: any, index: number) => (
                        <Card key={index} className="border-l-4 border-l-primary">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">{hedge.desk}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Recommendation</div>
                                <div className="text-sm">{hedge.recommendation}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-muted-foreground mb-1">Rationale</div>
                                <div className="text-sm text-muted-foreground">{hedge.rationale}</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
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

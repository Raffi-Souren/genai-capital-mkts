"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield } from "lucide-react"
import { EnhancedAuditPanel } from "@/components/enhanced-audit-panel"
import { useMode } from "@/components/mode-provider"
import AppShell from "@/components/ui/app-shell"

export default function CreditRiskPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { mode } = useMode()

  const runAnalysis = async () => {
    setLoading(true)
    const startTime = Date.now()

    try {
      // Simulate API call with realistic timing
      await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000))

      const analysisResults = {
        creditScore: 742,
        riskLevel: "Medium",
        fraudProbability: 0.12,
        recommendations: [
          "Verify employment history",
          "Request additional income documentation",
          "Monitor for unusual transaction patterns",
        ],
      }

      const latencyMs = Date.now() - startTime

      window.dispatchEvent(
        new CustomEvent("metricsUpdate", {
          detail: {
            mode: mode.toUpperCase(),
            model: "Risk-ML-v2",
            latencyMs,
            costUsd: 0.0008,
          },
        }),
      )

      setResults(analysisResults)

      console.log("[v0] Credit risk analysis completed, dispatching audit event")
    } catch (error) {
      console.error("Credit risk analysis failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell title="Credit & Fraud Risk" showFavorite={true} agentId="credit-risk">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Credit & Fraud Risk Assessment</h1>
                <p className="text-muted-foreground">
                  Automated credit scoring and fraud detection with evaluation metrics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Credit Scoring</Badge>
              <Badge variant="secondary">Fraud Detection</Badge>
            </div>
          </div>

          <Card className="card-shadow mb-6">
            <CardHeader>
              <CardTitle>Risk Analysis</CardTitle>
              <CardDescription>Analyze credit worthiness and fraud risk factors</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={runAnalysis} disabled={loading}>
                {loading ? "Analyzing..." : "Run Risk Assessment"}
              </Button>
            </CardContent>
          </Card>

          {results && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="card-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{results.creditScore}</div>
                    <div className="text-sm text-muted-foreground">Credit Score</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{results.riskLevel}</div>
                    <div className="text-sm text-muted-foreground">Risk Level</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-shadow">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {(results.fraudProbability * 100).toFixed(1)}%
                    </div>
                    <div className="text-sm text-muted-foreground">Fraud Risk</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <EnhancedAuditPanel className="sticky top-8" maxHeight="h-96" />
        </div>
      </div>
    </AppShell>
  )
}

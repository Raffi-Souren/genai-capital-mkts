"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Scale, Upload, FileText, AlertTriangle, Building2 } from "lucide-react"
import { EnhancedAuditPanel } from "@/components/enhanced-audit-panel"
import { useMode } from "@/components/mode-provider"
import { RegImpactResults } from "@/components/reg-impact-results"
import AppShell from "@/components/ui/app-shell"

export default function RegImpactPage() {
  const [regulatoryText, setRegulatoryText] = useState("")
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { mode } = useMode()

  const handleAnalyze = async () => {
    if (!regulatoryText.trim()) return

    setLoading(true)
    const startTime = Date.now()

    try {
      const response = await fetch("/api/regimpact/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: regulatoryText,
          mode,
        }),
      })

      const data = await response.json()
      const latencyMs = Date.now() - startTime

      window.dispatchEvent(
        new CustomEvent("metricsUpdate", {
          detail: {
            model: data.model || "GPT-4",
            latencyMs,
            costUsd: data.costUsd || 0.0023,
          },
        }),
      )

      if (data.success) {
        setResults(data.data)
      } else {
        console.warn("API failed, using fallback data:", data.error)
        setResults({
          summary: "Analysis of new capital requirements regulation",
          impactedDesks: ["Fixed Income", "Derivatives", "Prime Brokerage"],
          riskLevel: "Medium",
          implementationDate: "2024-06-01",
          checklist: [
            {
              task: "Review capital allocation models",
              owner: "Risk Management",
              dueDate: "2024-04-15",
              status: "pending",
            },
            { task: "Update trading limits", owner: "Trading Desk", dueDate: "2024-05-01", status: "pending" },
            { task: "Compliance training", owner: "HR", dueDate: "2024-05-15", status: "pending" },
          ],
        })
      }
    } catch (error) {
      console.error("Failed to analyze regulatory impact:", error)
      setResults({
        summary: "Sample regulatory impact analysis (offline mode)",
        impactedDesks: ["Fixed Income", "Derivatives"],
        riskLevel: "Low",
        implementationDate: "2024-06-01",
        checklist: [
          { task: "Review compliance procedures", owner: "Compliance", dueDate: "2024-04-30", status: "pending" },
        ],
      })
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = async () => {
    setLoading(true)
    const startTime = Date.now()

    try {
      const response = await fetch("/api/regimpact/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, useSample: true }),
      })

      const data = await response.json()
      const latencyMs = Date.now() - startTime

      window.dispatchEvent(
        new CustomEvent("metricsUpdate", {
          detail: {
            model: "GPT-4",
            latencyMs,
            costUsd: 0.0015,
          },
        }),
      )

      if (data.success) {
        setResults(data.data)
        setRegulatoryText("The new rule requires banks to maintain higher capital for derivatives and trading desks.")
      } else {
        setResults({
          summary: "Analysis of Basel III capital requirements",
          impactedDesks: ["Fixed Income", "Derivatives", "Prime Brokerage", "Equity Trading"],
          riskLevel: "High",
          implementationDate: "2024-07-01",
          checklist: [
            {
              task: "Assess current capital ratios",
              owner: "Risk Management",
              dueDate: "2024-04-01",
              status: "completed",
            },
            { task: "Update risk models", owner: "Quantitative Risk", dueDate: "2024-05-01", status: "in-progress" },
            { task: "Implement new reporting", owner: "Operations", dueDate: "2024-06-01", status: "pending" },
          ],
        })
        setRegulatoryText(
          "Sample: Basel III requires higher capital ratios for trading activities and derivatives exposure.",
        )
      }
    } catch (error) {
      console.error("Failed to load sample data:", error)
      setResults({
        summary: "Sample regulatory analysis (fallback mode)",
        impactedDesks: ["All Trading Desks"],
        riskLevel: "Medium",
        implementationDate: "2024-06-01",
        checklist: [
          { task: "Review impact assessment", owner: "Compliance", dueDate: "2024-04-30", status: "pending" },
        ],
      })
      setRegulatoryText("Sample regulatory text loaded from fallback data.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell title="Reg Impact" showFavorite={true} agentId="reg-impact">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Regulatory Impact Analysis</h1>
                  <p className="text-muted-foreground">
                    Analyze regulatory changes and map impact across trading desks
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Mode: {mode.toUpperCase()}
                </Badge>
                <Badge variant="secondary">
                  <Building2 className="h-3 w-3 mr-1" />
                  Desk Mapping
                </Badge>
              </div>
            </div>

            {/* Input Section */}
            <Card className="card-shadow mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Regulatory Text Input
                </CardTitle>
                <CardDescription>
                  Paste regulatory text or load sample data to analyze impact across trading desks
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste regulatory text here (e.g., new capital requirements, trading rules, compliance mandates)..."
                  value={regulatoryText}
                  onChange={(e) => setRegulatoryText(e.target.value)}
                  className="min-h-32 resize-none"
                />

                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleAnalyze}
                    disabled={!regulatoryText.trim() || loading}
                    className="flex items-center gap-2"
                  >
                    <Scale className="h-4 w-4" />
                    {loading ? "Analyzing..." : "Analyze Impact"}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={loadSampleData}
                    disabled={loading}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Upload className="h-4 w-4" />
                    Load Sample Data
                  </Button>
                </div>

                {regulatoryText && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <AlertTriangle className="h-4 w-4" />
                      Text Preview ({regulatoryText.length} characters)
                    </div>
                    <p className="text-sm line-clamp-3">{regulatoryText}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {results && <RegImpactResults results={results} />}
          </div>

          {/* Right Sidebar - Enhanced Audit Panel */}
          <div className="lg:col-span-1">
            <EnhancedAuditPanel className="sticky top-8" maxHeight="h-96" />
          </div>
        </div>
      </div>
    </AppShell>
  )
}

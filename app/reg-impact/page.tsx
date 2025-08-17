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
      if (data.success) {
        setResults(data.data)
      }
    } catch (error) {
      console.error("Failed to analyze regulatory impact:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadSampleData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/regimpact/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      })

      const data = await response.json()
      if (data.success) {
        setResults(data.data)
        setRegulatoryText("Sample regulatory text loaded from reg_impact_sample.json")
      }
    } catch (error) {
      console.error("Failed to load sample data:", error)
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

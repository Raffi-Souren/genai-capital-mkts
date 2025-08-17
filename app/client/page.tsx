"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, MessageSquare, RefreshCw } from "lucide-react"
import { EnhancedAuditPanel } from "@/components/enhanced-audit-panel"
import { useMode } from "@/components/mode-provider"
import { ClientBriefResults } from "@/components/client-brief-results"
import AppShell from "@/components/ui/app-shell"

export default function ClientBriefPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const { mode } = useMode()

  const generateBrief = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/client/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      })

      const data = await response.json()
      if (data.success) {
        setResults(data.data)
      }
    } catch (error) {
      console.error("Failed to generate client brief:", error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-load on mount
  useEffect(() => {
    generateBrief()
  }, [mode])

  return (
    <AppShell title="Client Brief" showFavorite={true} agentId="client">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Client Brief Generator</h1>
                  <p className="text-muted-foreground">
                    Generate meeting briefs and talking points for client interactions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="font-mono">
                  Mode: {mode.toUpperCase()}
                </Badge>
                <Badge variant="secondary">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Meeting Prep
                </Badge>
              </div>
            </div>

            {/* Control Section */}
            <Card className="card-shadow mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Brief Generation
                </CardTitle>
                <CardDescription>
                  Generate comprehensive meeting materials based on client data and relationship history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Button onClick={generateBrief} disabled={loading} className="flex items-center gap-2">
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                    {loading ? "Generating..." : "Generate New Brief"}
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    Using sample client data from client_brief_sample.json
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Section */}
            {results && <ClientBriefResults results={results} />}
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

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload, Download, Copy, CheckCircle2 } from "lucide-react"
import { EnhancedAuditPanel } from "@/components/enhanced-audit-panel"
import { useMode } from "@/components/mode-provider"
import AppShell from "@/components/ui/app-shell"

export default function ResearchPage() {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const { mode } = useMode()

  const generateResearch = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/research/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode }),
      })

      const data = await response.json()
      if (data.success) {
        setResults(data.data)
      }
    } catch (error) {
      console.error("Failed to generate research:", error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemId)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  const downloadMarkdown = () => {
    if (!results) return
    const blob = new Blob([results.markdown], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `research-note-${new Date().toISOString().split("T")[0]}.md`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const downloadJSON = () => {
    if (!results) return
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `research-data-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <AppShell title="Research Note" showFavorite={true} agentId="research">
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Research Note Generator</h1>
                    <p className="text-muted-foreground">
                      Generate institutional-grade research notes from 8-K filings and quarterly reports
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    Mode: {mode.toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">PDF Analysis</Badge>
                </div>
              </div>

              {/* Upload Section */}
              <Card className="card-shadow mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Document Upload
                  </CardTitle>
                  <CardDescription>Upload 8-K filings, quarterly reports, and optional style guide</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">Drag and drop PDFs here, or click to browse</p>
                    <Button variant="outline" className="bg-transparent">
                      Browse Files
                    </Button>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button onClick={generateResearch} disabled={loading}>
                      {loading ? "Generating..." : "Generate Research Note"}
                    </Button>
                    <div className="text-sm text-muted-foreground">Using sample data in {mode} mode</div>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              {results && (
                <Tabs defaultValue="note" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="note">Research Note</TabsTrigger>
                    <TabsTrigger value="brief">Trader Brief</TabsTrigger>
                    <TabsTrigger value="citations">Citations</TabsTrigger>
                    <TabsTrigger value="redlines">Redlines</TabsTrigger>
                  </TabsList>

                  <TabsContent value="note" className="space-y-4">
                    <Card className="card-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Investment Research Note</CardTitle>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(results.markdown, "note")}
                            >
                              {copiedItem === "note" ? (
                                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4 mr-2" />
                              )}
                              Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={downloadMarkdown}>
                              <Download className="h-4 w-4 mr-2" />
                              Download MD
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <div className="whitespace-pre-wrap">{results.markdown}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="brief" className="space-y-4">
                    <Card className="card-shadow">
                      <CardHeader>
                        <CardTitle>150-Word Trader Brief</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm leading-relaxed">{results.brief150}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="citations" className="space-y-4">
                    <Card className="card-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Citations & References</CardTitle>
                          <Button variant="outline" size="sm" onClick={downloadJSON}>
                            <Download className="h-4 w-4 mr-2" />
                            Download JSON
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {results.citations.map((citation: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <div className="font-medium">{citation.source}</div>
                                <div className="text-sm text-muted-foreground">
                                  Page {citation.page} {citation.section && `• ${citation.section}`}
                                </div>
                              </div>
                              <Badge variant="outline">Ref {index + 1}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="redlines" className="space-y-4">
                    <Card className="card-shadow">
                      <CardHeader>
                        <CardTitle>Guidance Redlines</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {results.redlines?.map((redline: string, index: number) => (
                            <div
                              key={index}
                              className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border-l-4 border-l-yellow-500"
                            >
                              <p className="text-sm">{redline}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              )}
            </div>

            <div className="lg:col-span-1">
              <EnhancedAuditPanel className="sticky top-8" maxHeight="h-96" />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

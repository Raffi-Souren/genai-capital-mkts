"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, MessageSquare, TrendingUp, Download, Copy, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface ClientBriefResultsProps {
  results: {
    brief: string
    talkingPoints: string[]
    crossSell: string[]
  }
}

export function ClientBriefResults({ results }: ClientBriefResultsProps) {
  const [copiedItem, setCopiedItem] = useState<string | null>(null)

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedItem(itemId)
      setTimeout(() => setCopiedItem(null), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  const downloadBrief = (format: "md" | "txt") => {
    const content = generateDownloadContent(format)
    const blob = new Blob([content], { type: format === "md" ? "text/markdown" : "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `client-brief-${new Date().toISOString().split("T")[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const generateDownloadContent = (format: "md" | "txt") => {
    const isMarkdown = format === "md"
    const h1 = isMarkdown ? "# " : ""
    const h2 = isMarkdown ? "## " : ""
    const bullet = isMarkdown ? "- " : "• "
    const divider = isMarkdown ? "\n---\n" : "\n" + "=".repeat(50) + "\n"

    return `${h1}Client Meeting Brief
Generated: ${new Date().toLocaleDateString()}

${h2}Meeting Overview
${results.brief}

${divider}

${h2}Key Talking Points
${results.talkingPoints.map((point, index) => `${index + 1}. ${point}`).join("\n")}

${divider}

${h2}Cross-Sell Opportunities
${results.crossSell.map((opportunity, index) => `${bullet}${opportunity}`).join("\n")}

${divider}

${h2}One-Slide Outline

**Objective**: Strengthen client relationship and explore growth opportunities

**Key Messages**:
${results.talkingPoints
  .slice(0, 3)
  .map((point) => `${bullet}${point.split(":")[0]}`)
  .join("\n")}

**Action Items**:
${bullet}Review portfolio performance and market outlook
${bullet}Discuss risk management and optimization strategies
${bullet}Present cross-sell opportunities and next steps

**Follow-up**: Schedule quarterly review and document client feedback

---
*This brief was generated using AI-powered analysis of client data and market conditions.*`
  }

  const generateOneSlideOutline = () => {
    return `# Client Meeting - One-Slide Outline

## Meeting Objective
Strengthen relationship and explore growth opportunities

## Key Discussion Points
${results.talkingPoints
  .slice(0, 3)
  .map((point, index) => `${index + 1}. ${point.split(":")[0]}`)
  .join("\n")}

## Cross-Sell Focus
${results.crossSell.map((opportunity) => `• ${opportunity.split(":")[0]}`).join("\n")}

## Expected Outcomes
• Portfolio optimization recommendations
• Enhanced service delivery plan
• Next steps for relationship growth`
  }

  return (
    <div className="space-y-6">
      {/* Brief Overview */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Meeting Brief
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => copyToClipboard(results.brief, "brief")}>
                {copiedItem === "brief" ? (
                  <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4 mr-2" />
                )}
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={() => downloadBrief("md")}>
                <Download className="h-4 w-4 mr-2" />
                Download MD
              </Button>
            </div>
          </div>
          <CardDescription>{results.brief.split(" ").length} words • Comprehensive meeting preparation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{results.brief}</div>
          </div>
        </CardContent>
      </Card>

      {/* Talking Points and Cross-Sell */}
      <Tabs defaultValue="talking-points" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="talking-points">Talking Points</TabsTrigger>
          <TabsTrigger value="cross-sell">Cross-Sell</TabsTrigger>
          <TabsTrigger value="outline">One-Slide</TabsTrigger>
        </TabsList>

        <TabsContent value="talking-points" className="space-y-4">
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Key Talking Points
                </CardTitle>
                <Badge variant="outline">{results.talkingPoints.length} Points</Badge>
              </div>
              <CardDescription>Strategic discussion topics for the client meeting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.talkingPoints.map((point, index) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs">
                              Point {index + 1}
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed">{point}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(point, `point-${index}`)}
                          className="flex-shrink-0"
                        >
                          {copiedItem === `point-${index}` ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cross-sell" className="space-y-4">
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Cross-Sell Opportunities
                </CardTitle>
                <Badge variant="outline">{results.crossSell.length} Opportunities</Badge>
              </div>
              <CardDescription>Revenue growth opportunities to discuss with the client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.crossSell.map((opportunity, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="secondary"
                              className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            >
                              Opportunity {index + 1}
                            </Badge>
                          </div>
                          <p className="text-sm leading-relaxed">{opportunity}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(opportunity, `crosssell-${index}`)}
                          className="flex-shrink-0"
                        >
                          {copiedItem === `crosssell-${index}` ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="outline" className="space-y-4">
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  One-Slide Meeting Outline
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generateOneSlideOutline(), "outline")}
                  >
                    {copiedItem === "outline" ? (
                      <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadBrief("txt")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export TXT
                  </Button>
                </div>
              </div>
              <CardDescription>Concise meeting structure for presentation slides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-6">
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed font-mono">
                    {generateOneSlideOutline()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options */}
      <Card className="card-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Options
          </CardTitle>
          <CardDescription>Download meeting materials in different formats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Button onClick={() => downloadBrief("md")} className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Download Markdown
            </Button>
            <Button
              variant="outline"
              onClick={() => downloadBrief("txt")}
              className="flex items-center gap-2 bg-transparent"
            >
              <FileText className="h-4 w-4" />
              Download Text
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

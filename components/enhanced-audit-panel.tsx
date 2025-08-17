"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Activity, Download, RefreshCw, Clock, Navigation } from "lucide-react"
import type { AuditLogType } from "@/lib/schemas"

interface AuditPanelProps {
  className?: string
  maxHeight?: string
}

export function EnhancedAuditPanel({ className, maxHeight = "h-96" }: AuditPanelProps) {
  const [logs, setLogs] = useState<AuditLogType[]>([])
  const [loading, setLoading] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/audit?limit=20")
      const data = await response.json()
      if (data.success) {
        setLogs(data.data)
        setLastRefresh(new Date())
      }
    } catch (error) {
      console.error("Failed to fetch audit logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const downloadLogs = async () => {
    try {
      const response = await fetch("/api/audit/export", { method: "POST" })
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `audit-log-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Failed to download audit logs:", error)
    }
  }

  useEffect(() => {
    fetchLogs()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchLogs, 30000)
    return () => clearInterval(interval)
  }, [])

  const getRouteColor = (route: string) => {
    if (route.includes("research")) return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    if (route.includes("surveillance")) return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    if (route.includes("regime")) return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    if (route.includes("regimpact")) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    if (route.includes("client")) return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <Card className={`card-shadow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Audit Trail</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={fetchLogs} disabled={loading} className="h-8 w-8 p-0">
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={downloadLogs} className="h-8 w-8 p-0">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          Last updated: {formatTime(lastRefresh.toISOString())}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className={maxHeight}>
          <div className="space-y-3">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No audit logs yet</p>
                <p className="text-xs">Activity will appear here</p>
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className={`text-xs font-mono ${getRouteColor(log.route)}`}>
                          <Navigation className="h-3 w-3 mr-1" />
                          {log.route.replace("/api/", "")}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-mono">{formatTime(log.atISO)}</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <div className="text-foreground">
                          <span className="font-medium">Input:</span> {log.inputsSummary}
                        </div>
                        <div className="text-muted-foreground">
                          <span className="font-medium">Output:</span> {log.outputsSummary}
                        </div>
                      </div>
                    </div>
                  </div>
                  {index < logs.length - 1 && <Separator className="my-3" />}
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {logs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing {logs.length} recent entries</span>
              <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={downloadLogs}>
                Export All
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

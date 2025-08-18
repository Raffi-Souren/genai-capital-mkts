"use client"

import { Component, type ReactNode } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[v0] Error boundary caught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Card className="card-shadow max-w-md mx-auto mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Something went wrong
              </CardTitle>
              <CardDescription>
                An error occurred while loading this page. Please try refreshing or contact support if the problem
                persists.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.reload()} className="flex items-center gap-2" variant="outline">
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </Button>
              {process.env.NODE_ENV === "development" && (
                <details className="mt-4">
                  <summary className="text-sm text-muted-foreground cursor-pointer">Error Details</summary>
                  <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto">{this.state.error?.stack}</pre>
                </details>
              )}
            </CardContent>
          </Card>
        )
      )
    }

    return this.props.children
  }
}

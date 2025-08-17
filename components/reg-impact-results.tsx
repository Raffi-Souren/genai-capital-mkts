"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Building2, CheckCircle2, AlertTriangle, DollarSign, TrendingUp, Download, Calendar, User } from "lucide-react"

interface RegImpactResultsProps {
  results: {
    impactedDesks: Array<{
      desk: string
      impact_level: string
      description: string
    }>
    checklist: Array<{
      task: string
      owner: string
      due_date: string
      status: string
      priority: string
    }>
    template: {
      before: any
      after: any
      impact_summary: any
      assumptions: string[]
    }
  }
}

export function RegImpactResults({ results }: RegImpactResultsProps) {
  const [checklist, setChecklist] = useState(results.checklist)

  const updateDueDate = (index: number, newDate: string) => {
    const updated = [...checklist]
    updated[index].due_date = newDate
    setChecklist(updated)
  }

  const toggleTaskStatus = (index: number) => {
    const updated = [...checklist]
    updated[index].status = updated[index].status === "completed" ? "pending" : "completed"
    setChecklist(updated)
  }

  const getImpactColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const completedTasks = checklist.filter((task) => task.status === "completed").length
  const progressPercentage = (completedTasks / checklist.length) * 100

  const downloadResults = () => {
    const exportData = {
      analysis_date: new Date().toISOString(),
      impacted_desks: results.impactedDesks,
      implementation_checklist: checklist,
      capital_impact: results.template,
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `regulatory-impact-analysis-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Impacted Trading Desks
            </CardTitle>
            <Button variant="outline" size="sm" onClick={downloadResults}>
              <Download className="h-4 w-4 mr-2" />
              Export Analysis
            </Button>
          </div>
          <CardDescription>
            {results.impactedDesks.length} trading desks affected by this regulatory change
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.impactedDesks.map((desk, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{desk.desk}</h4>
                      <Badge className={getImpactColor(desk.impact_level)}>{desk.impact_level}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{desk.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Implementation Tabs */}
      <Tabs defaultValue="checklist" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="checklist">Implementation Checklist</TabsTrigger>
          <TabsTrigger value="capital">Capital Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="space-y-4">
          <Card className="card-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Implementation Progress
                </CardTitle>
                <Badge variant="outline">
                  {completedTasks}/{checklist.length} Complete
                </Badge>
              </div>
              <CardDescription>Track implementation tasks with editable due dates and ownership</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Overall Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>

                <div className="space-y-3">
                  {checklist.map((task, index) => (
                    <Card
                      key={index}
                      className={`border ${task.status === "completed" ? "bg-green-50 dark:bg-green-950" : ""}`}
                    >
                      <CardContent className="pt-4">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 mt-1"
                              onClick={() => toggleTaskStatus(index)}
                            >
                              <CheckCircle2
                                className={`h-4 w-4 ${
                                  task.status === "completed"
                                    ? "text-green-600 fill-green-100"
                                    : "text-muted-foreground"
                                }`}
                              />
                            </Button>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between">
                                <h4
                                  className={`font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                                >
                                  {task.task}
                                </h4>
                                <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <Label htmlFor={`owner-${index}`} className="text-xs text-muted-foreground">
                                    <User className="h-3 w-3 inline mr-1" />
                                    Owner
                                  </Label>
                                  <div className="text-sm font-medium">{task.owner}</div>
                                </div>

                                <div className="space-y-1">
                                  <Label htmlFor={`due-${index}`} className="text-xs text-muted-foreground">
                                    <Calendar className="h-3 w-3 inline mr-1" />
                                    Due Date
                                  </Label>
                                  <Input
                                    id={`due-${index}`}
                                    type="date"
                                    value={task.due_date}
                                    onChange={(e) => updateDueDate(index, e.target.value)}
                                    className="h-8 text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capital" className="space-y-4">
          <Card className="card-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Capital Impact Analysis
              </CardTitle>
              <CardDescription>Before and after capital requirements with implementation costs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Before/After Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-blue-700 dark:text-blue-300">Before</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tier 1 Capital</span>
                        <span className="font-mono">{formatCurrency(results.template.before.tier1_capital)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tier 2 Capital</span>
                        <span className="font-mono">{formatCurrency(results.template.before.tier2_capital)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Risk Weighted Assets</span>
                        <span className="font-mono">
                          {formatCurrency(results.template.before.risk_weighted_assets)}
                        </span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium">Capital Ratio</span>
                        <span className="font-mono font-bold">{results.template.before.capital_ratio}%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-green-700 dark:text-green-300">After</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tier 1 Capital</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{formatCurrency(results.template.after.tier1_capital)}</span>
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tier 2 Capital</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">{formatCurrency(results.template.after.tier2_capital)}</span>
                          <TrendingUp className="h-3 w-3 text-green-600" />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Risk Weighted Assets</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono">
                            {formatCurrency(results.template.after.risk_weighted_assets)}
                          </span>
                          <TrendingUp className="h-3 w-3 text-red-600" />
                        </div>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium">Capital Ratio</span>
                        <span className="font-mono font-bold">{results.template.after.capital_ratio}%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Impact Summary */}
                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Implementation Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(results.template.impact_summary.additional_capital_required)}
                        </div>
                        <div className="text-sm text-muted-foreground">Additional Capital</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {formatCurrency(results.template.impact_summary.implementation_cost)}
                        </div>
                        <div className="text-sm text-muted-foreground">Implementation Cost</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                          {formatCurrency(results.template.impact_summary.ongoing_compliance_cost)}
                        </div>
                        <div className="text-sm text-muted-foreground">Annual Compliance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {results.template.impact_summary.timeline_months}
                        </div>
                        <div className="text-sm text-muted-foreground">Months Timeline</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Assumptions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Key Assumptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.template.assumptions.map((assumption, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <span>{assumption}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

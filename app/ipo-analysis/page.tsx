import { AppShell } from "@/components/ui/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, TrendingUp, Users } from "lucide-react"

export default function IPOAnalysisPage() {
  return (
    <AppShell title="IPO Analysis" breadcrumbs={[{ label: "IPO Analysis", href: "/ipo-analysis" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">IPO Analysis</h1>
            <p className="text-gray-600 mt-1">Analyze S-1 filings and IPO readiness assessments</p>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Coming Soon
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              IPO Analysis Features
            </CardTitle>
            <CardDescription>
              Comprehensive IPO analysis and S-1 filing review functionality will be available soon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">S-1 Analysis</h3>
                <p className="text-sm text-gray-600">Automated review of IPO registration statements</p>
              </div>
              <div className="p-4 border rounded-lg">
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-medium">Valuation Assessment</h3>
                <p className="text-sm text-gray-600">IPO pricing analysis and market comparisons</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Users className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-medium">Market Readiness</h3>
                <p className="text-sm text-gray-600">Assessment of market conditions and timing</p>
              </div>
            </div>
            <Button disabled className="w-full">
              Launch Analysis (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}

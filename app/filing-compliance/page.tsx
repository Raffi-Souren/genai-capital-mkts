import { AppShell } from "@/components/ui/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, CheckCircle, AlertTriangle } from "lucide-react"

export default function FilingCompliancePage() {
  return (
    <AppShell title="Filing Compliance" breadcrumbs={[{ label: "Filing Compliance", href: "/filing-compliance" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Filing Compliance</h1>
            <p className="text-gray-600 mt-1">Automated review of 10-K, 10-Q, and other regulatory filings</p>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Coming Soon
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Filing Compliance Features
            </CardTitle>
            <CardDescription>
              Advanced filing compliance and accuracy evaluation functionality will be available soon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">Filing Analysis</h3>
                <p className="text-sm text-gray-600">Automated review of 10-K, 10-Q, and S-1 filings</p>
              </div>
              <div className="p-4 border rounded-lg">
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-medium">Accuracy Metrics</h3>
                <p className="text-sm text-gray-600">Evaluation metrics for compliance and accuracy</p>
              </div>
              <div className="p-4 border rounded-lg">
                <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
                <h3 className="font-medium">Risk Detection</h3>
                <p className="text-sm text-gray-600">Identify potential compliance issues and risks</p>
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

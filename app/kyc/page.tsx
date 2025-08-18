import { AppShell } from "@/components/ui/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, FileCheck } from "lucide-react"

export default function KYCPage() {
  return (
    <AppShell title="KYC & Due Diligence" breadcrumbs={[{ label: "KYC & Due Diligence", href: "/kyc" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">KYC & Due Diligence</h1>
            <p className="text-gray-600 mt-1">Automated know-your-customer and due diligence workflows</p>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Coming Soon
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              KYC & Due Diligence Features
            </CardTitle>
            <CardDescription>
              Advanced KYC and due diligence automation functionality will be available soon
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">Identity Verification</h3>
                <p className="text-sm text-gray-600">Automated customer identity and background checks</p>
              </div>
              <div className="p-4 border rounded-lg">
                <Search className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-medium">Risk Assessment</h3>
                <p className="text-sm text-gray-600">Geopolitical and socio-economic risk analysis</p>
              </div>
              <div className="p-4 border rounded-lg">
                <FileCheck className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-medium">Compliance Checks</h3>
                <p className="text-sm text-gray-600">Regulatory compliance and sanctions screening</p>
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

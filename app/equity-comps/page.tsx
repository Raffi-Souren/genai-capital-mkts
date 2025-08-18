import { AppShell } from "@/components/ui/app-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Building2, DollarSign } from "lucide-react"

export default function EquityCompsPage() {
  return (
    <AppShell title="Equity Comparables Analysis" breadcrumbs={[{ label: "Equity Comps", href: "/equity-comps" }]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Equity Comparables Analysis</h1>
            <p className="text-gray-600 mt-1">Analyze comparable equity instruments and valuations across markets</p>
          </div>
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Coming Soon
          </Badge>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Equity Analysis Features
            </CardTitle>
            <CardDescription>Advanced equity comparables analysis functionality will be available soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <Building2 className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium">Peer Analysis</h3>
                <p className="text-sm text-gray-600">Compare valuation metrics across industry peers</p>
              </div>
              <div className="p-4 border rounded-lg">
                <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                <h3 className="font-medium">Valuation Models</h3>
                <p className="text-sm text-gray-600">DCF, multiples, and precedent transaction analysis</p>
              </div>
              <div className="p-4 border rounded-lg">
                <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
                <h3 className="font-medium">Market Trends</h3>
                <p className="text-sm text-gray-600">Sector performance and trading patterns</p>
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

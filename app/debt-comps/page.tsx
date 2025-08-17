"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import { EnhancedAuditPanel } from "@/components/enhanced-audit-panel"
import AppShell from "@/components/ui/app-shell"

export default function DebtCompsPage() {
  return (
    <AppShell title="Debt Comps" showFavorite={true} agentId="debt-comps">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Debt Comparables Analysis</h1>
                <p className="text-muted-foreground">Analyze comparable debt instruments and pricing across markets</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">Credit Analysis</Badge>
              <Badge variant="secondary">Yield Curves</Badge>
            </div>
          </div>

          <Card className="card-shadow">
            <CardHeader>
              <CardTitle>Coming Soon</CardTitle>
              <CardDescription>Debt comparables analysis functionality will be available soon</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled>Launch Analysis</Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <EnhancedAuditPanel className="sticky top-8" maxHeight="h-96" />
        </div>
      </div>
    </AppShell>
  )
}

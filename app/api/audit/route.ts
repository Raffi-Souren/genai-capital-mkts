import { type NextRequest, NextResponse } from "next/server"
import { auditStore } from "@/lib/audit-store"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const logs = limit > 0 ? auditStore.getRecentLogs(limit) : auditStore.getLogs()

    return NextResponse.json({
      success: true,
      data: logs,
      total: auditStore.getLogs().length,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve audit logs" }, { status: 500 })
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { auditStore } from "@/lib/audit-store"

export async function POST(request: NextRequest) {
  try {
    const logs = auditStore.getLogs()

    const exportData = {
      exported_at: new Date().toISOString(),
      total_entries: logs.length,
      logs: logs,
    }

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="audit-log-${new Date().toISOString().split("T")[0]}.json"`,
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to export audit logs" }, { status: 500 })
  }
}

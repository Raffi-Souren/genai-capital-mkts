import type { AuditLogType } from "./schemas"

class AuditStore {
  private logs: AuditLogType[] = []
  private maxLogs = 1000 // Keep last 1000 entries

  addLog(log: AuditLogType) {
    this.logs.unshift(log)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }
  }

  getLogs(): AuditLogType[] {
    return [...this.logs]
  }

  getRecentLogs(count = 50): AuditLogType[] {
    return this.logs.slice(0, count)
  }

  clearLogs() {
    this.logs = []
  }
}

export const auditStore = new AuditStore()

export function logAuditEvent(route: string, inputsSummary: string, outputsSummary: string) {
  auditStore.addLog({
    route,
    atISO: new Date().toISOString(),
    inputsSummary,
    outputsSummary,
  })
}

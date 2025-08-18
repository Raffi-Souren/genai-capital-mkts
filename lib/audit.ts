type Entry = {
  route: string
  atISO: string
  inputs: any
  outputs: any
}

type AuditLogEntry = {
  route: string
  method: string
  timestamp: string
  latencyMs: number
  costUsd: number
  status: "success" | "error"
  error?: string
}

const log: Entry[] = []

export function appendAudit(e: Entry) {
  log.push(e)
  if (log.length > 500) log.shift()
}

export function getAudit() {
  return log
}

export function logAudit(entry: AuditLogEntry) {
  // Convert to the existing Entry format for compatibility
  const auditEntry: Entry = {
    route: entry.route,
    atISO: entry.timestamp,
    inputs: { method: entry.method },
    outputs: {
      latencyMs: entry.latencyMs,
      costUsd: entry.costUsd,
      status: entry.status,
      error: entry.error,
    },
  }

  appendAudit(auditEntry)
}

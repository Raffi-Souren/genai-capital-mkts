type Entry = {
  route: string
  atISO: string
  inputs: any
  outputs: any
}

const log: Entry[] = []

export function appendAudit(e: Entry) {
  log.push(e)
  if (log.length > 500) log.shift()
}

export function getAudit() {
  return log
}

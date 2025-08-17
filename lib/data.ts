import fs from "node:fs/promises"
import path from "node:path"

const base = path.join(process.cwd(), "data")

export async function readJsonSafe<T = any>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(base, file), "utf8"))
  } catch {
    return fallback
  }
}

export async function readTextSafe(file: string, fallback = "") {
  try {
    return await fs.readFile(path.join(base, file), "utf8")
  } catch {
    return fallback
  }
}

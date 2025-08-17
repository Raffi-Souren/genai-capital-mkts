import { NextResponse } from "next/server"

export async function GET() {
  const live = !!process.env.OPENAI_API_KEY

  return NextResponse.json({
    live,
    model: process.env.GPT_MODEL || "gpt-4o",
    at: new Date().toISOString(),
    mode: live ? "Live" : "Mock",
  })
}

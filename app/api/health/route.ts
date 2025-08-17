import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    success: true,
    llm_available: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString(),
  })
}

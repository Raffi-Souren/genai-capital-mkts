import { type NextRequest, NextResponse } from "next/server"
import { callLLM } from "@/lib/llm"
import { logAudit } from "@/lib/audit"

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { useSample, transcript } = await request.json()

    let analysisData
    if (useSample) {
      // Use sample earnings call data
      analysisData = {
        keyInsights: [
          "Revenue grew 15% YoY, beating guidance by $50M",
          "New product launch exceeded expectations with 2M users",
          "International expansion showing strong momentum",
          "Cost optimization initiatives saving $100M annually",
          "Strong cash position with $2B for strategic investments",
        ],
        sentiment: "positive" as const,
        financialMetrics: {
          revenue: "$1.2B (+15% YoY)",
          guidance: "Q4: $1.3-1.35B (raised from $1.25B)",
          margins: "Gross: 68% (+200bps), Operating: 22% (+150bps)",
        },
        riskFactors: [
          "Increased competition in core markets",
          "Supply chain disruptions in Q4",
          "Regulatory uncertainty in EU markets",
          "Currency headwinds from strong USD",
        ],
        managementTone:
          "Confident and optimistic, emphasizing strong execution and market position. CEO highlighted team's ability to navigate challenges while maintaining growth trajectory.",
        actionItems: [
          "Monitor competitive response to new product",
          "Track supply chain recovery metrics",
          "Assess EU regulatory impact on Q1 guidance",
          "Evaluate M&A opportunities with strong cash position",
        ],
      }
    } else {
      // Process actual transcript with LLM
      const prompt = `Analyze this earnings call transcript and extract:
      1. Key financial insights and metrics
      2. Overall sentiment (positive/negative/neutral)
      3. Risk factors mentioned
      4. Management tone and confidence level
      5. Action items for analysts
      
      Transcript: ${transcript}`

      const response = await callLLM(prompt, "meetings-analysis")
      analysisData = JSON.parse(response.content)
    }

    const latencyMs = Date.now() - startTime
    const costUsd = 0.0023 // Estimated cost

    await logAudit({
      route: "/api/meetings/analyze",
      method: "POST",
      timestamp: new Date().toISOString(),
      latencyMs,
      costUsd,
      status: "success",
    })

    return NextResponse.json({
      analysis: analysisData,
      mode: process.env.OPENAI_API_KEY ? "Live" : "Mock",
      model: "GPT-5",
      latencyMs,
      costUsd,
    })
  } catch (error) {
    const latencyMs = Date.now() - startTime

    await logAudit({
      route: "/api/meetings/analyze",
      method: "POST",
      timestamp: new Date().toISOString(),
      latencyMs,
      costUsd: 0,
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    })

    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}

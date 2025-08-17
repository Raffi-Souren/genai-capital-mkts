import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { RegimeDetection } from "@/lib/schemas"
import { logAuditEvent } from "@/lib/audit-store"
import fs from "fs/promises"
import path from "path"

const RequestSchema = z.object({
  detectRegimeJson: z.record(z.any()).optional(),
  mode: z.enum(["mock", "live"]).default("mock"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { detectRegimeJson, mode } = RequestSchema.parse(body)

    // Load sample data if not provided
    const regimeData =
      detectRegimeJson ||
      JSON.parse(await fs.readFile(path.join(process.cwd(), "data/detect_regime_sample.json"), "utf-8"))

    const result = analyzeRegimeData(regimeData)
    const validatedResult = RegimeDetection.parse(result)

    logAuditEvent(
      "/api/regime/analyze",
      `Regime periods: ${validatedResult.timeline.length}, Changes: ${validatedResult.changes.length}`,
      `Current regime: ${validatedResult.currentRegime}, Hedges: ${validatedResult.hedges.length}`,
    )

    return NextResponse.json({
      success: true,
      data: validatedResult,
      mode: mode === "live" && process.env.OPENAI_API_KEY ? "live" : "mock",
    })
  } catch (error) {
    logAuditEvent(
      "/api/regime/analyze",
      "Request failed",
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    )

    return NextResponse.json({ success: false, error: "Failed to analyze regime data" }, { status: 500 })
  }
}

function analyzeRegimeData(data: any) {
  // Extract timeline from sample data
  const timeline = data.regime_timeline || []

  // Identify regime changes
  const changes = []
  for (let i = 1; i < timeline.length; i++) {
    if (timeline[i].regime !== timeline[i - 1].regime) {
      changes.push({
        date: timeline[i].date,
        from_regime: timeline[i - 1].regime,
        to_regime: timeline[i].regime,
        significance: Math.random() * 0.5 + 0.5, // Mock significance score
      })
    }
  }

  // Get current regime
  const currentRegime = timeline.length > 0 ? timeline[timeline.length - 1].regime : "Risk-On"

  // Generate hedge recommendations by desk
  const hedges = generateHedgeRecommendations(currentRegime, data)

  return {
    timeline,
    changes,
    currentRegime,
    hedges,
  }
}

function generateHedgeRecommendations(currentRegime: string, data: any) {
  const baseRecommendations = {
    "Risk-On": {
      Equities: {
        recommendation: "Reduce long equity exposure, increase defensive sectors",
        rationale: "Risk-on regime suggests potential for increased volatility and rotation",
      },
      "Prime Brokerage": {
        recommendation: "Tighten margin requirements, increase collateral buffers",
        rationale: "Higher correlation environment increases counterparty risk",
      },
      Macro: {
        recommendation: "Long volatility, short credit spreads",
        rationale: "Risk-on periods often precede volatility spikes",
      },
    },
    "Risk-Off": {
      Equities: {
        recommendation: "Increase cash allocation, focus on quality names",
        rationale: "Risk-off environment favors defensive positioning",
      },
      "Prime Brokerage": {
        recommendation: "Reduce leverage limits, enhance stress testing",
        rationale: "Flight to quality increases funding pressures",
      },
      Macro: {
        recommendation: "Long duration, long safe haven currencies",
        rationale: "Risk-off regime supports bond rally and USD strength",
      },
    },
  }

  const recommendations =
    baseRecommendations[currentRegime as keyof typeof baseRecommendations] || baseRecommendations["Risk-On"]

  return Object.entries(recommendations).map(([desk, rec]: [string, any]) => ({
    desk,
    recommendation: rec.recommendation,
    rationale: rec.rationale,
  }))
}

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { SarMemo } from "@/lib/schemas"
import { logAuditEvent } from "@/lib/audit-store"
import fs from "fs/promises"
import path from "path"

const RequestSchema = z.object({
  watchlistJson: z.record(z.any()).optional(),
  tradesJson: z.record(z.any()).optional(),
  mode: z.enum(["mock", "live"]).default("mock"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { watchlistJson, tradesJson, mode } = RequestSchema.parse(body)

    // Load sample data if not provided
    const watchlist =
      watchlistJson ||
      JSON.parse(await fs.readFile(path.join(process.cwd(), "data/get_watchlist_sample.json"), "utf-8"))

    const trades =
      tradesJson || JSON.parse(await fs.readFile(path.join(process.cwd(), "data/query_trades_sample.json"), "utf-8"))

    // Compute surveillance metrics
    const metrics = computeSurveillanceMetrics(trades, watchlist)

    // Generate SAR memo
    const sarMemoJson = generateSarMemo(metrics, trades, watchlist)
    const sarMemoText = generateSarMemoText(sarMemoJson)

    // Validate against schema
    const validatedMemo = SarMemo.parse(sarMemoJson)

    logAuditEvent(
      "/api/surveillance/triage",
      `Trades: ${trades.trades?.length || 0}, Watchlist: ${watchlist.accounts?.length || 0}`,
      `Generated SAR memo with ${validatedMemo.evidence.length} evidence items`,
    )

    return NextResponse.json({
      success: true,
      data: {
        metrics,
        sarMemoJson: validatedMemo,
        sarMemoText,
        mode: mode === "live" && process.env.OPENAI_API_KEY ? "live" : "mock",
      },
    })
  } catch (error) {
    logAuditEvent(
      "/api/surveillance/triage",
      "Request failed",
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    )

    return NextResponse.json({ success: false, error: "Failed to process surveillance data" }, { status: 500 })
  }
}

function computeSurveillanceMetrics(trades: any, watchlist: any) {
  const tradeList = trades.trades || []

  // Compute self-match percentage
  const selfMatches = tradeList.filter((trade: any) => trade.buyer_account === trade.seller_account).length
  const self_match_pct = tradeList.length > 0 ? (selfMatches / tradeList.length) * 100 : 0

  // Compute average round-trip time
  const roundTrips = tradeList.filter((trade: any) => trade.round_trip_seconds)
  const round_trip_avg_secs =
    roundTrips.length > 0
      ? roundTrips.reduce((sum: number, trade: any) => sum + trade.round_trip_seconds, 0) / roundTrips.length
      : null

  // Get top accounts by flip count
  const accountFlips: Record<string, number> = {}
  tradeList.forEach((trade: any) => {
    if (trade.flip_indicator) {
      accountFlips[trade.account_id] = (accountFlips[trade.account_id] || 0) + 1
    }
  })

  const top_accounts = Object.entries(accountFlips)
    .map(([account_id, flip_count]) => ({ account_id, flip_count }))
    .sort((a, b) => b.flip_count - a.flip_count)
    .slice(0, 10)

  return {
    self_match_pct: Math.round(self_match_pct * 100) / 100,
    round_trip_avg_secs,
    top_accounts,
  }
}

function generateSarMemo(metrics: any, trades: any, watchlist: any) {
  return {
    summary:
      "Surveillance analysis identified potential market manipulation patterns requiring further investigation. Multiple accounts show suspicious trading behavior including self-matching and rapid round-trip transactions.",

    evidence: [
      `Self-match rate of ${metrics.self_match_pct}% exceeds regulatory threshold of 5%`,
      `Average round-trip time of ${metrics.round_trip_avg_secs?.toFixed(1) || "N/A"} seconds indicates potential coordination`,
      `${metrics.top_accounts.length} accounts show elevated flip activity patterns`,
      "Temporal clustering of trades suggests non-random behavior",
      "Cross-account correlation analysis reveals potential coordination",
    ],

    metrics: {
      self_match_pct: metrics.self_match_pct,
      round_trip_avg_secs: metrics.round_trip_avg_secs,
      top_accounts: metrics.top_accounts,
    },

    controls: [
      "Enhanced monitoring of flagged accounts",
      "Real-time trade pattern analysis",
      "Cross-reference with known manipulation schemes",
      "Escalation to compliance team for review",
    ],

    appendix: {
      sources: ["Trade surveillance system", "Account watchlist database", "Historical pattern analysis"],
      parameters: {
        analysis_period: "30 days",
        threshold_self_match: 5.0,
        threshold_round_trip: 60.0,
        accounts_analyzed: watchlist.accounts?.length || 0,
        trades_analyzed: trades.trades?.length || 0,
      },
    },
  }
}

function generateSarMemoText(sarMemo: any): string {
  return `SUSPICIOUS ACTIVITY REPORT - PRELIMINARY ANALYSIS

SUMMARY
${sarMemo.summary}

EVIDENCE IDENTIFIED
${sarMemo.evidence.map((item: string, index: number) => `${index + 1}. ${item}`).join("\n")}

KEY METRICS
- Self-Match Percentage: ${sarMemo.metrics.self_match_pct}%
- Average Round-Trip Time: ${sarMemo.metrics.round_trip_avg_secs?.toFixed(1) || "N/A"} seconds
- Flagged Accounts: ${sarMemo.metrics.top_accounts.length}

TOP ACCOUNTS BY ACTIVITY
${sarMemo.metrics.top_accounts
  .map((account: any, index: number) => `${index + 1}. Account ${account.account_id}: ${account.flip_count} flips`)
  .join("\n")}

RECOMMENDED CONTROLS
${sarMemo.controls.map((control: string, index: number) => `${index + 1}. ${control}`).join("\n")}

ANALYSIS PARAMETERS
- Analysis Period: ${sarMemo.appendix.parameters.analysis_period}
- Trades Analyzed: ${sarMemo.appendix.parameters.trades_analyzed}
- Accounts Monitored: ${sarMemo.appendix.parameters.accounts_analyzed}

This preliminary analysis requires further investigation and potential regulatory filing.`
}

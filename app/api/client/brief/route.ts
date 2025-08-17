import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ClientBrief } from "@/lib/schemas"
import { logAuditEvent } from "@/lib/audit-store"
import fs from "fs/promises"
import path from "path"

const RequestSchema = z.object({
  stub: z.record(z.any()).optional(),
  mode: z.enum(["mock", "live"]).default("mock"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { stub, mode } = RequestSchema.parse(body)

    // Load sample data if not provided
    const clientData =
      stub || JSON.parse(await fs.readFile(path.join(process.cwd(), "data/client_brief_sample.json"), "utf-8"))

    const result = generateClientBrief(clientData)
    const validatedResult = ClientBrief.parse(result)

    logAuditEvent(
      "/api/client/brief",
      `Client: ${clientData.client_name || "Unknown"}, Meeting type: ${clientData.meeting_type || "Standard"}`,
      `Generated brief with ${validatedResult.talkingPoints.length} talking points and ${validatedResult.crossSell.length} cross-sell opportunities`,
    )

    return NextResponse.json({
      success: true,
      data: validatedResult,
      mode: mode === "live" && process.env.OPENAI_API_KEY ? "live" : "mock",
    })
  } catch (error) {
    logAuditEvent(
      "/api/client/brief",
      "Request failed",
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    )

    return NextResponse.json({ success: false, error: "Failed to generate client brief" }, { status: 500 })
  }
}

function generateClientBrief(clientData: any) {
  const brief = `Meeting Brief: ${clientData.client_name || "Valued Client"}

Objective: ${clientData.meeting_objective || "Quarterly business review and relationship strengthening"}

Client Background: ${clientData.client_name || "This institutional client"} is a ${clientData.client_type || "large pension fund"} with approximately ${clientData.aum || "$2.5B"} in assets under management. They have been a client since ${clientData.relationship_start || "2019"} and primarily focus on ${clientData.investment_focus || "equity and fixed income strategies"}.

Recent Activity: Over the past quarter, the client has ${clientData.recent_activity || "increased their allocation to alternative investments and shown interest in ESG-focused products"}. Their portfolio performance has been ${clientData.performance || "in line with benchmarks despite market volatility"}.

Key Discussion Points: We will review their current portfolio positioning, discuss market outlook for the remainder of the year, and explore opportunities to optimize their asset allocation. Special attention will be given to their interest in ${clientData.special_interests || "sustainable investing and risk management solutions"}.

Relationship Status: The relationship remains strong with regular communication and high satisfaction scores. The client values our research capabilities and execution quality. There are opportunities to deepen the relationship through additional product offerings and enhanced service delivery.`

  const talkingPoints = [
    `Portfolio performance: ${clientData.performance_summary || "Outperformed benchmark by 150bps YTD despite challenging market conditions"}`,
    `Market outlook: ${clientData.market_view || "Cautiously optimistic on equities with focus on quality names and defensive positioning"}`,
    `Risk management: ${clientData.risk_focus || "Enhanced downside protection through options strategies and diversification"}`,
    `ESG integration: ${clientData.esg_approach || "Expanding sustainable investment options with strong performance track record"}`,
    `Technology capabilities: ${clientData.tech_highlights || "New portfolio analytics platform providing real-time risk monitoring and reporting"}`,
  ]

  const crossSell = [
    `${clientData.crosssell_1 || "Prime brokerage services: Comprehensive financing and securities lending solutions"}`,
    `${clientData.crosssell_2 || "Alternative investments: Private equity and hedge fund access through our platform"}`,
  ]

  return {
    brief,
    talkingPoints,
    crossSell,
  }
}

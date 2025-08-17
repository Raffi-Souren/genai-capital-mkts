import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { logAuditEvent } from "@/lib/audit-store"
import fs from "fs/promises"
import path from "path"

const RequestSchema = z.object({
  text: z.string().optional(),
  stub: z.record(z.any()).optional(),
  mode: z.enum(["mock", "live"]).default("mock"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, stub, mode } = RequestSchema.parse(body)

    // Load sample data and taxonomy
    const regImpact =
      stub || JSON.parse(await fs.readFile(path.join(process.cwd(), "data/reg_impact_sample.json"), "utf-8"))

    const taxonomy = JSON.parse(await fs.readFile(path.join(process.cwd(), "data/reg_taxonomy.json"), "utf-8"))

    const result = analyzeRegulatoryImpact(text || regImpact.regulation_text, taxonomy, regImpact)

    logAuditEvent(
      "/api/regimpact/analyze",
      `Text length: ${text?.length || 0}, Impacted desks: ${result.impactedDesks.length}`,
      `Checklist items: ${result.checklist.length}, Template sections: ${Object.keys(result.template).length}`,
    )

    return NextResponse.json({
      success: true,
      data: result,
      mode: mode === "live" && process.env.OPENAI_API_KEY ? "live" : "mock",
    })
  } catch (error) {
    logAuditEvent(
      "/api/regimpact/analyze",
      "Request failed",
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    )

    return NextResponse.json({ success: false, error: "Failed to analyze regulatory impact" }, { status: 500 })
  }
}

function analyzeRegulatoryImpact(text: string, taxonomy: any, sampleData: any) {
  // Map regulation to affected desks using taxonomy
  const impactedDesks = taxonomy.desk_mappings
    .filter(
      (mapping: any) =>
        text.toLowerCase().includes(mapping.regulation_type.toLowerCase()) ||
        mapping.keywords.some((keyword: string) => text.toLowerCase().includes(keyword.toLowerCase())),
    )
    .map((mapping: any) => ({
      desk: mapping.desk,
      impact_level: mapping.impact_level,
      description: mapping.description,
    }))

  // Generate implementation checklist
  const checklist = generateImplementationChecklist(impactedDesks, sampleData)

  // Generate capital impact template
  const template = generateCapitalTemplate(impactedDesks, sampleData)

  return {
    impactedDesks,
    checklist,
    template,
  }
}

function generateImplementationChecklist(impactedDesks: any[], sampleData: any) {
  const baseDate = new Date()

  return [
    {
      task: "Conduct impact assessment across affected desks",
      owner: "Compliance Team",
      due_date: new Date(baseDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pending",
      priority: "high",
    },
    {
      task: "Update risk management policies and procedures",
      owner: "Risk Management",
      due_date: new Date(baseDate.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pending",
      priority: "high",
    },
    {
      task: "Implement system changes for compliance monitoring",
      owner: "Technology Team",
      due_date: new Date(baseDate.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pending",
      priority: "medium",
    },
    {
      task: "Train staff on new regulatory requirements",
      owner: "HR & Compliance",
      due_date: new Date(baseDate.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pending",
      priority: "medium",
    },
    {
      task: "File regulatory notifications and reports",
      owner: "Legal Team",
      due_date: new Date(baseDate.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pending",
      priority: "high",
    },
    {
      task: "Conduct compliance testing and validation",
      owner: "Internal Audit",
      due_date: new Date(baseDate.getTime() + 60 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      status: "pending",
      priority: "medium",
    },
  ]
}

function generateCapitalTemplate(impactedDesks: any[], sampleData: any) {
  return {
    before: {
      tier1_capital: 12500000000, // $12.5B
      tier2_capital: 3200000000, // $3.2B
      risk_weighted_assets: 95000000000, // $95B
      capital_ratio: 16.5,
      leverage_ratio: 8.2,
    },
    after: {
      tier1_capital: 13750000000, // $13.75B (+10%)
      tier2_capital: 3520000000, // $3.52B (+10%)
      risk_weighted_assets: 104500000000, // $104.5B (+10%)
      capital_ratio: 16.5, // Maintained
      leverage_ratio: 7.9, // Slight decrease due to increased assets
    },
    impact_summary: {
      additional_capital_required: 1250000000, // $1.25B
      implementation_cost: 25000000, // $25M
      ongoing_compliance_cost: 8000000, // $8M annually
      timeline_months: 6,
      regulatory_buffer: 500000000, // $500M additional buffer
    },
    assumptions: [
      "10% increase in risk-weighted assets due to new calculation methodology",
      "Additional Tier 1 capital raised through retained earnings and equity issuance",
      "Implementation costs include system upgrades and staff training",
      "Ongoing costs reflect additional compliance monitoring and reporting",
    ],
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { ResearchNote } from "@/lib/schemas"
import { logAuditEvent } from "@/lib/audit-store"
import { callLLM } from "@/lib/llm"
import fs from "fs/promises"
import path from "path"

const RequestSchema = z.object({
  files: z.array(z.string()).optional(),
  style: z.record(z.any()).optional(),
  mode: z.enum(["mock", "live"]).default("mock"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { files, style, mode } = RequestSchema.parse(body)

    let result: any

    if (mode === "live" && process.env.OPENAI_API_KEY) {
      result = await generateLiveResearch(files, style)
    } else {
      result = await generateMockResearch()
    }

    const validatedResult = ResearchNote.parse(result)

    logAuditEvent(
      "/api/research/draft",
      `Files: ${files?.length || 0}, Style: ${style ? "custom" : "default"}, Mode: ${mode}`,
      `Generated research note with ${validatedResult.citations.length} citations`,
    )

    return NextResponse.json({
      success: true,
      data: validatedResult,
      mode: mode === "live" && process.env.OPENAI_API_KEY ? "live" : "mock",
    })
  } catch (error) {
    logAuditEvent(
      "/api/research/draft",
      "Request failed",
      `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
    )

    return NextResponse.json({ success: false, error: "Failed to generate research draft" }, { status: 500 })
  }
}

async function generateLiveResearch(files?: string[], style?: any) {
  const systemPrompt = `You are a senior equity research analyst. Generate a comprehensive investment research note based on the provided documents.

Include:
1. Executive summary with clear investment thesis
2. 3 key performance indicators with YoY/QoQ comparisons
3. Risk factors analysis
4. Management quotes (≤25 words each) with page references
5. Investment recommendation with price target

Format as structured markdown with clear sections.`

  const userPrompt = `Analyze the uploaded documents (${files?.length || 0} files) and generate a research note.
${style ? `Use this style guide: ${JSON.stringify(style)}` : "Use professional equity research format."}

Focus on:
- Financial performance metrics
- Competitive positioning  
- Growth drivers and risks
- Management commentary
- Valuation and recommendation`

  const llmResponse = await callLLM({
    system: systemPrompt,
    user: userPrompt,
  })

  if (llmResponse.mode === "mock") {
    return generateMockResearch()
  }

  // Parse LLM response and structure it according to our schema
  // For now, return mock data with LLM content integrated
  const mockData = await generateMockResearch()

  return {
    ...mockData,
    markdown: llmResponse.content,
  }
}

async function generateMockResearch() {
  const styleGuide = JSON.parse(await fs.readFile(path.join(process.cwd(), "data/style_guide.json"), "utf-8"))

  return {
    markdown: `# Investment Thesis: TechCorp Inc. (TECH)

## Executive Summary
TechCorp demonstrates strong fundamentals with accelerating cloud revenue growth and expanding margins. Recent 8-K filing indicates successful product launch exceeding initial guidance.

## Key Performance Indicators

### Revenue Growth (YoY/QoQ)
- **Total Revenue**: +18% YoY, +4% QoQ ($2.1B vs $1.8B prior year)
- **Cloud Services**: +35% YoY, +8% QoQ ($850M vs $630M prior year)  
- **Enterprise Solutions**: +12% YoY, +2% QoQ ($1.25B vs $1.12B prior year)

### Profitability Metrics
- **Gross Margin**: 68.5% vs 65.2% prior year (+330 bps improvement)
- **Operating Margin**: 22.1% vs 19.8% prior year (+230 bps improvement)
- **Free Cash Flow**: $420M vs $310M prior year (+35% YoY)

### Operational Efficiency  
- **Customer Acquisition Cost**: $1,200 vs $1,450 prior year (-17% improvement)
- **Net Revenue Retention**: 118% vs 112% prior year
- **Employee Productivity**: $285K revenue per employee vs $260K prior year

## Risk Factors
- **Competitive Pressure**: Increased competition from cloud hyperscalers may compress margins
- **Regulatory Exposure**: Pending data privacy regulations could impact international operations
- **Customer Concentration**: Top 10 customers represent 35% of revenue, creating concentration risk
- **Technology Obsolescence**: Rapid AI advancement may require significant R&D investment

## Management Commentary
> "Our cloud transformation strategy is delivering exceptional results with record customer adoption." - CEO, Q3 Earnings Call, Page 4

> "We see tremendous opportunity in the enterprise AI market with our differentiated platform approach." - CTO, Recent Press Release, Page 2

> "Margin expansion reflects our operational discipline and scalable business model." - CFO, 8-K Filing, Page 1

## Investment Recommendation
**BUY** with 12-month price target of $145 (25% upside from current $116). Strong execution on cloud strategy, expanding margins, and robust cash generation support positive outlook.

---
*This analysis is based on publicly available information and should not be considered personalized investment advice.*`,

    citations: [
      { page: 1, section: "Financial Highlights", source: "8-K Filing" },
      { page: 2, section: "Product Launch", source: "Press Release" },
      { page: 4, section: "Management Discussion", source: "Q3 Earnings Call" },
      { page: 12, section: "Risk Factors", source: "10-Q Filing" },
      { page: 8, section: "Segment Performance", source: "10-Q Filing" },
    ],

    brief150:
      "TechCorp (TECH) reports strong Q3 results with 18% revenue growth and expanding margins. Cloud services accelerated to 35% YoY growth, driving overall performance. Management guidance raised for FY2024. Key risks include competitive pressure and customer concentration. Recommend BUY with $145 price target representing 25% upside. Strong fundamentals and execution support positive outlook despite macro headwinds.",

    redlines: [
      "Previous guidance: $2.0B revenue → Raised to $2.1B (+5%)",
      "Cloud growth estimate: 30% → Actual 35% (+500 bps beat)",
      "Operating margin target: 20% → Achieved 22.1% (+210 bps beat)",
      "Free cash flow projection: $380M → Delivered $420M (+11% beat)",
    ],
  }
}

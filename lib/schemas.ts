import { z } from "zod"

export const SarMemo = z.object({
  summary: z.string(),
  evidence: z.array(z.string()).min(1),
  metrics: z.object({
    self_match_pct: z.number(),
    round_trip_avg_secs: z.number().nullable(),
    top_accounts: z.array(
      z.object({
        account_id: z.string(),
        flip_count: z.number(),
      }),
    ),
  }),
  controls: z.array(z.string()).default([]),
  appendix: z.object({
    sources: z.array(z.string()),
    parameters: z.record(z.any()),
  }),
})

export const ResearchNote = z.object({
  markdown: z.string(),
  citations: z.array(
    z.object({
      page: z.number(),
      section: z.string().optional(),
      source: z.string(),
    }),
  ),
  brief150: z.string().optional(),
  redlines: z.array(z.string()).optional(),
})

export const RegimeDetection = z.object({
  timeline: z.array(
    z.object({
      date: z.string(),
      regime: z.string(),
      confidence: z.number(),
    }),
  ),
  changes: z.array(
    z.object({
      date: z.string(),
      from_regime: z.string(),
      to_regime: z.string(),
      significance: z.number(),
    }),
  ),
  currentRegime: z.string(),
  hedges: z.array(
    z.object({
      desk: z.string(),
      recommendation: z.string(),
      rationale: z.string(),
    }),
  ),
})

export const ClientBrief = z.object({
  brief: z.string(),
  talkingPoints: z.array(z.string()),
  crossSell: z.array(z.string()),
})

export const AuditLog = z.object({
  route: z.string(),
  atISO: z.string(),
  inputsSummary: z.string(),
  outputsSummary: z.string(),
})

export type SarMemoType = z.infer<typeof SarMemo>
export type ResearchNoteType = z.infer<typeof ResearchNote>
export type RegimeDetectionType = z.infer<typeof RegimeDetection>
export type ClientBriefType = z.infer<typeof ClientBrief>
export type AuditLogType = z.infer<typeof AuditLog>

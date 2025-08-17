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

export type SarMemoT = z.infer<typeof SarMemo>

import OpenAI from "openai"

// Server-only LLM client - never expose to client-side
export const client = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null

export async function callLLM({
  system,
  user,
  schema,
}: {
  system: string
  user: string
  schema?: object
}) {
  // Auto-fallback to mock mode if no API key
  if (!process.env.OPENAI_API_KEY || !client) {
    return {
      mode: "mock" as const,
      content: "[Mock LLM output - add OPENAI_API_KEY to enable Live mode]",
    }
  }

  try {
    const messages = [
      { role: "system" as const, content: system },
      { role: "user" as const, content: user },
    ]

    const response = await client.chat.completions.create({
      model: process.env.GPT_MODEL || "gpt-4o",
      messages,
      ...(schema
        ? {
            response_format: {
              type: "json_object" as const,
            },
          }
        : {}),
    })

    return {
      mode: "live" as const,
      content: response.choices[0]?.message?.content || "[No response]",
    }
  } catch (error) {
    console.error("LLM call failed:", error)
    return {
      mode: "mock" as const,
      content: "[LLM call failed - falling back to mock mode]",
    }
  }
}

export function isLiveModeAvailable(): boolean {
  return !!process.env.OPENAI_API_KEY
}

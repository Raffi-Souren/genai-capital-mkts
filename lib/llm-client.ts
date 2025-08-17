import OpenAI from "openai"

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null

export async function callLLM({
  system,
  user,
  jsonSchema,
}: {
  system: string
  user: string
  jsonSchema?: any
}) {
  if (!openai) {
    throw new Error("OpenAI API key not configured")
  }

  try {
    const response = await openai.chat.completions.create({
      model: process.env.GPT_MODEL || "gpt-4",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.1,
      ...(jsonSchema && {
        response_format: { type: "json_object" },
      }),
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error("No response from LLM")
    }

    return jsonSchema ? JSON.parse(content) : content
  } catch (error) {
    console.error("LLM call failed:", error)
    throw new Error("Failed to generate LLM response")
  }
}

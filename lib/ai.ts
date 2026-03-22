import type { AnalysisResult, ItemType } from '@/types'
import { buildAnalysisPrompt } from './prompts'
import { getMockAnalysis } from './mock-ai'

// ── Mode detection ──────────────────────────────────────────────────────────
function useMock(): boolean {
  if (process.env.USE_MOCK_AI === 'true') return true
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY.trim() === '') return true
  return false
}

// ── Real LLM call ───────────────────────────────────────────────────────────
async function callLLM(content: string, type: ItemType): Promise<AnalysisResult> {
  // Lazy import so the module doesn't blow up when running in mock mode
  const { default: OpenAI } = await import('openai')

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  })

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const prompt = buildAnalysisPrompt(content, type)

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    max_tokens: 2048,
  })

  const raw = response.choices[0]?.message?.content ?? ''
  return parseResponse(raw)
}

// ── JSON parser + validator ─────────────────────────────────────────────────
function parseResponse(raw: string): AnalysisResult {
  // Strip accidental markdown fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/m, '')
    .replace(/\s*```$/m, '')
    .trim()

  const p = JSON.parse(cleaned) // throws on bad JSON → caught by caller

  const validUrgency = ['low', 'medium', 'high', 'critical']
  const validPriority = ['low', 'medium', 'high']

  return {
    summary: String(p.summary ?? 'No summary available.'),
    suggestedTitle: String(p.suggestedTitle ?? 'Untitled Item').slice(0, 80),
    urgency: validUrgency.includes(p.urgency) ? p.urgency : 'medium',
    deadlines: Array.isArray(p.deadlines)
      ? p.deadlines.map((d: any) => ({
          description: String(d.description ?? ''),
          date: d.date ?? null,
        }))
      : [],
    entities: Array.isArray(p.entities)
      ? p.entities.map((e: any) => ({
          name: String(e.name ?? ''),
          type: e.type ?? 'other',
        }))
      : [],
    nextSteps: Array.isArray(p.nextSteps) ? p.nextSteps.map(String) : [],
    tasks: Array.isArray(p.tasks)
      ? p.tasks.map((t: any) => ({
          title: String(t.title ?? ''),
          dueDate: t.dueDate ?? null,
          priority: validPriority.includes(t.priority) ? t.priority : 'medium',
        }))
      : [],
    reply: {
      professional: String(p.reply?.professional ?? ''),
      friendly: String(p.reply?.friendly ?? ''),
      acknowledgement: String(p.reply?.acknowledgement ?? ''),
    },
  }
}

// ── Public API ──────────────────────────────────────────────────────────────
export async function analyzeContent(
  content: string,
  type: ItemType
): Promise<{ result: AnalysisResult; mock: boolean }> {
  if (useMock()) {
    // Simulate a short "thinking" delay so the UI loading state is visible
    await new Promise((r) => setTimeout(r, 900))
    return { result: getMockAnalysis(content, type), mock: true }
  }

  // Try up to 2 times (one retry on parse failure)
  let lastErr: unknown
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const result = await callLLM(content, type)
      return { result, mock: false }
    } catch (err) {
      lastErr = err
      if (attempt === 0) await new Promise((r) => setTimeout(r, 1200))
    }
  }

  throw lastErr
}

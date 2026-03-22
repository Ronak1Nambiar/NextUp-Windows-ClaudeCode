import type { ItemType } from '@/types'

export function buildAnalysisPrompt(content: string, type: ItemType): string {
  return `You are an expert life-admin assistant. Analyze the following ${type} and return structured JSON.

CONTENT:
---
${content}
---

Return ONLY a single valid JSON object — no markdown fences, no explanation — matching this exact shape:
{
  "summary": "<2–3 sentence summary of the key information>",
  "suggestedTitle": "<short descriptive title, max 60 characters>",
  "urgency": "<one of: low | medium | high | critical>",
  "deadlines": [
    { "description": "<what must happen>", "date": "<YYYY-MM-DD or null>" }
  ],
  "entities": [
    { "name": "<entity name>", "type": "<person|organization|place|document|date|other>" }
  ],
  "nextSteps": ["<action item>"],
  "tasks": [
    { "title": "<task>", "dueDate": "<YYYY-MM-DD or null>", "priority": "<low|medium|high>" }
  ],
  "reply": {
    "professional": "<formal reply draft>",
    "friendly": "<casual reply draft>",
    "acknowledgement": "<brief one-line acknowledgement>"
  }
}

URGENCY RULES:
- critical → immediate action required (today or tomorrow)
- high     → action needed within 3 days
- medium   → action needed within 1 week
- low      → informational or no urgent action

Respond with ONLY the JSON object.`
}

/**
 * lib/parsers.ts
 *
 * Content extraction layer. Designed to be extended without touching
 * the rest of the codebase — add OCR, DOCX, etc. right here.
 */

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Dynamic import avoids webpack bundling issues
  const pdfParse = await import('pdf-parse')
  const result = await pdfParse.default(buffer)
  if (!result.text?.trim()) {
    throw new Error('PDF appears to contain no extractable text (may be a scanned image).')
  }
  return result.text
}

export function extractTextFromPlain(content: string): string {
  return content.trim()
}

// ── Future extensions (add without touching API routes) ─────────────────────
// export async function extractTextFromDocx(buffer: Buffer): Promise<string> { ... }
// export async function extractTextFromImage(buffer: Buffer): Promise<string> { ... }

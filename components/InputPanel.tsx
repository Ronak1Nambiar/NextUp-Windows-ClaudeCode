'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Sparkles, ChevronDown, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SEEDS } from '@/lib/seeds'
import type { ItemType } from '@/types'

const TYPE_OPTIONS: { value: ItemType; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'notes', label: 'Notes' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'bill', label: 'Bill' },
  { value: 'document', label: 'Document' },
  { value: 'other', label: 'Other' },
]

interface Props {
  onAnalyze: (content: string, type: string, file?: File) => void
  isAnalyzing: boolean
}

export default function InputPanel({ onAnalyze, isAnalyzing }: Props) {
  const [content, setContent] = useState('')
  const [type, setType] = useState<ItemType>('email')
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [demoOpen, setDemoOpen] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const demoRef = useRef<HTMLDivElement>(null)

  const canSubmit = !isAnalyzing && (content.trim().length > 10 || file !== null)

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) {
      alert('Only PDF files are supported for upload.')
      return
    }
    if (f.size > 10 * 1024 * 1024) {
      alert('File too large — maximum size is 10 MB.')
      return
    }
    setFile(f)
    setContent('')
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDragOver(false)
      const f = e.dataTransfer.files[0]
      if (f) handleFile(f)
    },
    [handleFile]
  )

  const handleSubmit = () => {
    if (!canSubmit) return
    onAnalyze(content, type, file ?? undefined)
  }

  const loadSeed = (index: number) => {
    const seed = SEEDS[index]
    setContent(seed.content)
    setType(seed.type)
    setFile(null)
    setDemoOpen(false)
  }

  const clearFile = () => {
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <div className="w-full space-y-3">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo mark */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-accent/20 border border-accent/30 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
            </div>
            <span className="text-text-primary font-semibold text-sm tracking-tight">NextUp</span>
          </div>

          {/* Type selector */}
          <div className="h-4 w-px bg-border" />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ItemType)}
            className="bg-transparent text-text-secondary text-xs border-none outline-none cursor-pointer hover:text-text-primary transition-colors appearance-none pr-1"
          >
            {TYPE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-surface text-text-primary">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Demo button */}
        <div className="relative" ref={demoRef}>
          <button
            onClick={() => setDemoOpen((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary border border-border hover:border-border-strong px-2.5 py-1.5 rounded-md transition-colors"
          >
            Try a demo
            <ChevronDown className="w-3 h-3" />
          </button>

          {demoOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-surface border border-border rounded-lg shadow-2xl z-50 overflow-hidden animate-fade-in">
              {SEEDS.map((seed, i) => (
                <button
                  key={i}
                  onClick={() => loadSeed(i)}
                  className="w-full text-left px-3 py-2.5 text-xs text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors flex items-start gap-2 group"
                >
                  <span className="shrink-0 mt-0.5 text-text-muted group-hover:text-accent transition-colors">
                    ›
                  </span>
                  <span>{seed.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Textarea / file drop zone */}
      {file ? (
        <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3.5">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-text-primary truncate">{file.name}</p>
            <p className="text-xs text-text-muted mt-0.5">
              {(file.size / 1024).toFixed(0)} KB · PDF
            </p>
          </div>
          <button
            onClick={clearFile}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            'relative rounded-xl border transition-colors',
            dragOver
              ? 'border-accent/50 bg-accent/5'
              : 'border-border bg-surface hover:border-border-strong'
          )}
        >
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste an email, meeting notes, bill, assignment — anything messy…"
            rows={6}
            className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-sm resize-none px-4 py-4 rounded-xl font-sans leading-relaxed"
          />
          {dragOver && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-base/80 pointer-events-none">
              <p className="text-accent text-sm font-medium">Drop PDF here</p>
            </div>
          )}
        </div>
      )}

      {/* Action row */}
      <div className="flex items-center justify-between gap-3">
        {/* Upload PDF */}
        <button
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 text-xs text-text-muted hover:text-text-secondary border border-border hover:border-border-strong px-3 py-2 rounded-lg transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload PDF
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />

        {/* Character count */}
        {content.length > 0 && (
          <span className="text-xs text-text-muted tabular-nums">
            {content.length.toLocaleString()} chars
          </span>
        )}

        {/* Analyze button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
            canSubmit
              ? 'bg-accent text-[#1a0e05] hover:bg-accent-hover shadow-lg shadow-accent/10'
              : 'bg-surface border border-border text-text-muted cursor-not-allowed'
          )}
        >
          {isAnalyzing ? (
            <>
              <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              Analyze
            </>
          )}
        </button>
      </div>
    </div>
  )
}

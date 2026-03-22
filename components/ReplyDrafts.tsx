'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Reply } from '@/types'

type Tab = 'professional' | 'friendly' | 'acknowledgement'

const TABS: { key: Tab; label: string }[] = [
  { key: 'professional', label: 'Professional' },
  { key: 'friendly', label: 'Friendly' },
  { key: 'acknowledgement', label: 'Quick ACK' },
]

export default function ReplyDrafts({ reply }: { reply: Reply }) {
  const [activeTab, setActiveTab] = useState<Tab>('professional')
  const [copied, setCopied] = useState(false)

  const text = reply[activeTab]

  const handleCopy = async () => {
    if (!text) return
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Could not copy — please select manually.')
    }
  }

  if (!reply.professional && !reply.friendly && !reply.acknowledgement) return null

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-3">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'px-2.5 py-1 text-xs rounded-md transition-colors',
              activeTab === tab.key
                ? 'bg-surface-active text-text-primary'
                : 'text-text-secondary hover:text-text-primary'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Draft text */}
      <div className="relative group">
        <div className="bg-surface border border-border rounded-xl px-4 py-3.5 min-h-[80px]">
          <pre className="text-sm text-text-secondary whitespace-pre-wrap font-sans leading-relaxed">
            {text || <span className="text-text-muted italic">No draft available.</span>}
          </pre>
        </div>

        {/* Copy button */}
        {text && (
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-1.5 rounded-md bg-surface-active/80 border border-border opacity-0 group-hover:opacity-100 transition-all hover:bg-border text-text-secondary hover:text-text-primary"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  )
}

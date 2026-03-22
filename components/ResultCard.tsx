'use client'

import { useState } from 'react'
import { Trash2, Calendar, Users, ArrowRight, MessageSquare, CheckSquare, ChevronDown } from 'lucide-react'
import { cn, urgencyColor, typeLabel, formatDate } from '@/lib/utils'
import TaskBoard from './TaskBoard'
import ReplyDrafts from './ReplyDrafts'
import type { Item } from '@/types'

interface Props {
  item: Item
  onToggleTask: (id: number, completed: boolean) => void
  onDelete: () => void
}

export default function ResultCard({ item, onToggleTask, onDelete }: Props) {
  const [showReply, setShowReply] = useState(false)
  const [showRaw, setShowRaw] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const completedCount = item.tasks.filter((t) => t.completed).length

  return (
    <div className="animate-slide-up space-y-px">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-t-xl px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs text-text-muted">{typeLabel(item.type)}</span>
            <span className="text-text-muted">·</span>
            <span
              className={cn(
                'text-xs font-medium px-2 py-0.5 rounded-full border',
                urgencyColor(item.urgency)
              )}
            >
              {item.urgency.charAt(0).toUpperCase() + item.urgency.slice(1)}
            </span>
          </div>
          <h2 className="text-base font-semibold text-text-primary leading-snug">{item.title}</h2>
        </div>

        {/* Delete */}
        {confirmDelete ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-text-secondary">Delete this?</span>
            <button
              onClick={onDelete}
              className="text-xs px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs px-2.5 py-1 rounded-md border border-border text-text-secondary hover:text-text-primary transition-colors"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-text-muted hover:text-red-400 transition-colors shrink-0 mt-0.5"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* ── Summary ───────────────────────────────────────────────────── */}
      <div className="bg-surface border-x border-b border-border px-5 py-4">
        <p className="text-sm text-text-secondary leading-relaxed">{item.summary}</p>
      </div>

      {/* ── Deadlines ─────────────────────────────────────────────────── */}
      {item.deadlines.length > 0 && (
        <div className="bg-surface border-x border-b border-border px-5 py-4">
          <SectionLabel icon={<Calendar className="w-3.5 h-3.5" />} title="Deadlines" />
          <div className="mt-2.5 flex flex-wrap gap-2">
            {item.deadlines.map((d, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-surface-active border border-border rounded-lg px-3 py-1.5"
              >
                {d.date && (
                  <span className="text-xs font-mono text-accent">{formatDate(d.date)}</span>
                )}
                {d.date && <span className="text-border-strong">·</span>}
                <span className="text-xs text-text-secondary">{d.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Entities ──────────────────────────────────────────────────── */}
      {item.entities.length > 0 && (
        <div className="bg-surface border-x border-b border-border px-5 py-4">
          <SectionLabel icon={<Users className="w-3.5 h-3.5" />} title="Key Entities" />
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {item.entities.map((e, i) => (
              <span
                key={i}
                className="text-xs text-text-secondary bg-surface-active border border-border rounded-md px-2.5 py-1"
              >
                <span className="text-text-muted capitalize">{e.type}:</span>{' '}
                <span className="text-text-primary">{e.name}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Next Steps ────────────────────────────────────────────────── */}
      {item.next_steps.length > 0 && (
        <div className="bg-surface border-x border-b border-border px-5 py-4">
          <SectionLabel icon={<ArrowRight className="w-3.5 h-3.5" />} title="Next Steps" />
          <ol className="mt-2.5 space-y-2">
            {item.next_steps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <span className="shrink-0 w-5 h-5 rounded-md bg-surface-active border border-border flex items-center justify-center text-xs font-mono text-text-muted">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* ── Tasks ─────────────────────────────────────────────────────── */}
      {item.tasks.length > 0 && (
        <div className="bg-surface border-x border-b border-border px-5 py-4">
          <div className="flex items-center justify-between mb-2.5">
            <SectionLabel icon={<CheckSquare className="w-3.5 h-3.5" />} title="Tasks" />
            <span className="text-xs text-text-muted">
              {completedCount}/{item.tasks.length} done
            </span>
          </div>
          <TaskBoard tasks={item.tasks} onToggle={onToggleTask} />
        </div>
      )}

      {/* ── Reply Drafts ──────────────────────────────────────────────── */}
      {item.reply && (item.reply.professional || item.reply.friendly || item.reply.acknowledgement) && (
        <div className="bg-surface border-x border-b border-border rounded-b-xl px-5 py-4">
          <button
            onClick={() => setShowReply((v) => !v)}
            className="flex items-center gap-2 w-full text-left"
          >
            <SectionLabel icon={<MessageSquare className="w-3.5 h-3.5" />} title="Reply Drafts" />
            <ChevronDown
              className={cn(
                'w-3.5 h-3.5 text-text-muted ml-auto transition-transform',
                showReply && 'rotate-180'
              )}
            />
          </button>

          {showReply && (
            <div className="mt-3 animate-fade-in">
              <ReplyDrafts reply={item.reply} />
            </div>
          )}
        </div>
      )}

      {/* ── Raw content (collapsible) ──────────────────────────────────── */}
      {item.raw_content && (
        <div className="mt-1">
          <button
            onClick={() => setShowRaw((v) => !v)}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            <ChevronDown
              className={cn('w-3 h-3 transition-transform', showRaw && 'rotate-180')}
            />
            {showRaw ? 'Hide' : 'Show'} original content
          </button>
          {showRaw && (
            <div className="mt-2 bg-surface border border-border rounded-xl px-4 py-3.5 animate-fade-in">
              <pre className="text-xs text-text-muted whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
                {item.raw_content}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SectionLabel({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-text-muted">{icon}</span>
      <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">{title}</span>
    </div>
  )
}

'use client'

import { Sparkles, Trash2 } from 'lucide-react'
import { cn, urgencyDot, typeLabel, relativeTime } from '@/lib/utils'
import type { ItemListEntry } from '@/types'

interface Props {
  items: ItemListEntry[]
  selectedId?: number
  loaded: boolean
  onSelect: (id: number) => void
  onDelete: (id: number) => void
}

export default function Sidebar({ items, selectedId, loaded, onSelect, onDelete }: Props) {
  return (
    <aside className="w-64 shrink-0 flex flex-col border-r border-border bg-surface h-full overflow-hidden">
      {/* Brand */}
      <div className="px-4 py-4 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
          </div>
          <div>
            <span className="text-sm font-semibold text-text-primary tracking-tight">NextUp</span>
          </div>
        </div>
        <p className="text-[11px] text-text-muted mt-1.5 leading-snug">
          Drop in anything messy.<br />Get what matters.
        </p>
      </div>

      {/* History label */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-text-muted uppercase tracking-widest">
            History
          </span>
          {items.length > 0 && (
            <span className="text-[10px] text-text-muted tabular-nums">{items.length}</span>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {!loaded ? (
          // Loading skeletons
          <div className="space-y-1 px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-surface-active animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <p className="text-xs text-text-muted">No items yet.</p>
            <p className="text-xs text-text-muted mt-1">Analyze something to get started.</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {items.map((item) => (
              <HistoryRow
                key={item.id}
                item={item}
                isSelected={item.id === selectedId}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border shrink-0">
        <p className="text-[10px] text-text-muted">
          Powered by OpenAI · Data stays local
        </p>
      </div>
    </aside>
  )
}

function HistoryRow({
  item,
  isSelected,
  onSelect,
  onDelete,
}: {
  item: ItemListEntry
  isSelected: boolean
  onSelect: (id: number) => void
  onDelete: (id: number) => void
}) {
  return (
    <div
      className={cn(
        'group relative flex items-start gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors',
        isSelected
          ? 'bg-surface-active border border-border'
          : 'hover:bg-surface-hover border border-transparent'
      )}
      onClick={() => onSelect(item.id)}
    >
      {/* Urgency dot */}
      <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', urgencyDot(item.urgency))} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-primary truncate leading-snug">{item.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-text-muted">{typeLabel(item.type)}</span>
          <span className="text-text-muted">·</span>
          <span className="text-[10px] text-text-muted tabular-nums">
            {relativeTime(item.created_at)}
          </span>
        </div>
      </div>

      {/* Delete button (hover only) */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete(item.id)
        }}
        className="shrink-0 mt-0.5 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  )
}

'use client'

import { cn, formatDate } from '@/lib/utils'
import type { Task, Priority } from '@/types'

const PRIORITY_DOT: Record<Priority, string> = {
  high: 'bg-orange-400',
  medium: 'bg-yellow-400',
  low: 'bg-text-muted',
}

interface Props {
  tasks: Task[]
  onToggle: (id: number, completed: boolean) => void
}

export default function TaskBoard({ tasks, onToggle }: Props) {
  if (tasks.length === 0) return null

  const incomplete = tasks.filter((t) => !t.completed)
  const complete = tasks.filter((t) => t.completed)

  return (
    <div className="space-y-1.5">
      {/* Incomplete */}
      {incomplete.map((task) => (
        <TaskRow key={task.id} task={task} onToggle={onToggle} />
      ))}

      {/* Completed (dimmed) */}
      {complete.length > 0 && (
        <div className="pt-1 space-y-1.5">
          {complete.map((task) => (
            <TaskRow key={task.id} task={task} onToggle={onToggle} />
          ))}
        </div>
      )}
    </div>
  )
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: number, completed: boolean) => void }) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 px-3.5 py-2.5 rounded-lg border transition-colors',
        task.completed
          ? 'border-border-subtle bg-transparent opacity-50'
          : 'border-border bg-surface hover:border-border-strong'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className={cn(
          'mt-0.5 w-4 h-4 rounded shrink-0 border flex items-center justify-center transition-colors',
          task.completed
            ? 'bg-accent/20 border-accent/30'
            : 'border-border-strong hover:border-accent/50'
        )}
      >
        {task.completed && (
          <svg viewBox="0 0 10 8" className="w-2.5 h-2 text-accent fill-current">
            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Title */}
      <span
        className={cn(
          'flex-1 text-sm leading-snug',
          task.completed ? 'line-through text-text-muted' : 'text-text-primary'
        )}
      >
        {task.title}
      </span>

      {/* Meta */}
      <div className="flex items-center gap-2 shrink-0">
        {task.due_date && (
          <span className="text-xs text-text-muted font-mono">{formatDate(task.due_date)}</span>
        )}
        <span
          className={cn('w-1.5 h-1.5 rounded-full', PRIORITY_DOT[task.priority as Priority] ?? 'bg-text-muted')}
        />
      </div>
    </div>
  )
}

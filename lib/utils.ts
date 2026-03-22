import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { UrgencyLevel, ItemType } from '@/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diff = now - then

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function urgencyColor(level: UrgencyLevel): string {
  switch (level) {
    case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20'
    case 'high':     return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
    case 'medium':   return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    case 'low':      return 'text-green-400 bg-green-400/10 border-green-400/20'
  }
}

export function urgencyDot(level: UrgencyLevel): string {
  switch (level) {
    case 'critical': return 'bg-red-400'
    case 'high':     return 'bg-orange-400'
    case 'medium':   return 'bg-yellow-400'
    case 'low':      return 'bg-green-400'
  }
}

export function typeLabel(type: ItemType): string {
  const map: Record<ItemType, string> = {
    email: 'Email',
    notes: 'Notes',
    meeting: 'Meeting',
    assignment: 'Assignment',
    bill: 'Bill',
    document: 'Document',
    other: 'Other',
  }
  return map[type] ?? type
}

export function typeIcon(type: ItemType): string {
  const map: Record<ItemType, string> = {
    email: '✉',
    notes: '📋',
    meeting: '🗓',
    assignment: '📝',
    bill: '🧾',
    document: '📄',
    other: '📌',
  }
  return map[type] ?? '📌'
}

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

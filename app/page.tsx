'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import type { Item, ItemListEntry } from '@/types'
import Sidebar from '@/components/Sidebar'
import InputPanel from '@/components/InputPanel'
import ResultCard from '@/components/ResultCard'
import LoadingState from '@/components/LoadingState'
import WelcomeState from '@/components/WelcomeState'

export default function Home() {
  const [history, setHistory] = useState<ItemListEntry[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [historyLoaded, setHistoryLoaded] = useState(false)

  // ── Load sidebar history ─────────────────────────────────────────────────
  const refreshHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/items')
      if (!res.ok) throw new Error('Failed to load history')
      const data: ItemListEntry[] = await res.json()
      setHistory(data)
    } catch {
      // silent — history is non-critical
    } finally {
      setHistoryLoaded(true)
    }
  }, [])

  useEffect(() => {
    refreshHistory()
  }, [refreshHistory])

  // ── Select item from sidebar ─────────────────────────────────────────────
  const handleSelectItem = useCallback(async (id: number) => {
    try {
      const res = await fetch(`/api/items/${id}`)
      if (!res.ok) throw new Error('Failed to load item')
      const item: Item = await res.json()
      setSelectedItem(item)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      toast.error('Could not load that item.')
    }
  }, [])

  // ── Delete item ──────────────────────────────────────────────────────────
  const handleDeleteItem = useCallback(
    async (id: number) => {
      try {
        const res = await fetch(`/api/items/${id}`, { method: 'DELETE' })
        if (!res.ok) throw new Error()
        if (selectedItem?.id === id) setSelectedItem(null)
        await refreshHistory()
        toast.success('Item deleted.')
      } catch {
        toast.error('Could not delete item.')
      }
    },
    [selectedItem, refreshHistory]
  )

  // ── Toggle task completion ───────────────────────────────────────────────
  const handleToggleTask = useCallback(
    async (taskId: number, completed: boolean) => {
      try {
        const res = await fetch(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed }),
        })
        if (!res.ok) throw new Error()
        // Refresh selected item so task state updates
        if (selectedItem) {
          const fresh = await fetch(`/api/items/${selectedItem.id}`)
          if (fresh.ok) setSelectedItem(await fresh.json())
        }
      } catch {
        toast.error('Could not update task.')
      }
    },
    [selectedItem]
  )

  // ── Run analysis ─────────────────────────────────────────────────────────
  const handleAnalyze = useCallback(
    async (content: string, type: string, file?: File) => {
      setIsAnalyzing(true)
      setSelectedItem(null)

      const fd = new FormData()
      fd.append('type', type)
      if (file) {
        fd.append('file', file)
      } else {
        fd.append('content', content)
      }

      try {
        const res = await fetch('/api/analyze', { method: 'POST', body: fd })
        const data = await res.json()

        if (!res.ok) {
          toast.error(data.error || 'Analysis failed. Please try again.')
          return
        }

        setSelectedItem(data)
        await refreshHistory()

        if (data._mock) {
          toast('Running in demo mode — add OPENAI_API_KEY for real AI analysis.', {
            duration: 6000,
            icon: '🔮',
          })
        } else {
          toast.success('Analysis complete.')
        }
      } catch {
        toast.error('Network error. Please check your connection.')
      } finally {
        setIsAnalyzing(false)
      }
    },
    [refreshHistory]
  )

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-base text-text-primary overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        items={history}
        selectedId={selectedItem?.id}
        loaded={historyLoaded}
        onSelect={handleSelectItem}
        onDelete={handleDeleteItem}
      />

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-y-auto min-w-0">
        <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto px-6 py-8 gap-8">
          {/* Input panel — always visible */}
          <InputPanel onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

          {/* Content area */}
          {isAnalyzing ? (
            <LoadingState />
          ) : selectedItem ? (
            <ResultCard
              item={selectedItem}
              onToggleTask={handleToggleTask}
              onDelete={() => handleDeleteItem(selectedItem.id)}
            />
          ) : (
            <WelcomeState />
          )}
        </div>
      </main>
    </div>
  )
}

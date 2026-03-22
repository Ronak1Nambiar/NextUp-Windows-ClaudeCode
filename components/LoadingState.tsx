'use client'

const STEPS = [
  'Reading content…',
  'Identifying key entities…',
  'Scoring urgency…',
  'Extracting deadlines…',
  'Generating next steps…',
  'Drafting reply…',
]

export default function LoadingState() {
  return (
    <div className="animate-fade-in space-y-px">
      {/* Skeleton header */}
      <div className="bg-surface border border-border rounded-t-xl px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-3.5 w-12 bg-surface-active rounded animate-pulse" />
          <div className="h-3.5 w-16 bg-surface-active rounded animate-pulse" />
        </div>
        <div className="h-5 w-64 bg-surface-active rounded animate-pulse" />
      </div>

      {/* Skeleton summary */}
      <div className="bg-surface border-x border-b border-border px-5 py-4 space-y-2">
        <div className="h-3.5 w-full bg-surface-active rounded animate-pulse" />
        <div className="h-3.5 w-5/6 bg-surface-active rounded animate-pulse" />
        <div className="h-3.5 w-4/6 bg-surface-active rounded animate-pulse" />
      </div>

      {/* Skeleton deadlines */}
      <div className="bg-surface border-x border-b border-border px-5 py-4">
        <div className="h-3 w-20 bg-surface-active rounded animate-pulse mb-3" />
        <div className="flex gap-2">
          <div className="h-7 w-36 bg-surface-active rounded-lg animate-pulse" />
          <div className="h-7 w-28 bg-surface-active rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Skeleton tasks */}
      <div className="bg-surface border-x border-b border-border rounded-b-xl px-5 py-4 space-y-2">
        <div className="h-3 w-14 bg-surface-active rounded animate-pulse mb-3" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 w-full bg-surface-active rounded-lg animate-pulse" />
        ))}
      </div>

      {/* Processing steps */}
      <div className="pt-4 flex flex-wrap gap-x-3 gap-y-1">
        {STEPS.map((step, i) => (
          <span
            key={step}
            className="text-xs text-text-muted animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}

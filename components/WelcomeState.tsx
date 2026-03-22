'use client'

import { FileText, Mail, Calendar, Receipt, ClipboardList, Sparkles } from 'lucide-react'

const EXAMPLES = [
  { icon: Mail, label: 'Email threads', desc: 'Extract action items and deadlines' },
  { icon: ClipboardList, label: 'Meeting notes', desc: 'Surface decisions and owners' },
  { icon: Receipt, label: 'Bills & invoices', desc: 'Due dates, amounts, payment steps' },
  { icon: Calendar, label: 'Assignments', desc: 'Requirements, rubrics, milestones' },
  { icon: FileText, label: 'Any document', desc: 'PDFs, notes, itineraries' },
]

export default function WelcomeState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      {/* Icon mark */}
      <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-5">
        <Sparkles className="w-5 h-5 text-accent" />
      </div>

      <h3 className="text-base font-semibold text-text-primary mb-2">
        Drop in anything messy
      </h3>
      <p className="text-sm text-text-secondary text-center max-w-sm mb-10 leading-relaxed">
        Paste content above or upload a PDF to instantly get a summary, deadlines,
        next steps, and optional reply drafts.
      </p>

      {/* Example types */}
      <div className="w-full grid grid-cols-1 gap-2">
        {EXAMPLES.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-xl"
          >
            <div className="w-7 h-7 rounded-lg bg-surface-active border border-border flex items-center justify-center shrink-0">
              <Icon className="w-3.5 h-3.5 text-text-muted" />
            </div>
            <div>
              <p className="text-xs font-medium text-text-primary">{label}</p>
              <p className="text-xs text-text-muted">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-text-muted mt-8">
        No API key needed to try it — runs in demo mode out of the box.
      </p>
    </div>
  )
}

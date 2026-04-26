import { cn } from '@/lib/utils'
import type { ContactStatus } from '@/types'

const STATUS_STYLES: Record<ContactStatus, string> = {
  champion: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  engaged: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  neutral: 'bg-zinc-700/50 text-zinc-400 border-zinc-600/50',
  blocked: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  not_contacted: 'bg-zinc-800/80 text-zinc-500 border-zinc-700/50',
  unresponsive: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
}

const STATUS_LABELS: Record<ContactStatus, string> = {
  champion: 'Champion',
  engaged: 'Engaged',
  neutral: 'Neutral',
  blocked: 'Blocked',
  not_contacted: 'Not Contacted',
  unresponsive: 'Unresponsive',
}

export function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold font-body', STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  )
}

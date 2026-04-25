import { cn } from '@/lib/utils'
import type { ContactStatus } from '@/types'

const STATUS_STYLES: Record<ContactStatus, string> = {
  champion: 'bg-green-100 text-green-700 border-green-200',
  engaged: 'bg-blue-100 text-blue-700 border-blue-200',
  neutral: 'bg-gray-100 text-gray-600 border-gray-200',
  blocked: 'bg-red-100 text-red-700 border-red-200',
  not_contacted: 'bg-slate-100 text-slate-500 border-slate-200',
  unresponsive: 'bg-orange-100 text-orange-700 border-orange-200',
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
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium', STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </span>
  )
}

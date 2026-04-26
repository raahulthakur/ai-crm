import { cn } from '@/lib/utils'

interface Props {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function HealthScoreBadge({ score, showLabel = true, size = 'md' }: Props) {
  const { ring, text, bg, label } = score >= 80
    ? { ring: 'border-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Healthy' }
    : score >= 60
    ? { ring: 'border-amber-500/40', text: 'text-amber-400', bg: 'bg-amber-500/10', label: 'At Risk' }
    : { ring: 'border-rose-500/40', text: 'text-rose-400', bg: 'bg-rose-500/10', label: 'Critical' }

  const dotColor = score >= 80 ? 'bg-emerald-400' : score >= 60 ? 'bg-amber-400' : 'bg-rose-400'

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold',
      ring, text, bg,
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]'
        : size === 'lg' ? 'px-3 py-1 text-sm'
        : 'px-2 py-0.5 text-xs'
    )}>
      <span className={cn('inline-block rounded-full shrink-0', dotColor,
        size === 'lg' ? 'h-2 w-2' : 'h-1.5 w-1.5')} />
      {score}%
      {showLabel && <span className="font-body font-normal opacity-70 ml-0.5">{label}</span>}
    </span>
  )
}

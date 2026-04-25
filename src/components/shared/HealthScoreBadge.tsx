import { cn } from '@/lib/utils'

interface Props {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function HealthScoreBadge({ score, showLabel = true, size = 'md' }: Props) {
  const color = score >= 80 ? 'bg-green-100 text-green-700 border-green-200'
    : score >= 60 ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
    : 'bg-red-100 text-red-700 border-red-200'
  const dot = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'

  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium', color,
      size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base px-3 py-1' : 'text-sm')}>
      <span className={cn('inline-block rounded-full', dot, size === 'lg' ? 'h-2.5 w-2.5' : 'h-2 w-2')} />
      {score}%{showLabel && <span className="text-xs opacity-70">{score >= 80 ? 'Healthy' : score >= 60 ? 'At Risk' : 'Critical'}</span>}
    </span>
  )
}

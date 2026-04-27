import { cn } from '@/lib/utils'

interface Props {
  score: number
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function HealthScoreBadge({ score, showLabel = true, size = 'md' }: Props) {
  // Dark text on light background — WCAG AA compliant
  const config = score >= 80
    ? { bg: 'bg-[#ECFDF5]', text: 'text-[#065F46]', border: 'border-[#A7F3D0]', dot: 'bg-[#10B981]', label: 'Healthy' }
    : score >= 60
    ? { bg: 'bg-[#FEF3C7]', text: 'text-[#92400E]', border: 'border-[#FDE68A]', dot: 'bg-[#F59E0B]', label: 'At Risk' }
    : { bg: 'bg-[#FEE2E2]', text: 'text-[#991B1B]', border: 'border-[#FECACA]', dot: 'bg-[#EF4444]',  label: 'Critical' }

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold',
      config.bg, config.text, config.border,
      size === 'sm' ? 'px-1.5 py-0.5 text-[10px]'
        : size === 'lg' ? 'px-3 py-1 text-sm'
        : 'px-2 py-0.5 text-xs'
    )}>
      <span className={cn('inline-block rounded-full shrink-0', config.dot,
        size === 'lg' ? 'h-2 w-2' : 'h-1.5 w-1.5')} />
      {score}%
      {showLabel && <span className="font-body font-semibold opacity-90 ml-0.5 text-[10px]">{config.label}</span>}
    </span>
  )
}

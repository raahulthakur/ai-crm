import { getInitials, cn } from '@/lib/utils'

const COLORS = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-green-100 text-green-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
]

interface Props {
  name: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ name, size = 'md', className }: Props) {
  const colorIdx = name.charCodeAt(0) % COLORS.length
  const sizeClass = size === 'sm' ? 'h-7 w-7 text-xs' : size === 'lg' ? 'h-10 w-10 text-sm' : size === 'xl' ? 'h-12 w-12 text-base' : 'h-8 w-8 text-xs'
  return (
    <div className={cn('flex items-center justify-center rounded-full font-semibold', COLORS[colorIdx], sizeClass, className)}>
      {getInitials(name)}
    </div>
  )
}

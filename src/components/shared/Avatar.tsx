import { getInitials, cn } from '@/lib/utils'

const PALETTES = [
  'bg-blue-500/20 text-blue-300',
  'bg-violet-500/20 text-violet-300',
  'bg-emerald-500/20 text-emerald-300',
  'bg-amber-500/20 text-amber-300',
  'bg-rose-500/20 text-rose-300',
]

interface Props {
  name: string
  imageUrl?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Avatar({ name, imageUrl, size = 'md', className }: Props) {
  const idx = name.charCodeAt(0) % PALETTES.length
  const sizeClass = size === 'sm' ? 'h-7 w-7 text-[10px]'
    : size === 'lg' ? 'h-9 w-9 text-xs'
    : size === 'xl' ? 'h-11 w-11 text-sm'
    : 'h-8 w-8 text-[10px]'

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn('rounded-full object-cover shrink-0 border border-white/10', sizeClass, className)}
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    )
  }

  return (
    <div className={cn('flex items-center justify-center rounded-full font-display font-semibold shrink-0 border border-white/10', PALETTES[idx], sizeClass, className)}>
      {getInitials(name)}
    </div>
  )
}

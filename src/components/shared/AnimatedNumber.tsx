import { useEffect, useRef, useState } from 'react'

interface Props {
  from: number
  to: number
  duration?: number
  className?: string
  suffix?: string
}

export function AnimatedNumber({ from, to, duration = 1500, className, suffix = '' }: Props) {
  const [value, setValue] = useState(from)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    startRef.current = null
    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp
      const progress = Math.min((timestamp - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + (to - from) * eased))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [from, to, duration])

  return <span className={className}>{value}{suffix}</span>
}

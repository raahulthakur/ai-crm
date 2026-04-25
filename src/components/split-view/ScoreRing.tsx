import { useEffect, useRef, useState } from 'react'

interface Props {
  from: number
  to: number
  size?: number
}

export function ScoreRing({ from, to, size = 120 }: Props) {
  const [current, setCurrent] = useState(from)
  const duration = 1500
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)

  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (current / 100) * circumference

  const color = current >= 80 ? '#22c55e' : current >= 60 ? '#eab308' : '#ef4444'

  useEffect(() => {
    startRef.current = null
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const p = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCurrent(Math.round(from + (to - from) * eased))
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [from, to])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={10} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-gray-900">{current}%</span>
        <span className="text-[10px] text-gray-500">Health</span>
      </div>
    </div>
  )
}

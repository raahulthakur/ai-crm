import { useEffect, useRef, useState } from 'react'

interface Props { from: number; to: number; size?: number }

export function ScoreRing({ from, to, size = 120 }: Props) {
  const [current, setCurrent] = useState(from)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number>(0)
  const radius = (size - 20) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (current / 100) * circumference

  const stroke = current >= 80 ? '#34D399' : current >= 60 ? '#FBBF24' : '#FB7185'
  const glowColor = current >= 80 ? 'rgba(52,211,153,0.3)' : current >= 60 ? 'rgba(251,191,36,0.3)' : 'rgba(251,113,133,0.3)'

  useEffect(() => {
    startRef.current = null
    const step = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const p = Math.min((ts - startRef.current) / 1600, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCurrent(Math.round(from + (to - from) * eased))
      if (p < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [from, to])

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ filter: `drop-shadow(0 0 8px ${glowColor})` }}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#27272F" strokeWidth={10} />
        {/* Progress */}
        <circle
          cx={size/2} cy={size/2} r={radius}
          fill="none" stroke={stroke} strokeWidth={10}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: 'stroke-dashoffset 0.04s linear, stroke 0.4s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-2xl font-bold" style={{ color: stroke }}>{current}%</span>
        <span className="text-[10px] text-[#475569] uppercase tracking-wider">Health</span>
      </div>
    </div>
  )
}

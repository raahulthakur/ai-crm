const BARS = [
  { duration: '0.6s', delay: '0s',    minH: 4,  maxH: 18 },
  { duration: '0.8s', delay: '0.1s',  minH: 4,  maxH: 26 },
  { duration: '0.5s', delay: '0.05s', minH: 4,  maxH: 22 },
  { duration: '0.9s', delay: '0.2s',  minH: 4,  maxH: 30 },
  { duration: '0.7s', delay: '0.15s', minH: 4,  maxH: 24 },
  { duration: '1.0s', delay: '0.25s', minH: 4,  maxH: 20 },
  { duration: '0.65s', delay: '0.08s', minH: 4, maxH: 28 },
]

export function WaveformAnimation() {
  return (
    <div className="flex items-center gap-[3px] h-8 px-1">
      {BARS.map((bar, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-amber-400"
          style={{
            animationName: 'waveform-bar',
            animationDuration: bar.duration,
            animationDelay: bar.delay,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            height: `${bar.minH}px`,
          }}
        />
      ))}
    </div>
  )
}

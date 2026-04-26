import { AlertTriangle, Star, Shield, Clock, TrendingUp, X, RefreshCw } from 'lucide-react'
import { useAIStore } from '@/store'
import { cn } from '@/lib/utils'
import type { InsightCategory } from '@/types'

const CATEGORY_CONFIG: Record<InsightCategory, { icon: typeof AlertTriangle; accent: string; border: string; bg: string }> = {
  risk:         { icon: AlertTriangle, accent: 'text-rose-400',    border: 'border-l-rose-500/60',   bg: 'bg-rose-500/5' },
  opportunity:  { icon: Star,          accent: 'text-emerald-400', border: 'border-l-emerald-500/60', bg: 'bg-emerald-500/5' },
  compliance:   { icon: Shield,        accent: 'text-blue-400',    border: 'border-l-blue-500/60',   bg: 'bg-blue-500/5' },
  relationship: { icon: TrendingUp,    accent: 'text-violet-400',  border: 'border-l-violet-500/60', bg: 'bg-violet-500/5' },
  timeline:     { icon: Clock,         accent: 'text-amber-400',   border: 'border-l-amber-500/60',  bg: 'bg-amber-500/5' },
  competitive:  { icon: TrendingUp,    accent: 'text-zinc-400',    border: 'border-l-zinc-600/60',   bg: 'bg-zinc-800/40' },
}

export function AIInsightsPanel() {
  const { insights, dismissInsight, isLoadingInsights, setLoadingInsights } = useAIStore()
  const active = insights.filter((i) => !i.is_dismissed)

  async function handleRegenerate() {
    setLoadingInsights(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoadingInsights(false)
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">AI Insights</h3>
        <button onClick={handleRegenerate}
          className="flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors">
          <RefreshCw className={cn('h-3 w-3', isLoadingInsights && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {isLoadingInsights ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-zinc-800/50 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {active.map((insight) => {
            const { icon: Icon, accent, border, bg } = CATEGORY_CONFIG[insight.category]
            return (
              <div key={insight.id}
                className={cn('group relative rounded-lg border border-zinc-800 border-l-2 p-3 transition-all animate-fade-in', border, bg)}>
                <button onClick={() => dismissInsight(insight.id)}
                  className="absolute right-2 top-2 text-zinc-700 hover:text-zinc-400 transition-colors opacity-0 group-hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
                <div className="flex items-start gap-2 pr-4">
                  <Icon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', accent)} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-100">{insight.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-500">{insight.body}</p>
                    {!insight.hide_confidence && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-0.5 w-14 rounded-full bg-zinc-800">
                          <div className={cn('h-0.5 rounded-full', accent.replace('text-', 'bg-'))}
                            style={{ width: `${insight.confidence}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-zinc-600">{insight.confidence}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

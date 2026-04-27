import { AlertTriangle, Star, Shield, Clock, TrendingUp, X, RefreshCw } from 'lucide-react'
import { useAIStore } from '@/store'
import { cn } from '@/lib/utils'
import type { InsightCategory } from '@/types'

// Design system colors
const CATEGORY_CONFIG: Record<InsightCategory, {
  icon: typeof AlertTriangle
  accent: string
  borderColor: string
  bgColor: string
}> = {
  risk:         { icon: AlertTriangle, accent: 'text-[#DC2626]', borderColor: '#EF4444', bgColor: '#FEE2E2' },
  opportunity:  { icon: Star,          accent: 'text-[#059669]', borderColor: '#059669', bgColor: '#ECFDF5' },
  compliance:   { icon: Shield,        accent: 'text-[#D97706]', borderColor: '#F59E0B', bgColor: '#FEF3C7' },
  relationship: { icon: TrendingUp,    accent: 'text-[#059669]', borderColor: '#10B981', bgColor: '#ECFDF5' },
  timeline:     { icon: Clock,         accent: 'text-[#D97706]', borderColor: '#F59E0B', bgColor: '#FEF3C7' },
  competitive:  { icon: TrendingUp,    accent: 'text-[#6B7280]', borderColor: '#E5E7EB', bgColor: '#F3F4F6' },
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
        <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">AI Insights</h3>
        <button onClick={handleRegenerate}
          className="flex items-center gap-1 text-[11px] text-[#059669] hover:text-[#047857] transition-colors">
          <RefreshCw className={cn('h-3 w-3', isLoadingInsights && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {isLoadingInsights ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {active.map((insight) => {
            const cfg = CATEGORY_CONFIG[insight.category]
            const Icon = cfg.icon
            return (
              <div key={insight.id}
                className="group relative rounded-xl border-l-2 p-3 transition-all animate-fade-in"
                style={{ borderLeftColor: cfg.borderColor, backgroundColor: cfg.bgColor, borderColor: '#E5E7EB', borderStyle: 'solid' }}>
                <button onClick={() => dismissInsight(insight.id)}
                  className="absolute right-2 top-2 text-[#475569] hover:text-[#0F172A] transition-colors opacity-0 group-hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
                <div className="flex items-start gap-2 pr-4">
                  <Icon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', cfg.accent)} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1F2937]">{insight.title}</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-[#4B5563]">{insight.body}</p>
                    {!insight.hide_confidence && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-0.5 w-14 rounded-full bg-gray-200">
                          <div className="h-0.5 rounded-full"
                            style={{ width: `${insight.confidence}%`, backgroundColor: cfg.borderColor }} />
                        </div>
                        <span className="font-mono text-[10px] text-[#6B7280]">{insight.confidence}%</span>
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

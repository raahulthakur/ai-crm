import { AlertTriangle, Star, Shield, Clock, TrendingUp, X, RefreshCw } from 'lucide-react'
import { useAIStore } from '@/store'
import { cn } from '@/lib/utils'
import type { InsightCategory } from '@/types'

const CATEGORY_CONFIG: Record<InsightCategory, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  risk: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50' },
  opportunity: { icon: Star, color: 'text-green-500', bg: 'bg-green-50' },
  compliance: { icon: Shield, color: 'text-blue-500', bg: 'bg-blue-50' },
  relationship: { icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
  timeline: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
  competitive: { icon: TrendingUp, color: 'text-gray-500', bg: 'bg-gray-50' },
}

export function AIInsightsPanel() {
  const { insights, dismissInsight, isLoadingInsights, setLoadingInsights } = useAIStore()
  const activeInsights = insights.filter((i) => !i.is_dismissed)

  async function handleRegenerate() {
    setLoadingInsights(true)
    await new Promise((r) => setTimeout(r, 1500))
    setLoadingInsights(false)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">AI Insights</h3>
        <button onClick={handleRegenerate} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700">
          <RefreshCw className={cn('h-3 w-3', isLoadingInsights && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {isLoadingInsights ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {activeInsights.map((insight) => {
            const config = CATEGORY_CONFIG[insight.category]
            const Icon = config.icon
            return (
              <div key={insight.id} className={cn('relative rounded-lg border border-gray-100 p-3', config.bg, 'animate-fade-in')}>
                <button onClick={() => dismissInsight(insight.id)}
                  className="absolute right-2 top-2 text-gray-400 hover:text-gray-600">
                  <X className="h-3 w-3" />
                </button>
                <div className="flex items-start gap-2 pr-4">
                  <Icon className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', config.color)} />
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{insight.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-gray-600">{insight.body}</p>
                    {!insight.hide_confidence && (
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1 w-16 rounded-full bg-gray-200">
                          <div className="h-1 rounded-full bg-blue-500" style={{ width: `${insight.confidence}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-500">{insight.confidence}% confidence</span>
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

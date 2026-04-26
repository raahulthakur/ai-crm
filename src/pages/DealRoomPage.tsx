import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useDealStore } from '@/store'
import { OrgChartCanvas } from '@/components/org-chart/OrgChartCanvas'
import { AIInsightsPanel } from '@/components/deal-room/AIInsightsPanel'
import { RecommendedActions } from '@/components/deal-room/RecommendedActions'
import { ActivityTimeline } from '@/components/deal-room/ActivityTimeline'
import { WhatsAppModal } from '@/components/whatsapp/WhatsAppModal'
import { HealthScoreBadge } from '@/components/shared/HealthScoreBadge'
import { formatCurrency } from '@/lib/utils'
import { dealContacts } from '@/data/mockData'

const DELTA_TOOLTIPS: Record<string, string> = {
  '-4': 'CFO hasn\'t responded since 12 days',
}

export function DealRoomPage() {
  const { id } = useParams<{ id: string }>()
  const { deals, activeDeal, setActiveDeal } = useDealStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!activeDeal) {
      const deal = deals.find((d) => d.id === id)
      if (deal) setActiveDeal(deal)
    }
  }, [id])

  const deal = activeDeal ?? deals.find((d) => d.id === id)
  if (!deal) return <div className="p-8 text-zinc-600">Deal not found</div>

  const scoreDelta = deal.health_score_prev != null ? deal.health_score - deal.health_score_prev : null
  const deltaKey = scoreDelta != null ? String(scoreDelta) : ''
  const deltaTooltip = DELTA_TOOLTIPS[deltaKey] ?? (scoreDelta != null && scoreDelta < 0 ? 'Score dropped recently' : undefined)
  const myContacts = dealContacts.filter((dc) => dc.deal_id === deal.id)

  return (
    <div className="flex h-full flex-col overflow-hidden bg-zinc-950">
      {/* Deal header */}
      <div className="flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/70 px-5 py-3 backdrop-blur-sm">
        <button onClick={() => navigate('/deals')}
          className="rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-800 hover:text-zinc-300">
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {deal.is_stuck && <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-rose-400" />}
              <h2 className="font-display text-sm font-700 tracking-tight text-zinc-50 truncate">{deal.company_name}</h2>
              <span className="text-zinc-700">·</span>
              <span className="font-mono text-sm font-semibold text-amber-400 shrink-0">{formatCurrency(deal.arr_value)} ARR</span>
            </div>
            {deal.stuck_reason && (
              <p className="text-xs text-rose-400/80 mt-0.5">{deal.stuck_reason}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <HealthScoreBadge score={deal.health_score} />
            {scoreDelta != null && (
              <div className="group relative">
                <span className={`flex cursor-help items-center gap-0.5 font-mono text-xs font-semibold underline decoration-dotted underline-offset-2 ${scoreDelta >= 0 ? 'text-emerald-400 decoration-emerald-400/40' : 'text-rose-400 decoration-rose-400/40'}`}>
                  {scoreDelta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {scoreDelta > 0 ? '+' : ''}{scoreDelta}%
                </span>
                {deltaTooltip && (
                  <div className="pointer-events-none invisible absolute top-full right-0 z-50 mt-2 w-52 rounded-lg border border-zinc-700 bg-zinc-900 px-2.5 py-2 text-[11px] text-zinc-300 shadow-xl group-hover:visible">
                    <p className="font-semibold text-rose-400 mb-0.5">Why did it drop?</p>
                    {deltaTooltip}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-[54%] flex-col border-r border-zinc-800 overflow-hidden">
          <div className="border-b border-zinc-800 bg-zinc-900/30 px-4 py-2">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">Buying Committee</h3>
          </div>
          <div className="flex-1">
            <OrgChartCanvas dealContacts={myContacts} />
          </div>
        </div>

        <div className="flex w-[46%] flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-5">
              <AIInsightsPanel />
              <div className="border-t border-zinc-800 pt-4">
                <RecommendedActions />
              </div>
              <div className="border-t border-zinc-800 pt-4 pb-2">
                <ActivityTimeline />
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppModal />
    </div>
  )
}

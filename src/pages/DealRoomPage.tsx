import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingDown, TrendingUp, AlertTriangle } from 'lucide-react'
import { useDealStore } from '@/store'
import { OrgChartCanvas } from '@/components/org-chart/OrgChartCanvas'
import { AIInsightsPanel } from '@/components/deal-room/AIInsightsPanel'
import { RecommendedActions } from '@/components/deal-room/RecommendedActions'
import { ActivityTimeline } from '@/components/deal-room/ActivityTimeline'
import { WhatsAppModal } from '@/components/whatsapp/WhatsAppModal'
import { HealthScoreBadge } from '@/components/shared/HealthScoreBadge'
import { formatCurrency } from '@/lib/utils'
import { dealContacts } from '@/data/mockData'

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
  if (!deal) return <div className="p-8 text-gray-500">Deal not found</div>

  const scoreDelta = deal.health_score_prev ? deal.health_score - deal.health_score_prev : null
  const myDealContacts = dealContacts.filter((dc) => dc.deal_id === deal.id)

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Deal header */}
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-3">
        <button onClick={() => navigate('/deals')} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600">
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {deal.is_stuck && <AlertTriangle className="h-4 w-4 text-yellow-500 shrink-0" />}
              <h2 className="text-sm font-semibold text-gray-900 truncate">{deal.company_name}</h2>
              <span className="text-gray-300">·</span>
              <span className="text-sm font-semibold text-gray-800">{formatCurrency(deal.arr_value)} ARR</span>
            </div>
            {deal.stuck_reason && <p className="text-xs text-yellow-600 mt-0.5">{deal.stuck_reason}</p>}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <HealthScoreBadge score={deal.health_score} size="md" />
            {scoreDelta !== null && (
              <span className={`flex items-center gap-0.5 text-xs font-medium ${scoreDelta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                {scoreDelta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {scoreDelta > 0 ? '+' : ''}{scoreDelta}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main layout: left org chart, right panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* Org Chart */}
        <div className="flex flex-col w-[55%] border-r border-gray-200 overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50 px-4 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Buying Committee</h3>
          </div>
          <div className="flex-1">
            <OrgChartCanvas dealContacts={myDealContacts} />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex w-[45%] flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            <AIInsightsPanel />
            <div className="border-t border-gray-100 pt-4">
              <RecommendedActions />
            </div>
            <div className="border-t border-gray-100 pt-4">
              <ActivityTimeline />
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppModal />
    </div>
  )
}

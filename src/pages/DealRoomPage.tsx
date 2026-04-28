import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'
import { useDealStore } from '@/store'
import { OrgChartCanvas } from '@/components/org-chart/OrgChartCanvas'
import { ContactModal } from '@/components/org-chart/ContactModal'
import { AIInsightsPanel } from '@/components/deal-room/AIInsightsPanel'
import { RecommendedActions } from '@/components/deal-room/RecommendedActions'
import { ActivityTimeline } from '@/components/deal-room/ActivityTimeline'
import { WhatsAppModal } from '@/components/whatsapp/WhatsAppModal'
import { HealthScoreBadge } from '@/components/shared/HealthScoreBadge'
import { formatCurrency } from '@/lib/utils'
import { dealContacts } from '@/data/mockData'
import type { DealContact } from '@/types'

// Reasons for score changes — positive and negative
const DELTA_TOOLTIPS: Record<string, { label: string; reason: string }> = {
  '-4':  { label: 'Why did it drop?',     reason: 'CFO hasn\'t responded in 12 days — engagement score penalty applied.' },
  '22':  { label: 'Why did it jump?',     reason: 'CFO Rahul Mehta approved the budget — primary financial blocker removed.' },
  '+22': { label: 'Why did it jump?',     reason: 'CFO Rahul Mehta approved the budget — primary financial blocker removed.' },
}

export function DealRoomPage() {
  const { id } = useParams<{ id: string }>()
  const { deals, activeDeal, setActiveDeal } = useDealStore()
  const navigate = useNavigate()
  const [selectedContact, setSelectedContact] = useState<DealContact | null>(null)

  useEffect(() => {
    if (!activeDeal) {
      const deal = deals.find((d) => d.id === id)
      if (deal) setActiveDeal(deal)
    }
  }, [id])

  const deal = activeDeal ?? deals.find((d) => d.id === id)
  if (!deal) return <div className="p-8 text-[#475569]">Deal not found</div>

  const scoreDelta = deal.health_score_prev != null ? deal.health_score - deal.health_score_prev : null
  const deltaKey = scoreDelta != null ? String(scoreDelta) : ''
  const deltaInfo = DELTA_TOOLTIPS[deltaKey] ?? DELTA_TOOLTIPS[`+${deltaKey}`]
  const myContacts = dealContacts.filter((dc) => dc.deal_id === deal.id)

  return (
    <div className="flex h-full flex-col overflow-hidden bg-zinc-950">
      {/* Deal header */}
      <div className="flex items-center gap-3 border-b border-[#E5E7EB] bg-white px-5 py-3">
        <button onClick={() => navigate('/deals')}
          className="rounded-lg p-1.5 text-[#475569] transition-colors hover:bg-zinc-800 hover:text-[#0F172A]">
          <ArrowLeft className="h-4 w-4" />
        </button>

        <div className="flex flex-1 items-center gap-3 min-w-0">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              {deal.is_stuck && <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-700" />}
              <h2 className="font-display text-sm font-700 tracking-tight text-[#0F172A] truncate">{deal.company_name}</h2>
              <span className="text-[#CBD5E1]">·</span>
              <span className="font-mono text-sm font-semibold text-amber-400 shrink-0">{formatCurrency(deal.arr_value)} ARR</span>
            </div>
            {deal.stuck_reason && (
              <p className="text-xs text-red-700 mt-0.5">{deal.stuck_reason}</p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <HealthScoreBadge score={deal.health_score} />

            {scoreDelta != null && (
              <div className="group relative">
                <span className={`flex cursor-help items-center gap-0.5 font-mono text-xs font-semibold underline decoration-dotted underline-offset-2 ${
                  scoreDelta >= 0 ? 'text-emerald-400 decoration-emerald-400/40' : 'text-rose-400 decoration-rose-400/40'
                }`}>
                  {scoreDelta >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {scoreDelta > 0 ? '+' : ''}{scoreDelta}%
                </span>

                {/* Tooltip below */}
                {deltaInfo && (
                  <div className="pointer-events-none invisible absolute top-full right-0 z-[200] mt-2 w-60 rounded-xl border border-[#374151] bg-[#1F2937] px-3 py-2.5 shadow-2xl group-hover:visible animate-fade-in">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${scoreDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {deltaInfo.label}
                    </p>
                    <p className="text-[11px] text-[#D1D5DB] leading-relaxed">{deltaInfo.reason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Org chart */}
        <div className="flex w-[54%] flex-col border-r border-[#E5E7EB] overflow-hidden">
          <div className="border-b border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2 flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Buying Committee</h3>
            <span className="text-[10px] text-[#94A3B8]">Click a contact for details</span>
          </div>
          <div className="flex-1">
            <OrgChartCanvas dealContacts={myContacts} onContactSelect={setSelectedContact} />
          </div>
        </div>

        {/* Right panel */}
        <div className="flex w-[46%] flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-5">
              <AIInsightsPanel />
              <div className="border-t border-[#E5E7EB] pt-4">
                <RecommendedActions />
              </div>
              <div className="border-t border-[#E5E7EB] pt-4 pb-2">
                <ActivityTimeline />
              </div>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppModal />

      {/* Contact detail modal */}
      {selectedContact && (
        <ContactModal dc={selectedContact} onClose={() => setSelectedContact(null)} />
      )}
    </div>
  )
}

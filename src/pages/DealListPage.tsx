import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock, ChevronRight, Plus, X, Search, TrendingDown } from 'lucide-react'
import { useDealStore } from '@/store'
import { HealthScoreBadge } from '@/components/shared/HealthScoreBadge'
import { formatCurrency, timeAgo } from '@/lib/utils'
import type { Deal, DealStage } from '@/types'

const STAGE_LABELS: Record<string, string> = {
  prospecting: 'Prospecting', qualification: 'Discovery', proposal: 'Proposal Sent',
  negotiation: 'Negotiation', closed_won: 'Closed Won', closed_lost: 'Closed Lost',
}
const ALL_STAGES: DealStage[] = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost']
interface Filters { arrGt: string; stage: string; health: 'all' | 'healthy' | 'unhealthy' }
interface NewDealForm { company: string; arr: string; stage: DealStage }

export function DealListPage() {
  const { deals, setActiveDeal, addDeal } = useDealStore()
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Filters>({ arrGt: '', stage: 'all', health: 'all' })
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<NewDealForm>({ company: '', arr: '', stage: 'qualification' })

  function handleOpen(deal: Deal) { setActiveDeal(deal); navigate(`/deals/${deal.id}`) }

  const hasFilters = filters.arrGt !== '' || filters.stage !== 'all' || filters.health !== 'all'

  const filtered = deals.filter((d) => {
    if (filters.arrGt !== '') { const t = parseFloat(filters.arrGt) * 1000; if (!isNaN(t) && d.arr_value <= t) return false }
    if (filters.stage !== 'all' && d.stage !== filters.stage) return false
    if (filters.health === 'healthy' && d.health_score < 80) return false
    if (filters.health === 'unhealthy' && d.health_score >= 80) return false
    return true
  })

  const stuck = filtered.filter((d) => d.is_stuck)

  function handleCreateDeal(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company.trim()) return
    const newDeal: Deal = {
      id: crypto.randomUUID(), name: `${form.company.trim()} - New`, company_name: form.company.trim(),
      arr_value: (parseFloat(form.arr) || 30) * 1000, stage: form.stage,
      health_score: Math.floor(Math.random() * 41) + 50, days_in_stage: 0,
      owner_name: 'Rahul Thakur', is_stuck: false,
      created_at: new Date().toISOString(),
      updated_at: new Date(Date.now() - Math.floor(Math.random() * 45 + 1) * 86400000).toISOString(),
    }
    addDeal(newDeal)
    setModalOpen(false)
    setForm({ company: '', arr: '', stage: 'qualification' })
  }

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-xl font-700 tracking-tight text-zinc-50">All Deals</h2>
          <div className="mt-1 flex items-center gap-2 text-sm flex-wrap">
            <span className="text-[#64748B] text-xs font-medium">Total value</span>
            <span className="font-mono text-amber-400 font-bold">{formatCurrency(filtered.reduce((s, d) => s + d.arr_value, 0))}</span>
            <span className="text-zinc-700 mx-1">·</span>
            <span className="text-[#64748B] text-xs font-medium">Total deals</span>
            <span className="font-mono text-zinc-300 font-bold">{filtered.length} deal{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
        <button onClick={() => setModalOpen(true)} className="btn-amber">
          <Plus className="h-3.5 w-3.5" /> New Deal
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-700/60 bg-zinc-900 px-3 py-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#475569]">ARR &gt;</span>
          <span className="text-xs text-[#475569]">$</span>
          <input type="number" min={0} placeholder="0" value={filters.arrGt}
            onChange={(e) => setFilters((f) => ({ ...f, arrGt: e.target.value }))}
            className="w-12 bg-transparent text-xs text-zinc-200 outline-none placeholder-zinc-700 font-mono" />
          <span className="text-xs text-[#475569]">K</span>
        </div>
        <select value={filters.stage} onChange={(e) => setFilters((f) => ({ ...f, stage: e.target.value }))}
          className="rounded-lg border border-zinc-700/60 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer appearance-none">
          <option value="all">All Stages</option>
          {ALL_STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
        </select>
        <select value={filters.health} onChange={(e) => setFilters((f) => ({ ...f, health: e.target.value as Filters['health'] }))}
          className="rounded-lg border border-zinc-700/60 bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer appearance-none">
          <option value="all">All Health</option>
          <option value="healthy">Healthy ≥80%</option>
          <option value="unhealthy">At Risk &lt;80%</option>
        </select>
        {hasFilters && (
          <button onClick={() => setFilters({ arrGt: '', stage: 'all', health: 'all' })}
            className="flex items-center gap-1 rounded-lg border border-zinc-700/60 bg-zinc-900 px-2.5 py-1.5 text-xs text-[#64748B] hover:text-[#0F172A] transition-colors">
            <X className="h-3 w-3" /> Clear
          </button>
        )}
        {hasFilters && filtered.length === 0 && (
          <span className="flex items-center gap-1 text-xs text-[#475569]"><Search className="h-3 w-3" /> No matches</span>
        )}
      </div>

      {/* Stuck deals — red warning */}
      {stuck.length > 0 && (
        <div className="rounded-xl border border-[#EF4444]/30 bg-[#FEE2E2] p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="h-4 w-4 text-[#DC2626]" />
            <span className="font-display text-sm font-600 text-[#DC2626]">{stuck.length} deal{stuck.length > 1 ? 's' : ''} need attention</span>
          </div>
          <div className="space-y-2">
            {stuck.map((d) => <StuckDealRow key={d.id} deal={d} onOpen={handleOpen} />)}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-zinc-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              {['Company', 'ARR', 'Stage', 'Health', 'Activity', ''].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-[#475569]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-zinc-950 divide-y divide-zinc-900">
            {filtered.map((deal) => (
              <tr key={deal.id} className="cursor-pointer transition-colors hover:bg-zinc-900/70 group" onClick={() => handleOpen(deal)}>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    {deal.is_stuck && <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-[#EF4444]" />}
                    <div>
                      <p className="text-sm font-semibold text-zinc-100">{deal.company_name}</p>
                      {deal.stuck_reason && <p className="text-xs text-[#EF4444] truncate max-w-[180px]">{deal.stuck_reason}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5"><span className="font-mono text-sm font-semibold text-amber-400">{formatCurrency(deal.arr_value)}</span></td>
                <td className="px-4 py-3.5">
                  <span className="rounded-full border border-zinc-700/50 bg-zinc-800/60 px-2 py-0.5 text-[10px] font-medium text-zinc-400">{STAGE_LABELS[deal.stage]}</span>
                </td>
                <td className="px-4 py-3.5"><HealthScoreBadge score={deal.health_score} /></td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1 text-[11px] text-[#475569]"><Clock className="h-3 w-3" />{timeAgo(deal.updated_at)}</div>
                </td>
                <td className="px-4 py-3.5">
                  <button onClick={(e) => { e.stopPropagation(); handleOpen(deal) }}
                    className="btn-ghost opacity-0 group-hover:opacity-100 transition-opacity">
                    View <ChevronRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="py-16 text-center text-sm text-zinc-700 bg-zinc-950">No deals match the current filters.</div>}
      </div>

      {/* New Deal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl border border-zinc-700/50 bg-zinc-900 shadow-2xl animate-bounce-in">
            <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
              <div>
                <p className="font-display text-sm font-600 text-zinc-50">New Deal</p>
                <p className="text-[11px] text-[#64748B] mt-0.5">Add a company to your pipeline</p>
              </div>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-[#475569] hover:text-[#0F172A] transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleCreateDeal} className="px-5 py-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Company Name *</label>
                <input type="text" required placeholder="e.g. Acme Corp" value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-100 placeholder-[#94A3B8] outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/30 transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-400 uppercase tracking-wider">ARR ($K)</label>
                  <div className="flex items-center gap-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 focus-within:border-amber-400/60 transition-colors">
                    <span className="text-xs font-mono text-[#475569]">$</span>
                    <input type="number" min={1} placeholder="50" value={form.arr}
                      onChange={(e) => setForm((f) => ({ ...f, arr: e.target.value }))}
                      className="w-full bg-transparent text-sm text-zinc-100 font-mono outline-none placeholder-zinc-700" />
                    <span className="text-xs font-mono text-[#475569]">K</span>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-zinc-400 uppercase tracking-wider">Stage</label>
                  <select value={form.stage} onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as DealStage }))}
                    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2.5 text-sm text-zinc-300 outline-none focus:border-amber-400/60 cursor-pointer appearance-none">
                    {ALL_STAGES.map((s) => <option key={s} value={s}>{STAGE_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-lg border border-zinc-700 py-2.5 text-sm font-medium text-[#64748B] hover:border-zinc-600 hover:text-[#0F172A] transition-colors">Cancel</button>
                <button type="submit" className="flex-1 btn-amber justify-center py-2.5 text-sm">Add Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function StuckDealRow({ deal, onOpen }: { deal: Deal; onOpen: (d: Deal) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-semibold text-sm text-zinc-100 truncate">{deal.company_name}</span>
        <span className="font-mono text-xs font-semibold text-amber-400 shrink-0">{formatCurrency(deal.arr_value)}</span>
        <HealthScoreBadge score={deal.health_score} size="sm" showLabel={false} />
        <span className="text-xs text-[#EF4444] truncate hidden sm:block">{deal.stuck_reason}</span>
      </div>
      <button onClick={() => onOpen(deal)} className="btn-amber shrink-0 ml-3">
        View Room <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  )
}

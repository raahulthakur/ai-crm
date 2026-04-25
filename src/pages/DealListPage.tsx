import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Clock, ChevronRight, Plus, X, Search } from 'lucide-react'
import { useDealStore } from '@/store'
import { HealthScoreBadge } from '@/components/shared/HealthScoreBadge'
import { formatCurrency, timeAgo } from '@/lib/utils'
import type { Deal, DealStage } from '@/types'

const STAGE_LABELS: Record<string, string> = {
  prospecting: 'Prospecting',
  qualification: 'Discovery',
  proposal: 'Proposal Sent',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
  closed_lost: 'Closed Lost',
}

const ALL_STAGES: DealStage[] = ['prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost']

interface Filters {
  arrGt: string
  stage: string
  health: 'all' | 'healthy' | 'unhealthy'
}

interface NewDealForm {
  company: string
  arr: string
  stage: DealStage
}

export function DealListPage() {
  const { deals, setActiveDeal, addDeal } = useDealStore()
  const navigate = useNavigate()

  // Filter state
  const [filters, setFilters] = useState<Filters>({ arrGt: '', stage: 'all', health: 'all' })

  // New deal modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState<NewDealForm>({ company: '', arr: '', stage: 'qualification' })

  function handleOpen(deal: Deal) {
    setActiveDeal(deal)
    navigate(`/deals/${deal.id}`)
  }

  function clearFilters() {
    setFilters({ arrGt: '', stage: 'all', health: 'all' })
  }

  const hasFilters = filters.arrGt !== '' || filters.stage !== 'all' || filters.health !== 'all'

  function applyFilters(list: Deal[]) {
    return list.filter((d) => {
      if (filters.arrGt !== '') {
        const threshold = parseFloat(filters.arrGt) * 1000
        if (!isNaN(threshold) && d.arr_value <= threshold) return false
      }
      if (filters.stage !== 'all' && d.stage !== filters.stage) return false
      if (filters.health === 'healthy' && d.health_score < 80) return false
      if (filters.health === 'unhealthy' && d.health_score >= 80) return false
      return true
    })
  }

  const filtered = applyFilters(deals)
  const stuck = filtered.filter((d) => d.is_stuck)

  function handleCreateDeal(e: React.FormEvent) {
    e.preventDefault()
    if (!form.company.trim()) return
    const arrVal = parseFloat(form.arr) * 1000 || 30000
    const newDeal: Deal = {
      id: crypto.randomUUID(),
      name: `${form.company.trim()} - New`,
      company_name: form.company.trim(),
      arr_value: arrVal,
      stage: form.stage,
      health_score: Math.floor(Math.random() * 41) + 50,
      days_in_stage: 0,
      owner_name: 'Rahul Thakur',
      is_stuck: false,
      created_at: new Date().toISOString(),
      updated_at: new Date(Date.now() - Math.floor(Math.random() * 7 + 1) * 86400000).toISOString(),
    }
    addDeal(newDeal)
    setModalOpen(false)
    setForm({ company: '', arr: '', stage: 'qualification' })
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">All Deals</h2>
          <p className="text-sm text-gray-500">{filtered.length} deal{filtered.length !== 1 ? 's' : ''} · {formatCurrency(filtered.reduce((s, d) => s + d.arr_value, 0))} ARR</p>
        </div>
        <button onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5" /> New Deal
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* ARR filter */}
        <div className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5">
          <span className="text-xs text-gray-500 whitespace-nowrap">ARR &gt;</span>
          <span className="text-xs text-gray-400">$</span>
          <input
            type="number"
            min={0}
            placeholder="0"
            value={filters.arrGt}
            onChange={(e) => setFilters((f) => ({ ...f, arrGt: e.target.value }))}
            className="w-14 text-xs text-gray-800 outline-none bg-transparent"
          />
          <span className="text-xs text-gray-400">K</span>
        </div>

        {/* Stage filter */}
        <select
          value={filters.stage}
          onChange={(e) => setFilters((f) => ({ ...f, stage: e.target.value }))}
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none cursor-pointer">
          <option value="all">All Stages</option>
          {ALL_STAGES.map((s) => (
            <option key={s} value={s}>{STAGE_LABELS[s]}</option>
          ))}
        </select>

        {/* Health filter */}
        <select
          value={filters.health}
          onChange={(e) => setFilters((f) => ({ ...f, health: e.target.value as Filters['health'] }))}
          className="rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 outline-none cursor-pointer">
          <option value="all">All Health</option>
          <option value="healthy">Healthy (≥80%)</option>
          <option value="unhealthy">At Risk (&lt;80%)</option>
        </select>

        {hasFilters && (
          <button onClick={clearFilters}
            className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-500 hover:text-gray-700">
            <X className="h-3 w-3" /> Clear
          </button>
        )}

        {hasFilters && filtered.length === 0 && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Search className="h-3 w-3" /> No deals match filters
          </span>
        )}
      </div>

      {/* Stuck deals banner */}
      {stuck.length > 0 && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-semibold text-yellow-800">{stuck.length} deal{stuck.length > 1 ? 's' : ''} need attention</span>
          </div>
          <div className="space-y-2">
            {stuck.map((d) => (
              <StuckDealRow key={d.id} deal={d} onOpen={handleOpen} />
            ))}
          </div>
        </div>
      )}

      {/* All deals table */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Company</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">ARR</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Stage</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Health</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500">Last Activity</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((deal) => (
              <tr key={deal.id} className="cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => handleOpen(deal)}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {deal.is_stuck && <AlertTriangle className="h-3.5 w-3.5 text-yellow-500 shrink-0" />}
                    <div>
                      <p className="text-sm font-medium text-gray-900">{deal.company_name}</p>
                      {deal.stuck_reason && <p className="text-xs text-yellow-600 truncate max-w-[200px]">{deal.stuck_reason}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900">{formatCurrency(deal.arr_value)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-600 bg-gray-100 rounded-full px-2 py-0.5">{STAGE_LABELS[deal.stage]}</span>
                </td>
                <td className="px-4 py-3"><HealthScoreBadge score={deal.health_score} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    {timeAgo(deal.updated_at)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button onClick={(e) => { e.stopPropagation(); handleOpen(deal) }}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
                    View Room <ChevronRight className="h-3 w-3" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">No deals match the current filters.</div>
        )}
      </div>

      {/* New Deal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl animate-bounce-in">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <p className="text-sm font-semibold text-gray-900">Add New Deal</p>
              <button onClick={() => setModalOpen(false)} className="rounded-lg p-1 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreateDeal} className="px-5 py-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">ARR ($K)</label>
                  <div className="flex items-center rounded-lg border border-gray-200 px-3 py-2 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
                    <span className="text-xs text-gray-400 mr-1">$</span>
                    <input
                      type="number"
                      min={1}
                      placeholder="50"
                      value={form.arr}
                      onChange={(e) => setForm((f) => ({ ...f, arr: e.target.value }))}
                      className="w-full text-sm text-gray-800 outline-none bg-transparent"
                    />
                    <span className="text-xs text-gray-400 ml-1">K</span>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-700">Stage</label>
                  <select
                    value={form.stage}
                    onChange={(e) => setForm((f) => ({ ...f, stage: e.target.value as DealStage }))}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 cursor-pointer">
                    {ALL_STAGES.map((s) => (
                      <option key={s} value={s}>{STAGE_LABELS[s]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-gray-400">Health score and last activity will be auto-generated.</p>
              <div className="flex gap-2 pt-1">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-lg border border-gray-200 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                  Add Deal
                </button>
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
    <div className="flex items-center justify-between rounded-lg bg-white border border-yellow-100 px-3 py-2">
      <div className="flex items-center gap-3">
        <div>
          <span className="text-sm font-medium text-gray-900">{deal.company_name}</span>
          <span className="mx-2 text-gray-300">·</span>
          <span className="text-sm font-semibold text-gray-800">{formatCurrency(deal.arr_value)} ARR</span>
        </div>
        <HealthScoreBadge score={deal.health_score} size="sm" />
        <span className="text-xs text-gray-500">{deal.stuck_reason}</span>
      </div>
      <button onClick={() => onOpen(deal)}
        className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
        View Deal Room <ChevronRight className="h-3 w-3" />
      </button>
    </div>
  )
}

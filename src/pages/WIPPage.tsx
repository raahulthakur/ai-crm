import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'

export function WIPPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const pageName = location.pathname.replace('/', '').replace(/^./, (c) => c.toUpperCase()) || 'This page'

  return (
    <div className="flex h-full flex-col items-center justify-center bg-[#FAFBFC] px-6 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-[#E5E7EB] bg-white">
        <Construction className="h-9 w-9 text-[#059669]" />
      </div>

      {/* Headline */}
      <h1 className="font-display text-2xl font-800 tracking-tight text-[#0F172A]">
        Ohh hoo.
      </h1>
      <p className="mt-2 text-base text-[#475569]">
        You've hit a work-in-progress page.
      </p>

      {/* Page hint */}
      <div className="mt-4 rounded-lg border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-2">
        <span className="font-mono text-sm text-[#059669]">{pageName}</span>
        <span className="text-sm text-[#475569]"> is still being built.</span>
      </div>

      {/* Subtext */}
      <p className="mt-4 max-w-xs text-xs leading-relaxed text-[#475569]">
        This feature is on the roadmap. For now, head back to the Deals workspace where the magic happens.
      </p>

      {/* CTA */}
      <button
        onClick={() => navigate('/deals')}
        className="btn-amber mt-8 flex items-center gap-2 px-5 py-2.5 text-sm">
        <ArrowLeft className="h-4 w-4" />
        Back to Deals
      </button>
    </div>
  )
}

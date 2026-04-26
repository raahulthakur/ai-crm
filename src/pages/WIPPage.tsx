import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'

export function WIPPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const pageName = location.pathname.replace('/', '').replace(/^./, (c) => c.toUpperCase()) || 'This page'

  return (
    <div className="flex h-full flex-col items-center justify-center bg-zinc-950 px-6 text-center">
      {/* Icon */}
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl border border-zinc-700/50 bg-zinc-900">
        <Construction className="h-9 w-9 text-amber-400" />
      </div>

      {/* Headline */}
      <h1 className="font-display text-2xl font-800 tracking-tight text-zinc-50">
        Ohh hoo.
      </h1>
      <p className="mt-2 text-base text-zinc-400">
        You've hit a work-in-progress page.
      </p>

      {/* Page hint */}
      <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/60 px-4 py-2">
        <span className="font-mono text-sm text-amber-400">{pageName}</span>
        <span className="text-sm text-zinc-600"> is still being built.</span>
      </div>

      {/* Subtext */}
      <p className="mt-4 max-w-xs text-xs leading-relaxed text-zinc-600">
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

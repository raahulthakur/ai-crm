import { X, Mail, Phone, Clock, Star, ShieldAlert, ExternalLink } from 'lucide-react'
import type { DealContact } from '@/types'
import { timeAgo } from '@/lib/utils'

const ROLE_LABELS: Record<string, string> = {
  economic_buyer: 'Economic Buyer',
  champion: 'Champion',
  blocker: 'Blocker',
  influencer: 'Influencer',
  end_user: 'End User',
  technical_evaluator: 'Technical Evaluator',
}

const STATUS_COLORS: Record<string, { pill: string; dot: string }> = {
  champion:      { pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  blocked:       { pill: 'bg-rose-500/15 text-rose-400 border-rose-500/30',          dot: 'bg-rose-400' },
  not_contacted: { pill: 'bg-zinc-700/50 text-[#64748B] border-zinc-600/40',           dot: 'bg-zinc-600' },
  neutral:       { pill: 'bg-blue-500/15 text-blue-400 border-blue-500/30',           dot: 'bg-blue-400' },
  engaged:       { pill: 'bg-blue-500/15 text-blue-400 border-blue-500/30',           dot: 'bg-blue-400' },
  unresponsive:  { pill: 'bg-amber-500/15 text-amber-400 border-amber-500/30',        dot: 'bg-amber-400' },
}

const STATUS_LABELS: Record<string, string> = {
  champion: 'Champion', blocked: 'Blocked', not_contacted: 'Not Contacted',
  neutral: 'Neutral', engaged: 'Engaged', unresponsive: 'Unresponsive',
}

interface Props {
  dc: DealContact
  onClose: () => void
}

export function ContactModal({ dc, onClose }: Props) {
  const { contact, status, role, is_champion, is_key_blocker, influence_weight, notes } = dc
  const statusStyle = STATUS_COLORS[status] ?? STATUS_COLORS.neutral
  const daysSince = contact.last_contacted_at
    ? Math.floor((Date.now() - new Date(contact.last_contacted_at).getTime()) / 86400000)
    : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}>
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-zinc-700/50 bg-zinc-900 shadow-2xl animate-bounce-in"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="relative flex flex-col items-center pt-8 pb-5 px-6 border-b border-zinc-800">
          <button onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-[#475569] hover:text-[#0F172A] transition-colors">
            <X className="h-4 w-4" />
          </button>

          {/* Avatar */}
          {contact.avatar_url ? (
            <img src={contact.avatar_url} alt={contact.full_name}
              className="h-20 w-20 rounded-full object-cover border-4 border-zinc-700 shadow-xl mb-3" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-zinc-700 border-4 border-zinc-600 flex items-center justify-center text-2xl font-bold text-zinc-300 mb-3 font-display">
              {contact.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          )}

          <h2 className="font-display text-base font-700 text-zinc-50">{contact.full_name}</h2>
          <p className="text-sm text-zinc-400 mt-0.5">{contact.job_title}</p>
          <p className="text-xs text-[#475569] mt-0.5">{contact.company_name}</p>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyle.pill}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {STATUS_LABELS[status]}
            </span>
            {is_champion && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-semibold text-amber-400">
                <Star className="h-2.5 w-2.5 fill-amber-400" /> Champion
              </span>
            )}
            {is_key_blocker && (
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] font-semibold text-rose-400">
                <ShieldAlert className="h-2.5 w-2.5" /> Key Blocker
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-3">
          {contact.email && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 shrink-0">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#475569] uppercase tracking-wider">Email</p>
                <a href={`mailto:${contact.email}`}
                  className="text-xs text-zinc-200 hover:text-amber-400 transition-colors flex items-center gap-1">
                  {contact.email} <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </div>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 shrink-0">
                <Phone className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#475569] uppercase tracking-wider">Phone / WhatsApp</p>
                <p className="text-xs text-zinc-200 font-mono">{contact.phone}</p>
              </div>
            </div>
          )}

          {contact.last_contacted_at && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-800 shrink-0">
                <Clock className="h-3.5 w-3.5 text-zinc-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#475569] uppercase tracking-wider">Last Contacted</p>
                <p className={`text-xs font-medium ${daysSince != null && daysSince > 7 ? 'text-rose-400' : 'text-zinc-200'}`}>
                  {timeAgo(contact.last_contacted_at)}
                  {daysSince != null && daysSince > 7 && ` — ${daysSince} days silent`}
                </p>
              </div>
            </div>
          )}

          {/* Role + influence */}
          <div className="mt-1 grid grid-cols-2 gap-2 rounded-xl border border-zinc-800 bg-zinc-800/30 p-3">
            <div>
              <p className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Deal Role</p>
              <p className="text-xs font-semibold text-zinc-200">{ROLE_LABELS[role] ?? role}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#475569] uppercase tracking-wider mb-1">Influence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-zinc-700">
                  <div className="h-1.5 rounded-full bg-amber-400" style={{ width: `${influence_weight}%` }} />
                </div>
                <span className="text-[10px] font-mono text-zinc-400">{influence_weight}%</span>
              </div>
            </div>
          </div>

          {notes && <p className="text-[11px] italic text-[#475569] border-l-2 border-zinc-700 pl-3">{notes}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-zinc-800 px-5 py-3">
          <a href={`mailto:${contact.email}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-700 py-2 text-xs font-medium text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors">
            <Mail className="h-3.5 w-3.5" /> Email
          </a>
          {contact.phone && (
            <a href={`https://wa.me/${contact.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all"
              style={{ background: '#e3ffcc', color: '#131414' }}>
              <Phone className="h-3.5 w-3.5" /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

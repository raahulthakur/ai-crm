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
  champion:      { pill: 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]',        dot: 'bg-[#10B981]' },
  blocked:       { pill: 'bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]',        dot: 'bg-[#EF4444]' },
  not_contacted: { pill: 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',        dot: 'bg-[#94A3B8]' },
  neutral:       { pill: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',        dot: 'bg-[#3B82F6]' },
  engaged:       { pill: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',        dot: 'bg-[#3B82F6]' },
  unresponsive:  { pill: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',        dot: 'bg-[#F59E0B]' },
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
      <div className="mx-4 w-full max-w-sm rounded-2xl border border-[#E5E7EB] bg-white shadow-2xl animate-bounce-in"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="relative flex flex-col items-center pt-8 pb-5 px-6 border-b border-[#E5E7EB]">
          <button onClick={onClose}
            className="absolute right-4 top-4 rounded-lg p-1 text-[#475569] hover:text-[#0F172A] transition-colors">
            <X className="h-4 w-4" />
          </button>

          {/* Avatar */}
          {contact.avatar_url ? (
            <img src={contact.avatar_url} alt={contact.full_name}
              className="h-20 w-20 rounded-full object-cover border-4 border-[#E5E7EB] shadow-xl mb-3" />
          ) : (
            <div className="h-20 w-20 rounded-full bg-[#F1F5F9] border-4 border-[#E5E7EB] flex items-center justify-center text-2xl font-bold text-[#475569] mb-3 font-display">
              {contact.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
          )}

          <h2 className="font-display text-base font-700 text-[#0F172A]">{contact.full_name}</h2>
          <p className="text-sm text-[#475569] mt-0.5">{contact.job_title}</p>
          <p className="text-xs text-[#64748B] mt-0.5">{contact.company_name}</p>

          {/* Badges */}
          <div className="flex items-center gap-2 mt-3 flex-wrap justify-center">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyle.pill}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
              {STATUS_LABELS[status]}
            </span>
            {is_champion && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#A7F3D0] bg-[#ECFDF5] px-2.5 py-1 text-[10px] font-semibold text-[#065F46]">
                <Star className="h-2.5 w-2.5 fill-[#10B981]" /> Champion
              </span>
            )}
            {is_key_blocker && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#FECACA] bg-[#FEE2E2] px-2.5 py-1 text-[10px] font-semibold text-[#991B1B]">
                <ShieldAlert className="h-2.5 w-2.5" /> Key Blocker
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="px-5 py-4 space-y-3">
          {contact.email && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F5F9] shrink-0">
                <Mail className="h-3.5 w-3.5 text-[#475569]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Email</p>
                <a href={`mailto:${contact.email}`}
                  className="text-xs text-[#0F172A] hover:text-[#059669] transition-colors flex items-center gap-1">
                  {contact.email} <ExternalLink className="h-2.5 w-2.5 opacity-50" />
                </a>
              </div>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F5F9] shrink-0">
                <Phone className="h-3.5 w-3.5 text-[#475569]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Phone / WhatsApp</p>
                <p className="text-xs text-[#0F172A] font-mono">{contact.phone}</p>
              </div>
            </div>
          )}

          {contact.last_contacted_at && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F1F5F9] shrink-0">
                <Clock className="h-3.5 w-3.5 text-[#475569]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] text-[#64748B] uppercase tracking-wider">Last Contacted</p>
                <p className={`text-xs font-medium ${daysSince != null && daysSince > 7 ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>
                  {timeAgo(contact.last_contacted_at)}
                  {daysSince != null && daysSince > 7 && ` — ${daysSince} days silent`}
                </p>
              </div>
            </div>
          )}

          {/* Role + influence */}
          <div className="mt-1 grid grid-cols-2 gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3">
            <div>
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1">Deal Role</p>
              <p className="text-xs font-semibold text-[#0F172A]">{ROLE_LABELS[role] ?? role}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#64748B] uppercase tracking-wider mb-1">Influence</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-[#E5E7EB]">
                  <div className="h-1.5 rounded-full bg-[#059669]" style={{ width: `${influence_weight}%` }} />
                </div>
                <span className="text-[10px] font-mono text-[#475569]">{influence_weight}%</span>
              </div>
            </div>
          </div>

          {notes && <p className="text-[11px] italic text-[#475569] border-l-2 border-[#A7F3D0] pl-3">{notes}</p>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-[#E5E7EB] px-5 py-3">
          <a href={`mailto:${contact.email}`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-[#CBD5E1] py-2 text-xs font-medium text-[#475569] hover:border-[#059669]/50 hover:text-[#059669] transition-colors">
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

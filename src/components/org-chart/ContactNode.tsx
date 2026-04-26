import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { AlertTriangle, Star, ShieldAlert } from 'lucide-react'
import type { DealContact } from '@/types'
import { getInitials, cn } from '@/lib/utils'

const STATUS_RING: Record<string, string> = {
  champion: 'ring-2 ring-emerald-400/70',
  blocked: 'ring-2 ring-rose-400/70',
  not_contacted: 'ring-2 ring-zinc-600/50',
  neutral: 'ring-2 ring-blue-400/50',
  engaged: 'ring-2 ring-blue-400/70',
  unresponsive: 'ring-2 ring-amber-400/60',
}

const AVATAR_COLORS: Record<string, { bg: string; text: string }> = {
  champion:      { bg: '#064e3b', text: '#34d399' },
  blocked:       { bg: '#4c0519', text: '#fb7185' },
  not_contacted: { bg: '#153C43', text: '#7AADB8' },
  neutral:       { bg: '#1e3a5f', text: '#60a5fa' },
  engaged:       { bg: '#1e3a5f', text: '#60a5fa' },
  unresponsive:  { bg: '#451a03', text: '#fbbf24' },
}

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  champion:      { text: 'Champion',      color: 'text-emerald-400' },
  blocked:       { text: 'Blocked',       color: 'text-rose-400' },
  not_contacted: { text: 'Not Contacted', color: 'text-zinc-500' },
  neutral:       { text: 'Neutral',       color: 'text-blue-400' },
  engaged:       { text: 'Engaged',       color: 'text-blue-400' },
  unresponsive:  { text: 'Unresponsive',  color: 'text-amber-400' },
}

interface NodeData { dealContact: DealContact; [key: string]: unknown }

export const ContactNode = memo(({ data }: { data: NodeData }) => {
  const { dealContact } = data
  const { contact, status, is_key_blocker, is_champion } = dealContact
  const colors = AVATAR_COLORS[status] ?? AVATAR_COLORS.not_contacted
  const statusInfo = STATUS_LABELS[status] ?? STATUS_LABELS.not_contacted
  const daysSince = contact.last_contacted_at
    ? Math.floor((Date.now() - new Date(contact.last_contacted_at).getTime()) / 86400000)
    : null

  return (
    <div className={cn('w-[165px] rounded-2xl border border-zinc-700/40 bg-zinc-900 px-3 py-3 transition-all hover:border-zinc-600 hover:shadow-lg', STATUS_RING[status])}>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-zinc-700 !h-1.5 !w-1.5 !opacity-60" />

      {/* Profile pic */}
      <div className="mb-2.5 flex items-center gap-2.5">
        {contact.avatar_url ? (
          <img
            src={contact.avatar_url}
            alt={contact.full_name}
            className="h-10 w-10 shrink-0 rounded-full object-cover border-2"
            style={{ borderColor: colors.text + '50' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-display font-bold border-2"
            style={{ background: colors.bg, color: colors.text, borderColor: colors.text + '40' }}
          >
            {getInitials(contact.full_name)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] font-bold text-zinc-100 leading-tight">{contact.full_name}</p>
          <p className="truncate text-[10px] text-zinc-500 leading-tight mt-0.5">{contact.job_title}</p>
        </div>
      </div>

      {/* Status row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {is_champion && <Star className="h-3 w-3 text-amber-400 fill-amber-400" />}
          {is_key_blocker && <ShieldAlert className="h-3 w-3 text-rose-400" />}
          <span className={cn('text-[10px] font-semibold', statusInfo.color)}>{statusInfo.text}</span>
        </div>
        {daysSince != null && daysSince > 7 && (
          <span className="flex items-center gap-0.5 text-[9px] font-mono text-amber-400/80">
            <AlertTriangle className="h-2.5 w-2.5" />{daysSince}d
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-zinc-700 !h-1.5 !w-1.5 !opacity-60" />
    </div>
  )
})
ContactNode.displayName = 'ContactNode'

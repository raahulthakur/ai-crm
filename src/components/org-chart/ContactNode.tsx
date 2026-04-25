import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { AlertTriangle, Star, Shield } from 'lucide-react'
import type { DealContact } from '@/types'
import { getInitials, cn } from '@/lib/utils'

const STATUS_RING: Record<string, string> = {
  champion: 'ring-2 ring-green-400',
  blocked: 'ring-2 ring-red-400',
  not_contacted: 'ring-2 ring-gray-300',
  neutral: 'ring-2 ring-blue-300',
  engaged: 'ring-2 ring-blue-400',
  unresponsive: 'ring-2 ring-orange-400',
}

const AVATAR_BG: Record<string, string> = {
  champion: 'bg-green-100 text-green-700',
  blocked: 'bg-red-100 text-red-700',
  not_contacted: 'bg-gray-100 text-gray-600',
  neutral: 'bg-blue-100 text-blue-700',
  engaged: 'bg-blue-100 text-blue-700',
  unresponsive: 'bg-orange-100 text-orange-700',
}

interface NodeData {
  dealContact: DealContact
  [key: string]: unknown
}

export const ContactNode = memo(({ data }: { data: NodeData }) => {
  const { dealContact } = data
  const { contact, status, is_key_blocker, is_champion } = dealContact
  const daysSinceContact = contact.last_contacted_at
    ? Math.floor((Date.now() - new Date(contact.last_contacted_at).getTime()) / 86400000)
    : null

  return (
    <div className={cn('relative rounded-xl border bg-white px-3 py-2.5 shadow-sm w-[160px] transition-all hover:shadow-md', STATUS_RING[status])}>
      <Handle type="target" position={Position.Top} className="!border-0 !bg-gray-300 !h-2 !w-2" />
      <div className="flex items-center gap-2">
        <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold', AVATAR_BG[status])}>
          {getInitials(contact.full_name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-gray-900">{contact.full_name}</p>
          <p className="truncate text-[10px] text-gray-500">{contact.job_title}</p>
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {is_champion && <Star className="h-3 w-3 text-green-500 fill-green-500" />}
          {is_key_blocker && <Shield className="h-3 w-3 text-red-500" />}
        </div>
        {daysSinceContact !== null && daysSinceContact > 7 && (
          <span className="flex items-center gap-0.5 text-[10px] text-orange-600">
            <AlertTriangle className="h-2.5 w-2.5" />
            {daysSinceContact}d silent
          </span>
        )}
        {status === 'not_contacted' && (
          <span className="text-[10px] text-gray-400">Not reached</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!border-0 !bg-gray-300 !h-2 !w-2" />
    </div>
  )
})

ContactNode.displayName = 'ContactNode'

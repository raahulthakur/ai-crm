import { useState } from 'react'
import { MessageSquare, Phone, FileText, Zap, CheckCircle2 } from 'lucide-react'
import { useAIStore, useUIStore } from '@/store'
import type { AIRecommendedAction, ActionPriority } from '@/types'
import { BookMeetingCard } from '@/components/whatsapp/BookMeetingCard'
import { SendDocModal } from '@/components/whatsapp/SendDocModal'

// Design system priority dots
const PRIORITY_DOT: Record<ActionPriority, string> = {
  critical: '#EF4444',
  high:     '#F59E0B',
  medium:   '#059669',
  low:      '#9CA3AF',
}

const PRIORITY_LABEL: Record<ActionPriority, string> = {
  critical: '#EF4444',
  high:     '#D97706',
  medium:   '#059669',
  low:      '#6B7280',
}

const ACTION_ICONS: Record<string, typeof MessageSquare> = {
  send_whatsapp: MessageSquare,
  book_meeting:  Phone,
  send_doc:      FileText,
}

const ACTION_LABELS: Record<string, string> = {
  send_whatsapp: 'Send WhatsApp',
  book_meeting:  'Book Meeting',
  send_doc:      'Send Document',
}

export function RecommendedActions() {
  const { actions } = useAIStore()
  const { openWhatsAppModal, openSendDocModal } = useUIStore()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const pending = actions.filter((a) => !a.is_completed)

  function handleAction(action: AIRecommendedAction) {
    if (action.action_type === 'send_whatsapp' && action.target_contact) {
      openWhatsAppModal(action.target_contact)
    } else if (action.action_type === 'book_meeting') {
      setExpandedId(expandedId === action.id ? null : action.id)
    } else if (action.action_type === 'send_doc') {
      openSendDocModal(action.id)
    }
  }

  return (
    <div className="space-y-2.5">
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#475569]">
        AI Recommended Actions
      </h3>

      <div className="space-y-2">
        {pending.map((action) => {
          const Icon = ACTION_ICONS[action.action_type] ?? Zap
          const isExpanded = expandedId === action.id

          return (
            <div key={action.id}
              className="rounded-xl border border-[#E5E7EB] bg-white p-3 transition-all hover:border-[#10B981]/40 hover:shadow-sm animate-fade-in">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100">
                  <Icon className="h-3 w-3 text-[#059669]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-[#1F2937]">{action.title}</span>
                    <span className="flex items-center gap-1 text-[10px] font-medium"
                      style={{ color: PRIORITY_LABEL[action.priority] }}>
                      <span className="h-1.5 w-1.5 rounded-full inline-block"
                        style={{ background: PRIORITY_DOT[action.priority] }} />
                      {action.priority}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-[#4B5563]">{action.description}</p>
                  {action.target_contact && (
                    <p className="mt-1 text-[10px] text-[#6B7280]">
                      → {action.target_contact.full_name} · {action.target_contact.job_title}
                    </p>
                  )}
                </div>
              </div>

              {/* Primary action button */}
              <button
                onClick={() => handleAction(action)}
                className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90"
                style={{ background: '#059669' }}>
                <Zap className="h-3 w-3" />
                {ACTION_LABELS[action.action_type] ?? 'Take Action'}
              </button>

              {/* Inline booking card */}
              {action.action_type === 'book_meeting' && isExpanded && action.target_contact && (
                <BookMeetingCard
                  actionId={action.id}
                  contactName={action.target_contact.full_name}
                  contactEmail={action.target_contact.email ?? 'rahul.mehta@abccorp.com'}
                />
              )}
            </div>
          )
        })}

        {/* SendDocModal — rendered globally */}
        {pending.find(a => a.action_type === 'send_doc') && (
          <SendDocModal actionId={pending.find(a => a.action_type === 'send_doc')!.id} />
        )}

        {pending.length === 0 && (
          <div className="flex items-center gap-2.5 rounded-xl border border-[#10B981]/30 bg-[#ECFDF5] p-3">
            <CheckCircle2 className="h-4 w-4 text-[#059669] shrink-0" />
            <span className="text-xs font-medium text-[#059669]">All actions completed</span>
          </div>
        )}
      </div>
    </div>
  )
}

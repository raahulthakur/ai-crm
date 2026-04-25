import { useState } from 'react'
import { MessageSquare, Phone, FileText, Zap, CheckCircle2 } from 'lucide-react'
import { useAIStore, useUIStore } from '@/store'
import { cn } from '@/lib/utils'
import type { AIRecommendedAction, ActionPriority } from '@/types'
import { BookMeetingCard } from '@/components/whatsapp/BookMeetingCard'
import { SendDocModal } from '@/components/whatsapp/SendDocModal'

const PRIORITY_STYLES: Record<ActionPriority, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-blue-100 text-blue-700 border-blue-200',
  low: 'bg-gray-100 text-gray-600 border-gray-200',
}

const ACTION_ICONS: Record<string, typeof MessageSquare> = {
  send_whatsapp: MessageSquare,
  book_meeting: Phone,
  send_doc: FileText,
}

const ACTION_BUTTON_LABELS: Record<string, string> = {
  send_whatsapp: 'Send WhatsApp',
  book_meeting: 'Book Meeting',
  send_doc: 'Send Document',
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
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">AI Recommended Actions</h3>
      <div className="space-y-2">
        {pending.map((action) => {
          const Icon = ACTION_ICONS[action.action_type] ?? Zap
          const isExpanded = expandedId === action.id
          const buttonLabel = ACTION_BUTTON_LABELS[action.action_type] ?? 'Take Action'

          return (
            <div key={action.id} className="rounded-lg border border-gray-100 bg-white p-3 transition-all">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500">
                  <Icon className="h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-semibold text-gray-900">{action.title}</span>
                    <span className={cn('rounded-full border px-1.5 py-0.5 text-[10px] font-medium', PRIORITY_STYLES[action.priority])}>
                      {action.priority}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-600">{action.description}</p>
                  {action.target_contact && (
                    <p className="mt-1 text-[10px] text-gray-500">
                      → {action.target_contact.full_name} ({action.target_contact.job_title})
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleAction(action)}
                className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <Zap className="h-3 w-3" />
                {buttonLabel}
              </button>

              {/* Inline booking card for meet action */}
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

        {/* SendDocModal is rendered globally, keyed to the open action */}
        {pending.find(a => a.action_type === 'send_doc') && (
          <SendDocModal actionId={pending.find(a => a.action_type === 'send_doc')!.id} />
        )}

        {pending.length === 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 p-3">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-xs text-green-700 font-medium">All actions completed!</span>
          </div>
        )}
      </div>
    </div>
  )
}

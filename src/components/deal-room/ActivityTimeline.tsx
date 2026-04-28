import { Phone, FileText, Bot, TrendingUp, Clock } from 'lucide-react'
import { useActivityStore } from '@/store'
import { timeAgo, cn } from '@/lib/utils'
import type { ActivityType } from '@/types'

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.978-1.403A9.953 9.953 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" fill="#25D366"/>
      <path d="M8.5 8.5c.2-.5.4-.5.6-.5h.5c.2 0 .4.1.5.3l.7 1.7c.1.2.05.5-.1.65l-.5.5c-.1.1-.1.25 0 .35.5.8 1.2 1.5 2 2 .1.1.25.1.35 0l.5-.5c.15-.15.45-.2.65-.1l1.7.7c.2.1.3.3.3.5v.5c0 .7-.55 1.35-1.25 1.4-2.5.2-5.75-2.5-6.5-5.55C7.8 9.6 8.1 8.9 8.5 8.5z" fill="white"/>
    </svg>
  )
}

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Envelope body */}
      <rect x="2" y="4" width="20" height="16" rx="2" fill="#EA4335"/>
      {/* White M-fold / chevron */}
      <path d="M2 7l10 7 10-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Bottom diagonal lines giving depth */}
      <path d="M2 19l6-4.5M22 19l-6-4.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  )
}

type IconRenderer = (className: string) => React.ReactNode

// borderColor: colored border ring; iconBg: solid hex background so line can't bleed through
const TIMELINE_CONFIG: Record<ActivityType, { render: IconRenderer; borderColor: string; iconBg: string }> = {
  email_sent:           { render: (c) => <GmailIcon className={c} />,    borderColor: 'border-red-500/50',     iconBg: '#1a2c35' },
  email_received:       { render: (c) => <GmailIcon className={c} />,    borderColor: 'border-red-500/50',     iconBg: '#1a2c35' },
  whatsapp_sent:        { render: (c) => <WhatsAppIcon className={c} />, borderColor: 'border-emerald-500/50', iconBg: '#0d2e22' },
  whatsapp_received:    { render: (c) => <WhatsAppIcon className={c} />, borderColor: 'border-emerald-500/50', iconBg: '#0d2e22' },
  call_completed:       { render: (c) => <Phone className={c} />,        borderColor: 'border-amber-500/50',   iconBg: '#1e3418' },
  meeting_booked:       { render: (c) => <Clock className={c} />,        borderColor: 'border-blue-500/50',    iconBg: '#141e35' },
  document_sent:        { render: (c) => <FileText className={c} />,     borderColor: 'border-teal-500/50',    iconBg: '#0d2e2e' },
  ai_insight_generated: { render: (c) => <Bot className={c} />,          borderColor: 'border-zinc-600',       iconBg: '#153C43' },
  score_updated:        { render: (c) => <TrendingUp className={c} />,   borderColor: 'border-blue-500/50',    iconBg: '#141e35' },
  note_added:           { render: (c) => <FileText className={c} />,     borderColor: 'border-zinc-600',       iconBg: '#153C43' },
}

const ICON_COLOR: Record<ActivityType, string> = {
  email_sent: '', email_received: '',
  whatsapp_sent: '', whatsapp_received: '',
  call_completed: 'text-amber-400',
  meeting_booked: 'text-blue-400',
  document_sent: 'text-teal-400',
  ai_insight_generated: 'text-[#64748B]',
  score_updated: 'text-blue-400',
  note_added: 'text-[#64748B]',
}

export function ActivityTimeline() {
  const { activities } = useActivityStore()
  const sorted = [...activities].sort((a, b) =>
    new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
  )

  return (
    <div className="space-y-2.5">
      <h3 className="text-[10px] font-semibold uppercase tracking-widest text-[#475569]">Activity Timeline</h3>
      <div className="space-y-0">
        {sorted.map((activity, idx) => {
          const cfg = TIMELINE_CONFIG[activity.type]
          const colorClass = ICON_COLOR[activity.type]
          const isNew = idx === 0 && activity.created_by === 'ai_system'
          const isLast = idx === sorted.length - 1

          return (
            <div key={activity.id} className={cn('flex gap-3 pb-3', isNew && 'animate-fade-in')}>
              {/* Icon column with connector line drawn as a border on the left spacer */}
              <div className="flex flex-col items-center shrink-0">
                {/* Icon bubble — solid background so nothing bleeds through */}
                <div
                  className={cn('flex h-7 w-7 items-center justify-center rounded-full border', cfg.borderColor)}
                  style={{ background: cfg.iconBg, marginTop: '2px' }}
                >
                  {cfg.render(cn('h-3.5 w-3.5', colorClass))}
                </div>
                {/* Connector line below icon */}
                {!isLast && <div className="w-px flex-1 bg-zinc-800 mt-1" />}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                  <span className="text-[11px] font-semibold text-zinc-200">{activity.title}</span>
                  {isNew && (
                    <span className="rounded-full bg-blue-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-blue-400">NEW</span>
                  )}
                </div>
                {activity.description && (
                  <p className="mt-0.5 text-[10px] italic leading-relaxed text-[#475569]">{activity.description}</p>
                )}
                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-[#64748B]">
                  <Clock className="h-2.5 w-2.5" />
                  {timeAgo(activity.occurred_at)}
                  {activity.contact && (
                    <><span className="text-[#CBD5E1]">·</span><span>{activity.contact.full_name}</span></>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

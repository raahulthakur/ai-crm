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
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 18H4a2 2 0 01-2-2V8a2 2 0 012-2h16a2 2 0 012 2v8a2 2 0 01-2 2h-2V9.25L12 13.5 6 9.25V18z" fill="#EA4335"/>
      <path d="M6 9.25V18h12V9.25L12 13.5 6 9.25z" fill="#FBBC04"/>
      <path d="M20 6H4l8 5.25L20 6z" fill="#34A853"/>
      <path d="M2 8v8a2 2 0 002 2h2V9.25L4 8.5V8H2z" fill="#C5221F"/>
      <path d="M22 8v8a2 2 0 01-2 2h-2V9.25L20 8.5V8h2z" fill="#1A73E8"/>
    </svg>
  )
}

type ActivityIconConfig = {
  render: (className: string) => React.ReactNode
  bg: string
}

const ACTIVITY_CONFIG: Record<ActivityType, ActivityIconConfig> = {
  email_sent:            { render: (c) => <GmailIcon className={c} />,      bg: 'bg-red-50' },
  email_received:        { render: (c) => <GmailIcon className={c} />,      bg: 'bg-red-50' },
  whatsapp_sent:         { render: (c) => <WhatsAppIcon className={c} />,   bg: 'bg-green-50' },
  whatsapp_received:     { render: (c) => <WhatsAppIcon className={c} />,   bg: 'bg-green-50' },
  call_completed:        { render: (c) => <Phone className={c} />,          bg: 'bg-orange-100' },
  meeting_booked:        { render: (c) => <Clock className={c} />,          bg: 'bg-indigo-100' },
  document_sent:         { render: (c) => <FileText className={c} />,       bg: 'bg-teal-100' },
  ai_insight_generated:  { render: (c) => <Bot className={c} />,            bg: 'bg-gray-100' },
  score_updated:         { render: (c) => <TrendingUp className={c} />,     bg: 'bg-blue-100' },
  note_added:            { render: (c) => <FileText className={c} />,       bg: 'bg-yellow-100' },
}

const ICON_COLOR: Record<ActivityType, string> = {
  email_sent: '',
  email_received: '',
  whatsapp_sent: '',
  whatsapp_received: '',
  call_completed: 'text-orange-600',
  meeting_booked: 'text-indigo-600',
  document_sent: 'text-teal-600',
  ai_insight_generated: 'text-gray-600',
  score_updated: 'text-blue-600',
  note_added: 'text-yellow-600',
}

export function ActivityTimeline() {
  const { activities } = useActivityStore()
  const sorted = [...activities].sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime())

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">Activity Timeline</h3>
      <div className="space-y-0 relative">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100" />
        {sorted.map((activity, idx) => {
          const config = ACTIVITY_CONFIG[activity.type]
          const colorClass = ICON_COLOR[activity.type]
          const isNew = idx === 0 && activity.created_by === 'ai_system'
          return (
            <div key={activity.id} className={cn('relative flex gap-3 pb-3 pl-0', isNew && 'animate-fade-in')}>
              <div className={cn('z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full', config.bg)}>
                {config.render(cn('h-4 w-4', colorClass))}
              </div>
              <div className="min-w-0 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-gray-900">{activity.title}</span>
                  {isNew && <span className="rounded-full bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-600">NEW</span>}
                </div>
                {activity.description && (
                  <p className="mt-0.5 text-xs italic text-gray-500 leading-relaxed">{activity.description}</p>
                )}
                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-gray-400">
                  <Clock className="h-2.5 w-2.5" />
                  {timeAgo(activity.occurred_at)}
                  {activity.contact && (
                    <><span>·</span><span>{activity.contact.full_name}</span></>
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

import { useState } from 'react'
import { Calendar, Loader2 } from 'lucide-react'
import { useAIStore, useUIStore, useActivityStore } from '@/store'
import { cn } from '@/lib/utils'

const SLOTS = [
  { day: 'Mon, Apr 28', slots: ['10:00 AM', '2:00 PM'] },
  { day: 'Tue, Apr 29', slots: ['11:00 AM', '3:00 PM', '4:30 PM'] },
  { day: 'Wed, Apr 30', slots: ['9:00 AM', '1:00 PM'] },
]

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="3" fill="#1a73e8"/>
      <rect x="3" y="4" width="18" height="7" rx="3" fill="#1a73e8"/>
      <rect x="3" y="8" width="18" height="3" fill="#1a73e8"/>
      <text x="12" y="19" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold" fontFamily="sans-serif">28</text>
      <line x1="8" y1="2" x2="8" y2="7" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round"/>
      <line x1="16" y1="2" x2="16" y2="7" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )
}

interface Props { actionId: string; contactName: string; contactEmail: string }
type State = 'picking' | 'scheduling' | 'booked'

export function BookMeetingCard({ actionId, contactName, contactEmail }: Props) {
  const { completeAction } = useAIStore()
  const { addToast } = useUIStore()
  const { addActivity } = useActivityStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [state, setState] = useState<State>('picking')

  function handleSchedule() {
    if (!selected) return
    setState('scheduling')
    setTimeout(() => {
      setState('booked')
      completeAction(actionId)
      const [day, time] = selected.split(' | ')
      addToast({
        type: 'calendar',
        title: 'Added to Google Calendar',
        subtitle: `ROI Call with ${contactName} — ${day} at ${time}`,
      })
      addActivity({
        id: `act-meeting-${Date.now()}`,
        deal_id: 'abc-corp-deal-001',
        contact_id: 'c002',
        type: 'meeting_booked',
        title: `Meeting booked with ${contactName}`,
        description: `${day} at ${time} — Google Calendar invite sent to ${contactEmail}`,
        occurred_at: new Date().toISOString(),
        created_by: 'rahulthakur@nexusai.com',
      })
    }, 1400)
  }

  if (state === 'booked') {
    const [day, time] = (selected ?? '').split(' | ')
    return (
      <div className="mt-3 rounded-xl border border-[#10B981]/20 bg-[#ECFDF5] p-3.5 animate-fade-in">
        <div className="flex items-start gap-2.5">
          <div className="shrink-0 mt-0.5"><CalendarIcon /></div>
          <div>
            <p className="text-xs font-semibold text-[#059669]">Meeting scheduled!</p>
            <p className="text-[11px] text-[#059669]/80 mt-0.5">{contactName} · {day} at {time}</p>
            <p className="text-[11px] text-[#059669]/60 mt-1">Calendar invite sent to {contactEmail}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-xl border border-[#10B981]/20 bg-[#ECFDF5] p-3.5 space-y-3">
      <p className="text-[11px] font-semibold text-[#059669] flex items-center gap-1.5">
        <Calendar className="h-3 w-3" /> Select a time slot
      </p>
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map(({ day, slots }) => (
          <div key={day}>
            <p className="text-[9px] font-semibold text-[#475569] mb-1.5 uppercase tracking-wider">{day}</p>
            <div className="space-y-1.5">
              {slots.map((time) => {
                const key = `${day} | ${time}`
                return (
                  <button key={key} onClick={() => setSelected(key)}
                    className={cn(
                      'w-full rounded-lg border px-2 py-1.5 text-[10px] font-mono font-medium text-left transition-all',
                      selected === key
                        ? 'border-blue-500/60 bg-blue-500/20 text-[#059669]'
                        : 'border-[#CBD5E1] bg-white text-[#0F172A] hover:border-[#059669]/50 hover:text-[#059669]'
                    )}>
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSchedule} disabled={!selected || state === 'scheduling'}
        style={{ background: '#059669' }}
        className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-90">
        {state === 'scheduling'
          ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Scheduling…</>
          : <><Calendar className="h-3.5 w-3.5" /> Schedule Now</>}
      </button>
    </div>
  )
}

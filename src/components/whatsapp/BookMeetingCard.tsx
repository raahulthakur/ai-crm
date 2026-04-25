import { useState } from 'react'
import { Calendar, CheckCircle2, Mail, Loader2 } from 'lucide-react'
import { useAIStore } from '@/store'
import { cn } from '@/lib/utils'

const SLOTS = [
  { day: 'Monday, Apr 28', slots: ['10:00 AM', '2:00 PM'] },
  { day: 'Tuesday, Apr 29', slots: ['11:00 AM', '3:00 PM', '4:30 PM'] },
]

interface Props {
  actionId: string
  contactName: string
  contactEmail: string
}

type State = 'picking' | 'scheduling' | 'booked'

export function BookMeetingCard({ actionId, contactName, contactEmail }: Props) {
  const { completeAction } = useAIStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [state, setState] = useState<State>('picking')

  function handleSchedule() {
    if (!selected) return
    setState('scheduling')
    setTimeout(() => {
      setState('booked')
      completeAction(actionId)
    }, 1500)
  }

  if (state === 'booked') {
    const [day, time] = (selected ?? '').split(' | ')
    return (
      <div className="mt-3 rounded-xl border border-green-200 bg-green-50 p-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">Meeting booked!</p>
            <p className="text-xs text-green-700 mt-0.5">{contactName} · {day} at {time}</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-green-700">
                <Calendar className="h-3 w-3" />
                Calendar invite sent to {contactEmail}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-green-700">
                <Mail className="h-3 w-3" />
                Gmail confirmation sent to you
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
      <p className="text-xs font-semibold text-blue-800 flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5" /> Select a time slot
      </p>
      <div className="grid grid-cols-2 gap-3">
        {SLOTS.map(({ day, slots }) => (
          <div key={day}>
            <p className="text-[10px] font-semibold text-gray-500 mb-1.5">{day}</p>
            <div className="space-y-1.5">
              {slots.map((time) => {
                const key = `${day} | ${time}`
                const isSelected = selected === key
                return (
                  <button key={key} onClick={() => setSelected(key)}
                    className={cn(
                      'w-full rounded-lg border px-3 py-1.5 text-xs font-medium transition-all text-left',
                      isSelected
                        ? 'border-blue-500 bg-blue-600 text-white'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                    )}>
                    {time}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleSchedule}
        disabled={!selected || state === 'scheduling'}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
        {state === 'scheduling' ? (
          <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Scheduling…</>
        ) : (
          <><Calendar className="h-3.5 w-3.5" /> Schedule Now</>
        )}
      </button>
    </div>
  )
}

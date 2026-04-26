import { useState } from 'react'
import { Calendar, CheckCircle2, Mail, Loader2 } from 'lucide-react'
import { useAIStore } from '@/store'
import { cn } from '@/lib/utils'

const SLOTS = [
  { day: 'Mon, Apr 28', slots: ['10:00 AM', '2:00 PM'] },
  { day: 'Tue, Apr 29', slots: ['11:00 AM', '3:00 PM', '4:30 PM'] },
  { day: 'Wed, Apr 30', slots: ['9:00 AM', '1:00 PM'] },
]

interface Props { actionId: string; contactName: string; contactEmail: string }
type State = 'picking' | 'scheduling' | 'booked'

export function BookMeetingCard({ actionId, contactName, contactEmail }: Props) {
  const { completeAction } = useAIStore()
  const [selected, setSelected] = useState<string | null>(null)
  const [state, setState] = useState<State>('picking')

  function handleSchedule() {
    if (!selected) return
    setState('scheduling')
    setTimeout(() => { setState('booked'); completeAction(actionId) }, 1400)
  }

  if (state === 'booked') {
    const [day, time] = (selected ?? '').split(' | ')
    return (
      <div className="mt-3 rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-3.5 animate-fade-in">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-emerald-300">Meeting booked!</p>
            <p className="text-[11px] text-emerald-500 mt-0.5">{contactName} · {day} at {time}</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                <Calendar className="h-3 w-3" /> Calendar invite → {contactEmail}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                <Mail className="h-3 w-3" /> Gmail confirmation sent to you
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-3.5 space-y-3">
      <p className="text-[11px] font-semibold text-blue-300 flex items-center gap-1.5">
        <Calendar className="h-3 w-3" /> Select a time slot
      </p>
      <div className="grid grid-cols-3 gap-2">
        {SLOTS.map(({ day, slots }) => (
          <div key={day}>
            <p className="text-[9px] font-semibold text-zinc-600 mb-1.5 uppercase tracking-wider">{day}</p>
            <div className="space-y-1.5">
              {slots.map((time) => {
                const key = `${day} | ${time}`
                return (
                  <button key={key} onClick={() => setSelected(key)}
                    className={cn(
                      'w-full rounded-lg border px-2 py-1.5 text-[10px] font-mono font-medium text-left transition-all',
                      selected === key
                        ? 'border-blue-500/60 bg-blue-500/20 text-blue-300'
                        : 'border-zinc-700/50 bg-zinc-800/50 text-zinc-400 hover:border-blue-500/30 hover:text-blue-400'
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
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        {state === 'scheduling'
          ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Scheduling…</>
          : <><Calendar className="h-3.5 w-3.5" /> Schedule Now</>}
      </button>
    </div>
  )
}

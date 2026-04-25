import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Calendar, FileText, ArrowRight, Sparkles, Clock, Bot } from 'lucide-react'
import confetti from 'canvas-confetti'
import { Avatar } from '@/components/shared/Avatar'
import { contacts } from '@/data/mockData'

const MEETING = {
  title: 'ROI Call — Rahul Mehta (CFO)',
  date: 'Monday, April 28',
  time: '11:00 AM',
  duration: '30 minutes',
  attendees: ['Rahul Mehta', 'Priya Sharma (CC)'],
  agenda: ['Thank CFO for budget approval', 'Align on implementation timeline', 'Next steps after DPDP clearance'],
}

const RECIPIENTS = [
  { contact: contacts[2], status: 'Delivered, Opened 1 min ago', opened: true },
  { contact: contacts[1], status: 'Delivered', opened: false },
  { contact: contacts[4], status: 'Delivered', opened: false },
]

const NEXT_STEPS = [
  'Follow up with IT Security in 24h if no DPDP response',
  'Send meeting reminder to CFO 1 hour before Monday call',
  'Prepare contract draft for post-call signature',
  'Brief Priya on Monday call agenda so she can prep CFO',
  'Schedule legal review of final contract within 48h of signing',
]

export function VictoryPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  useEffect(() => {
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.4 }, colors: ['#3b82f6', '#22c55e', '#a855f7'] })
    const timers = [
      setTimeout(() => setStep(1), 600),
      setTimeout(() => setStep(2), 1200),
      setTimeout(() => setStep(3), 1800),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="min-h-full bg-gray-50 p-6">
      <div className="mx-auto max-w-2xl space-y-5">
        {/* Hero */}
        {step >= 0 && (
          <div className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-blue-50 p-6 text-center animate-bounce-in">
            <div className="mb-3 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Sparkles className="h-7 w-7 text-green-600" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Actions Complete — ABC Corp Advancing!</h1>
            <p className="mt-1 text-sm text-gray-600">Deal jumped from 68% to 90% health. Likely to close this week.</p>
            <div className="mt-3 flex items-center justify-center gap-2">
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">90% Health</span>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">+22 points</span>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">Close imminent</span>
            </div>
          </div>
        )}

        {/* Meeting booked */}
        {step >= 1 && (
          <div className="rounded-xl border border-blue-200 bg-white p-5 shadow-sm animate-fade-in">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100">
                <Calendar className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Action 1: Meeting Booked</h2>
              <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-semibold text-gray-900">{MEETING.title}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-gray-600">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{MEETING.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{MEETING.time}</span>
                <span>{MEETING.duration}</span>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Calendar invite sent to: {MEETING.attendees.join(', ')}
              </div>
              <div className="mt-2">
                <p className="text-xs font-medium text-gray-700 mb-1">Meeting Agenda (AI Generated):</p>
                {MEETING.agenda.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DPDP sent */}
        {step >= 2 && (
          <div className="rounded-xl border border-teal-200 bg-white p-5 shadow-sm animate-fade-in">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100">
                <FileText className="h-4 w-4 text-teal-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">Action 2: DPDP Compliance Sent</h2>
              <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />
            </div>
            <div className="rounded-lg bg-teal-50 p-3 mb-3">
              <p className="text-xs font-medium text-gray-700">DPDP_Compliance_Certificate_2026.pdf</p>
              <p className="text-xs text-gray-500">Sent to 3 recipients</p>
            </div>
            <div className="space-y-2">
              {RECIPIENTS.map(({ contact, status, opened }) => (
                <div key={contact.id} className="flex items-center gap-3">
                  <Avatar name={contact.full_name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900">{contact.full_name}</p>
                    <p className="text-xs text-gray-500">{contact.email}</p>
                  </div>
                  <span className={`text-xs ${opened ? 'text-green-600 font-medium' : 'text-gray-500'}`}>{status}</span>
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI next steps */}
        {step >= 3 && (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm animate-fade-in">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100">
                <Bot className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">AI Auto-Scheduled Next Steps</h2>
            </div>
            <div className="space-y-2">
              {NEXT_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">{i + 1}</span>
                  <p className="text-xs text-gray-700 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA buttons */}
        {step >= 3 && (
          <div className="flex gap-3 animate-fade-in">
            <button onClick={() => navigate('/deals/abc-corp-deal-001')}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Return to Deal Room
            </button>
            <button onClick={() => navigate('/deals')}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
              View All Deals <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

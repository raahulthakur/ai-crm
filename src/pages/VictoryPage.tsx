import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Calendar,
  FileText,
  ArrowRight,
  Bot,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Avatar } from '@/components/shared/Avatar';
import { contacts } from '@/data/mockData';

const MEETING = {
  title: 'ROI Call — Rahul Mehta (CFO)',
  date: 'Monday, April 28',
  time: '11:00 AM',
  duration: '30 min',
  attendees: ['Rahul Mehta', 'Priya Sharma (CC)'],
  agenda: [
    'Thank CFO for budget approval',
    'Align on implementation timeline',
    'Next steps after DPDP clearance',
  ],
};

const RECIPIENTS = [
  { contact: contacts[2], status: 'Opened · 1 min ago', opened: true },
  { contact: contacts[1], status: 'Delivered', opened: false },
  { contact: contacts[4], status: 'Delivered', opened: false },
];

const NEXT_STEPS = [
  'Follow up with IT Security in 24h if no DPDP response',
  'Send meeting reminder to CFO 1h before Monday call',
  'Prepare contract draft for post-call signature',
  'Brief Priya on Monday agenda so she can prep CFO',
  'Schedule legal review within 48h of signing',
];

export function VictoryPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.35 },
      colors: ['#FBBF24', '#34D399', '#60A5FA', '#A78BFA'],
    });
    const ts = [
      setTimeout(() => setStep(1), 500),
      setTimeout(() => setStep(2), 1000),
      setTimeout(() => setStep(3), 1600),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className='min-h-full bg-zinc-950 p-6'>
      <div className='mx-auto max-w-2xl space-y-4'>
        {/* Hero */}
        {step >= 0 && (
          <div className='relative rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/8 via-zinc-900 to-emerald-500/5 p-6 text-center overflow-hidden animate-bounce-in'>
            <div className='relative z-10'>
              <div className='mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-4 py-1.5 text-sm font-display font-600 text-amber-400'>
                Actions Complete
              </div>
              <h1 className='font-display text-2xl font-800 tracking-tight text-zinc-50'>
                Razorpay Advancing
              </h1>
              <p className='mt-1 text-sm text-zinc-500'>
                Deal jumped from 68% to 90% health. Close imminent.
              </p>
              <div className='mt-4 flex items-center justify-center gap-2 flex-wrap'>
                <span className='rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-sm font-semibold text-emerald-400'>
                  90% Health
                </span>
                <span className='rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 font-mono text-sm font-semibold text-amber-400'>
                  +22 pts
                </span>
                <span className='rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-400'>
                  Close this week
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Meeting booked */}
        {step >= 1 && (
          <div className='rounded-xl border border-zinc-800 bg-zinc-900 p-5 animate-slide-up'>
            <div className='mb-3 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/25'>
                  <Calendar className='h-3 w-3 text-blue-400' />
                </div>
                <span className='font-display text-sm font-600 text-zinc-200'>
                  Meeting Booked
                </span>
              </div>
              <CheckCircle2 className='h-4 w-4 text-emerald-400' />
            </div>
            <div className='rounded-xl border border-zinc-800 bg-zinc-950/60 p-3.5'>
              <p className='text-xs font-semibold text-zinc-100'>
                {MEETING.title}
              </p>
              <div className='mt-1.5 flex items-center gap-3 text-[11px] text-zinc-500'>
                <span className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  {MEETING.date}
                </span>
                <span className='flex items-center gap-1'>
                  <Clock className='h-3 w-3' />
                  {MEETING.time}
                </span>
                <span>{MEETING.duration}</span>
              </div>
              <p className='mt-1.5 text-[11px] text-zinc-600'>
                Invite → {MEETING.attendees.join(', ')}
              </p>
              <div className='mt-2.5 space-y-1'>
                <p className='text-[10px] font-semibold uppercase tracking-wider text-zinc-600'>
                  Auto-generated agenda
                </p>
                {MEETING.agenda.map((item, i) => (
                  <div
                    key={i}
                    className='flex items-start gap-1.5 text-[11px] text-zinc-400'
                  >
                    <span className='mt-1 h-1 w-1 shrink-0 rounded-full bg-blue-500' />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* DPDP sent */}
        {step >= 2 && (
          <div className='rounded-xl border border-zinc-800 bg-zinc-900 p-5 animate-slide-up'>
            <div className='mb-3 flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-teal-500/20 border border-teal-500/25'>
                  <FileText className='h-3 w-3 text-teal-400' />
                </div>
                <span className='font-display text-sm font-600 text-zinc-200'>
                  DPDP Compliance Sent
                </span>
              </div>
              <CheckCircle2 className='h-4 w-4 text-emerald-400' />
            </div>
            <div className='mb-3 rounded-lg border border-zinc-800 bg-zinc-950/60 px-3 py-2.5'>
              <p className='font-mono text-xs font-semibold text-zinc-300'>
                DPDP_compliance_doc.pdf
              </p>
              <p className='text-[10px] text-zinc-600 mt-0.5'>
                Sent to 3 recipients
              </p>
            </div>
            <div className='space-y-2'>
              {RECIPIENTS.map(({ contact, status, opened }) => (
                <div key={contact.id} className='flex items-center gap-2.5'>
                  <Avatar
                    name={contact.full_name}
                    imageUrl={contact.avatar_url}
                    size='sm'
                  />
                  <div className='flex-1 min-w-0'>
                    <p className='text-[11px] font-semibold text-zinc-300'>
                      {contact.full_name}
                    </p>
                    <p className='text-[10px] text-zinc-600'>{contact.email}</p>
                  </div>
                  <span
                    className={`text-[10px] font-medium ${opened ? 'text-emerald-400' : 'text-zinc-600'}`}
                  >
                    {status}
                  </span>
                  <CheckCircle2 className='h-3.5 w-3.5 text-emerald-500 shrink-0' />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next steps */}
        {step >= 3 && (
          <div className='rounded-xl border border-zinc-800 bg-zinc-900 p-5 animate-slide-up'>
            <div className='mb-3 flex items-center gap-2'>
              <div className='flex h-6 w-6 items-center justify-center rounded-full bg-zinc-700/60 border border-zinc-700'>
                <Bot className='h-3 w-3 text-zinc-400' />
              </div>
              <span className='font-display text-sm font-600 text-zinc-200'>
                AI Auto-Scheduled Next Steps
              </span>
            </div>
            <div className='space-y-2'>
              {NEXT_STEPS.map((s, i) => (
                <div key={i} className='flex items-start gap-2.5'>
                  <span className='flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 font-mono text-[9px] font-semibold text-zinc-500 mt-0.5'>
                    {i + 1}
                  </span>
                  <p className='text-[11px] text-zinc-400 leading-relaxed'>
                    {s}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step >= 3 && (
          <div className='flex gap-3 animate-fade-in pb-4'>
            <button
              onClick={() => navigate('/deals/abc-corp-deal-001')}
              className='flex-1 rounded-xl border border-zinc-700 py-2.5 text-sm font-medium text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-colors'
            >
              Return to Deal Room
            </button>
            <button
              onClick={() => navigate('/deals')}
              className='flex flex-1 items-center justify-center gap-2 rounded-xl btn-amber py-2.5 text-sm'
            >
              View All Deals <ArrowRight className='h-4 w-4' />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

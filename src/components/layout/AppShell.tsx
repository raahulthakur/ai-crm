import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Zap,
  Bell,
  Settings,
  Users,
  Building2,
  Activity,
  BarChart2,
  Inbox,
  GitMerge,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  X,
  Mail,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatBot } from '@/components/chatbot/ChatBot';
import { useUIStore } from '@/store';

const NAV_SECTIONS = [
  {
    label: 'Sales',
    items: [
      { to: '/deals', label: 'Deals', icon: BarChart3 },
      { to: '/pipeline', label: 'Pipeline', icon: GitMerge },
      { to: '/contacts', label: 'Contacts', icon: Users },
      { to: '/companies', label: 'Companies', icon: Building2 },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { to: '/inbox', label: 'Inbox', icon: Inbox, badge: 3 },
      { to: '/activities', label: 'Activities', icon: Activity },
      { to: '/reports', label: 'Reports', icon: BarChart2 },
    ],
  },
];

const NOTIFICATIONS = [
  {
    id: '1',
    icon: 'warning',
    title: 'CFO not responding',
    body: 'Rahul Mehta (Razorpay) — silent for 12 days. Deal at risk.',
    time: '12d ago',
    read: false,
  },
  {
    id: '2',
    icon: 'doc',
    title: 'DPDP compliance required',
    body: 'Neha Kapoor (IT Security) is blocked pending certification docs.',
    time: '5d ago',
    read: false,
  },
  {
    id: '3',
    icon: 'success',
    title: 'Budget approved by CFO',
    body: 'Priya confirmed Rahul Mehta approved Razorpay budget.',
    time: '2h ago',
    read: true,
  },
];

function GmailToastIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect x='2' y='4' width='20' height='16' rx='2' fill='#EA4335' />
      <path
        d='M2 7l10 7 10-7'
        stroke='#fff'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
      <path
        d='M2 19l6-4.5M22 19l-6-4.5'
        stroke='#fff'
        strokeWidth='1.2'
        strokeLinecap='round'
        opacity='0.6'
      />
    </svg>
  );
}

function CalendarToastIcon() {
  return (
    <svg
      width='20'
      height='20'
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      <rect x='3' y='4' width='18' height='18' rx='2.5' fill='#1a73e8' />
      <rect x='3' y='4' width='18' height='7' rx='2.5' fill='#1a73e8' />
      <rect x='3' y='8' width='18' height='3' fill='#1565c0' />
      <rect x='3' y='11' width='18' height='11' rx='0' fill='white' />
      <text
        x='12'
        y='20'
        textAnchor='middle'
        fill='#1a73e8'
        fontSize='7'
        fontWeight='bold'
        fontFamily='sans-serif'
      >
        28
      </text>
      <line
        x1='8'
        y1='2'
        x2='8'
        y2='7'
        stroke='#1a73e8'
        strokeWidth='2'
        strokeLinecap='round'
      />
      <line
        x1='16'
        y1='2'
        x2='16'
        y2='7'
        stroke='#1a73e8'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  );
}

export function AppShell() {
  const location = useLocation();
  const { toasts, removeToast } = useUIStore();
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  const pageTitle = location.pathname.includes('victory')
    ? 'Deal Won'
    : location.pathname.includes('conversation')
      ? 'Live Update'
      : location.pathname.split('/').length > 2
        ? 'Deal Room'
        : 'All Deals';

  return (
    <div className='flex h-screen overflow-hidden bg-zinc-950'>
      {/* Sidebar */}
      <aside className='relative flex w-52 flex-col border-r border-zinc-800 bg-zinc-950'>
        <div className='absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400/80 via-amber-300/50 to-transparent' />

        <div className='flex items-center gap-2.5 px-4 py-5'>
          <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400'>
            <Zap className='h-3.5 w-3.5 fill-zinc-950 text-zinc-950' />
          </div>
          <div>
            <span className='font-display text-sm font-700 tracking-tight text-zinc-50'>
              CloseLoop
            </span>
            <span className='ml-1 rounded bg-amber-400/20 px-1 py-0.5 text-[9px] font-bold text-amber-400'>
              AI
            </span>
          </div>
        </div>

        <nav className='flex-1 overflow-y-auto px-2 pb-2'>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className='mb-3'>
              <p className='px-3 pb-1 text-[9px] font-semibold uppercase tracking-widest text-[#64748B]'>
                {section.label}
              </p>
              {section.items.map(({ to, label, icon: Icon, badge }) => {
                const active = location.pathname.startsWith(to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      'group relative mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                      active
                        ? 'bg-[#ECFDF5] text-[#065F46]'
                        : 'text-[#64748B] hover:bg-zinc-900 hover:text-[#0F172A]',
                    )}
                  >
                    {active && (
                      <span className='absolute left-0 inset-y-2 w-[3px] rounded-full bg-amber-400' />
                    )}
                    <Icon
                      className={cn(
                        'h-3.5 w-3.5 shrink-0',
                        active
                          ? 'text-[#059669]'
                          : 'text-[#475569] group-hover:text-[#475569]',
                      )}
                    />
                    <span className='flex-1'>{label}</span>
                    {badge && (
                      <span className='rounded-full bg-rose-500/20 px-1.5 text-[10px] font-semibold text-rose-400'>
                        {badge}
                      </span>
                    )}
                    {active && (
                      <ChevronRight className='h-3 w-3 text-[#059669]' />
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className='mx-3 border-t border-zinc-800' />
        <div className='p-3'>
          <div className='flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-zinc-900 cursor-pointer transition-colors'>
            <div className='flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-zinc-950 font-display'>
              RT
            </div>
            <div className='flex-1 min-w-0'>
              <p className='truncate text-xs font-semibold text-[#0F172A]'>
                Rahul Thakur
              </p>
              <p className='text-[10px] text-[#475569]'>Admin</p>
            </div>
            <Settings className='h-3.5 w-3.5 text-[#94A3B8] hover:text-[#475569] transition-colors' />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        <header className='flex h-11 items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-5 backdrop-blur-sm'>
          <h1 className='font-display text-sm font-600 tracking-tight text-[#0F172A]'>
            {pageTitle}
          </h1>

          {/* Bell button */}
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className='relative rounded-lg p-1.5 text-[#64748B] transition-colors hover:bg-zinc-900 hover:text-[#0F172A]'
          >
            <Bell className='h-4 w-4' />
            {unread > 0 && (
              <span className='absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500' />
            )}
          </button>
        </header>

        {/* Notification panel — fixed to avoid backdrop-blur stacking context */}
        {notifOpen && (
          <div className='fixed top-12 right-4 z-[200] w-80 rounded-xl border border-zinc-700/60 bg-zinc-900 shadow-2xl animate-fade-in'>
            <div className='flex items-center justify-between border-b border-zinc-800 px-4 py-3'>
              <p className='font-display text-sm font-600 text-[#0F172A]'>
                Notifications
              </p>
              <button
                onClick={() => setNotifOpen(false)}
                className='text-[#475569] hover:text-[#475569] transition-colors'
              >
                <X className='h-4 w-4' />
              </button>
            </div>
            <div className='divide-y divide-zinc-800'>
              {NOTIFICATIONS.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-zinc-800/40',
                    !n.read && 'bg-zinc-800/20',
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full',
                      n.icon === 'warning'
                        ? 'bg-rose-500/15'
                        : n.icon === 'success'
                          ? 'bg-emerald-500/15'
                          : 'bg-blue-500/15',
                    )}
                  >
                    {n.icon === 'warning' && (
                      <AlertTriangle className='h-3.5 w-3.5 text-rose-400' />
                    )}
                    {n.icon === 'success' && (
                      <CheckCircle2 className='h-3.5 w-3.5 text-emerald-400' />
                    )}
                    {n.icon === 'doc' && (
                      <Mail className='h-3.5 w-3.5 text-blue-400' />
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-center justify-between gap-2'>
                      <p className='text-xs font-semibold text-[#0F172A]'>
                        {n.title}
                      </p>
                      <span className='text-[10px] text-[#475569] shrink-0'>
                        {n.time}
                      </span>
                    </div>
                    <p className='text-[11px] text-[#64748B] mt-0.5 leading-relaxed'>
                      {n.body}
                    </p>
                  </div>
                  {!n.read && (
                    <span className='mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0' />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <main className='flex-1 overflow-auto bg-zinc-950'>
          <Outlet />
        </main>
      </div>

      {/* Toast notifications */}
      <div className='fixed bottom-24 right-6 z-[60] flex flex-col gap-2 pointer-events-none'>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className='flex items-start gap-3 rounded-xl border border-zinc-700/60 bg-zinc-900 px-4 py-3 shadow-2xl animate-slide-up pointer-events-auto min-w-[300px]'
          >
            <div className='shrink-0 mt-0.5'>
              {toast.type === 'gmail' ? (
                <GmailToastIcon />
              ) : (
                <CalendarToastIcon />
              )}
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-xs font-semibold text-zinc-100'>
                {toast.title}
              </p>
              <p className='text-[11px] text-[#64748B] mt-0.5 leading-relaxed'>
                {toast.subtitle}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className='text-[#475569] hover:text-[#475569] transition-colors shrink-0'
            >
              <X className='h-3.5 w-3.5' />
            </button>
          </div>
        ))}
      </div>

      <ChatBot />
    </div>
  );
}

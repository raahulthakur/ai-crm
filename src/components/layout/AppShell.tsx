import { Link, Outlet, useLocation } from 'react-router-dom'
import { BarChart3, Zap, Bell, Settings, Users, Building2, Activity, BarChart2, Inbox, GitMerge, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatBot } from '@/components/chatbot/ChatBot'

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
]

export function AppShell() {
  const location = useLocation()

  const pageTitle = location.pathname.includes('victory') ? 'Deal Won'
    : location.pathname.includes('conversation') ? 'Live Update'
    : location.pathname.split('/').length > 2 ? 'Deal Room'
    : 'All Deals'

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950">
      {/* Sidebar */}
      <aside className="relative flex w-52 flex-col border-r border-zinc-800 bg-zinc-950">
        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-amber-400/80 via-amber-300/50 to-transparent" />

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 py-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400">
            <Zap className="h-3.5 w-3.5 fill-zinc-950 text-zinc-950" />
          </div>
          <div>
            <span className="font-display text-sm font-700 tracking-tight text-zinc-50">Nexus</span>
            <span className="ml-1 rounded bg-amber-400/20 px-1 py-0.5 text-[9px] font-bold text-amber-400">AI</span>
          </div>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-3">
              <p className="px-3 pb-1 text-[9px] font-semibold uppercase tracking-widest text-zinc-700">{section.label}</p>
              {section.items.map(({ to, label, icon: Icon, badge }) => {
                const active = location.pathname.startsWith(to)
                return (
                  <Link key={to} to={to}
                    className={cn(
                      'group relative mb-0.5 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                      active ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
                    )}>
                    {active && <span className="absolute left-0 inset-y-2 w-[3px] rounded-full bg-amber-400" />}
                    <Icon className={cn('h-3.5 w-3.5 shrink-0', active ? 'text-amber-400' : 'text-zinc-600 group-hover:text-zinc-400')} />
                    <span className="flex-1">{label}</span>
                    {badge && (
                      <span className="rounded-full bg-rose-500/20 px-1.5 text-[10px] font-semibold text-rose-400">{badge}</span>
                    )}
                    {active && <ChevronRight className="h-3 w-3 text-zinc-600" />}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        <div className="mx-3 border-t border-zinc-800" />

        {/* User */}
        <div className="p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-zinc-900 cursor-pointer transition-colors">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-zinc-950 font-display">RT</div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-zinc-300">Rahul Thakur</p>
              <p className="text-[10px] text-zinc-600">Admin</p>
            </div>
            <Settings className="h-3.5 w-3.5 text-zinc-700 hover:text-zinc-400 transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-11 items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-5 backdrop-blur-sm">
          <h1 className="font-display text-sm font-600 tracking-tight text-zinc-200">{pageTitle}</h1>
          <button className="relative rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-zinc-300">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>
        </header>
        <main className="flex-1 overflow-auto bg-zinc-950">
          <Outlet />
        </main>
      </div>

      {/* AI Chatbot — floats over all pages */}
      <ChatBot />
    </div>
  )
}

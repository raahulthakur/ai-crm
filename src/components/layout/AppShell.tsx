import { Link, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Zap, Bell, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [{ to: '/deals', label: 'Deals', icon: BarChart3 }];

export function AppShell() {
  const location = useLocation();

  return (
    <div className='flex h-screen overflow-hidden bg-gray-50'>
      {/* Sidebar */}
      <aside className='flex w-56 flex-col border-r border-gray-200 bg-white'>
        {/* Logo */}
        <div className='flex items-center gap-2 border-b border-gray-200 px-4 py-4'>
          <div className='flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600'>
            <Zap className='h-4 w-4 text-white' />
          </div>
          <span className='font-semibold text-gray-900'>SL</span>
        </div>

        {/* Nav */}
        <nav className='flex-1 p-2'>
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                location.pathname.startsWith(to)
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
              )}
            >
              <Icon className='h-4 w-4' />
              {label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className='border-t border-gray-200 p-3'>
          <div className='flex items-center gap-2'>
            <div className='flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white'>
              RT
            </div>
            <div className='flex-1 min-w-0'>
              <p className='truncate text-xs font-medium text-gray-900'>
                Rahul Thakur
              </p>
              <p className='truncate text-xs text-gray-500'>Admin</p>
            </div>
            <Settings className='h-3.5 w-3.5 text-gray-400' />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Top bar */}
        <header className='flex h-12 items-center justify-between border-b border-gray-200 bg-white px-4'>
          <h1 className='text-sm font-semibold text-gray-900'>
            {location.pathname.includes('victory')
              ? 'Deal Won'
              : location.pathname.includes('conversation')
                ? 'Live Deal Update'
                : location.pathname.split('/').length > 2
                  ? 'Deal Room'
                  : 'All Deals'}
          </h1>
          <button className='relative rounded-lg p-1.5 text-gray-500 hover:bg-gray-50'>
            <Bell className='h-4 w-4' />
            <span className='absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500' />
          </button>
        </header>

        {/* Content */}
        <main className='flex-1 overflow-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

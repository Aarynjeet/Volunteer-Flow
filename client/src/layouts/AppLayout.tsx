import { useMemo, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { NotificationBell } from '../components/NotificationBell';
import { useAuth } from '../context/AuthContext';

type NavItem = { to: string; label: string };

export function AppLayout() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const items: NavItem[] = useMemo(() => {
    if (!user) {
      return [];
    }
    if (user.role === 'admin') {
      return [
        { to: '/admin/dashboard', label: 'Dashboard' },
        { to: '/admin/volunteers', label: 'Volunteers' },
        { to: '/admin/events', label: 'Events' },
        { to: '/admin/documents', label: 'Documents' },
        { to: '/admin/analytics', label: 'Analytics' },
      ];
    }
    if (user.role === 'volunteer') {
      return [
        { to: '/volunteer/dashboard', label: 'Dashboard' },
        { to: '/volunteer/profile', label: 'Profile' },
        { to: '/volunteer/events', label: 'Events' },
        { to: '/volunteer/applications', label: 'My Applications' },
        { to: '/volunteer/documents', label: 'Documents' },
        { to: '/volunteer/hours', label: 'Hours' },
      ];
    }
    return [
      { to: '/organizer/dashboard', label: 'Dashboard' },
      { to: '/organizer/events', label: 'Events' },
      { to: '/organizer/volunteers', label: 'Volunteers' },
    ];
  }, [user]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close mobile menu"
          className="fixed inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}
      <aside
        className={`${
          expanded ? 'lg:w-56' : 'lg:w-16'
        } fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-200 px-2">
          <div className={`truncate text-sm font-semibold text-slate-900 ${expanded ? 'lg:block' : 'lg:hidden'} block`}>
            Menu
          </div>
          <button
            type="button"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle sidebar"
            onClick={() => setExpanded((v) => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <nav className="space-y-1 p-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700 hover:bg-slate-100'
                } ${expanded ? 'lg:text-left' : 'lg:text-center'} text-left`
              }
              title={item.label}
              onClick={() => setMobileMenuOpen(false)}
            >
              {expanded ? item.label : <span className="hidden lg:inline">{item.label.slice(0, 1)}</span>}
              {!expanded ? <span className="lg:hidden">{item.label}</span> : null}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-14 items-center justify-between border-b border-slate-200 bg-white px-3 py-2 sm:px-4 lg:px-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open mobile menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-base font-semibold text-slate-900 sm:text-lg">VolunteerFlow</div>
          </div>
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <NotificationBell />
            <div className="hidden max-w-36 truncate text-sm text-slate-700 sm:block">{user?.name}</div>
            <button
              type="button"
              className="rounded-md bg-slate-900 px-2 py-2 text-xs font-medium text-white hover:bg-slate-800 sm:px-3 sm:text-sm"
              onClick={() => void logout()}
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

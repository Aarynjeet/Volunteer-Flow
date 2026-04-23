import { useMemo, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { NotificationBell } from '../components/NotificationBell';
import { ThemeToggle } from '../components/ThemeToggle';
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
    <div className="vf-page flex min-h-screen">
      {mobileMenuOpen ? (
        <button
          type="button"
          aria-label="Close mobile menu"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}
      <aside
        className={`${
          expanded ? 'lg:w-56' : 'lg:w-16'
        } fixed inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-[#E2DDD5] bg-[#F2F0E8] transition-transform duration-200 dark:border-[#2D3E2D] dark:bg-[#1A2E1A] lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-[#E2DDD5] px-2 dark:border-[#2D3E2D]">
          <div className={`truncate text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4] ${expanded ? 'lg:block' : 'lg:hidden'} block`}>
            Menu
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-[#4A5568] transition-colors hover:bg-[#D8F3DC] dark:text-[#A8B2A8] dark:hover:bg-[#1E2E1E]"
            aria-label="Toggle sidebar"
            onClick={() => setExpanded((v) => !v)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2 p-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#D8F3DC] text-[#2D6A4F] dark:bg-[#1E2E1E] dark:text-[#52B788]'
                    : 'text-[#4A5568] hover:bg-[#D8F3DC] hover:text-[#2D6A4F] dark:text-[#A8B2A8] dark:hover:bg-[#1E2E1E] dark:hover:text-[#52B788]'
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
        <header className="flex items-center justify-between border-b border-[#E2DDD5] bg-[#FAFAF7] px-6 py-3 dark:border-[#2D3E2D] dark:bg-[#0F1A0F]">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              className="rounded-xl p-2 text-[#4A5568] transition-colors hover:bg-[#D8F3DC] dark:text-[#A8B2A8] dark:hover:bg-[#1E2E1E] lg:hidden"
              aria-label="Open mobile menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex cursor-pointer items-center gap-2.5 no-underline">
              <Logo className="shrink-0" />
              <div className="text-xl font-bold text-[#2D6A4F] dark:text-[#52B788]">VolunteerFlow</div>
            </Link>
          </div>
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            <ThemeToggle />
            <NotificationBell />
            <div className="hidden max-w-36 truncate text-sm text-[#4A5568] dark:text-[#A8B2A8] sm:block">{user?.name}</div>
            <button
              type="button"
              className="vf-btn-secondary px-3 py-2 text-xs sm:text-sm"
              onClick={() => void logout()}
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

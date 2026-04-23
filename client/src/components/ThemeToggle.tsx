import { useLayoutEffect, useState } from 'react';

const STORAGE_KEY = 'volunteerflow-theme';

function readStoredTheme(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark';
  } catch {
    return false;
  }
}

function applyDarkClass(isDark: boolean) {
  document.documentElement.classList.toggle('dark', isDark);
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => (typeof window !== 'undefined' ? readStoredTheme() : false));

  useLayoutEffect(() => {
    const stored = readStoredTheme();
    setIsDark(stored);
    applyDarkClass(stored);
  }, []);

  const toggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      applyDarkClass(next);
      try {
        localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
      } catch {
        /* ignore quota / private mode */
      }
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E2DDD5] bg-[#FAFAF7] text-[#2D6A4F] transition-colors hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:text-[#52B788] dark:hover:border-[#52B788]"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <span className="relative block h-5 w-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 h-5 w-5 transition-opacity duration-200 ${isDark ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 h-5 w-5 transition-opacity duration-200 ${isDark ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
          aria-hidden
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </button>
  );
}

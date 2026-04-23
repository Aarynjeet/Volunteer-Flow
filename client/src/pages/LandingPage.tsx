import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { ThemeToggle } from '../components/ThemeToggle';

const t = {
  transition: 'transition-all duration-200 ease-in-out',
  max: 'mx-auto max-w-6xl px-4 sm:px-6',
  body: 'text-lg leading-relaxed text-[#4A5568] dark:text-[#A8B2A8]',
  heading: 'font-bold text-[#1A1A1A] dark:text-[#F0EDE4]',
} as const;

function IconUsers({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.433-2.054A4.125 4.125 0 0012 19.128z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-2.485 0-4.5-2.015-4.5-4.5S9.515 5.25 12 5.25s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconDocCheck({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5a2.25 2.25 0 012.25 2.25v7.5" />
    </svg>
  );
}

function IconClipboard({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664M5.25 5.25h13.5m-13.5 0a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 005.25 21h13.5a2.25 2.25 0 002.25-2.25V7.5a2.25 2.25 0 00-2.25-2.25m-13.5 0V4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V5.25m-4.5 0h18" />
    </svg>
  );
}

const avatarPalettes = {
  mint: { bg: '#D8F3DC', feature: '#2D6A4F' },
  cream: { bg: '#F2F0E8', feature: '#1B4332' },
  mist: { bg: '#E8EDE9', feature: '#4A5568' },
  pine: { bg: '#CFE8D5', feature: '#1B4332' },
} as const;

function AvatarFace({ className, variant = 'mint' }: { className?: string; variant?: keyof typeof avatarPalettes }) {
  const { bg, feature } = avatarPalettes[variant];
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <circle cx="20" cy="20" r="20" fill={bg} />
      <circle cx="14" cy="17" r="2.5" fill={feature} />
      <circle cx="26" cy="17" r="2.5" fill={feature} />
      <path d="M12 26c2.5 3 5.5 4.5 8 4.5s5.5-1.5 8-4.5" fill="none" stroke={feature} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function StarsFive({ className }: { className?: string }) {
  return (
    <div className={`flex gap-0.5 text-[#2D6A4F] dark:text-[#52B788] ${className ?? ''}`} aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function HeroMockupIllustration() {
  return (
    <svg viewBox="0 0 320 280" className="h-auto w-full max-w-md" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect
        x="8"
        y="8"
        width="304"
        height="264"
        rx="16"
        strokeWidth="2"
        className="fill-[#FAFAF7] stroke-[#E2DDD5] dark:fill-[#1E2E1E] dark:stroke-[#2D3E2D]"
      />
      <rect x="28" y="28" width="120" height="10" rx="4" className="fill-[#CBD5C8] dark:fill-[#2D3E2D]" />
      <rect x="28" y="48" width="200" height="8" rx="3" className="fill-[#E2DDD5] dark:fill-[#2D3E2D]" />
      <rect x="28" y="64" width="160" height="8" rx="3" className="fill-[#E2DDD5] dark:fill-[#2D3E2D]" />
      <rect
        x="28"
        y="96"
        width="264"
        height="72"
        rx="12"
        strokeWidth="1"
        className="fill-[#D8F3DC] stroke-[#95C9A8] dark:fill-[#1A2E1A] dark:stroke-[#2D3E2D]"
      />
      <rect x="48" y="116" width="100" height="8" rx="3" className="fill-[#2D6A4F]/35 dark:fill-[#52B788]/40" />
      <rect x="48" y="132" width="72" height="6" rx="2" className="fill-[#94A398] dark:fill-[#A8B2A8]" />
      <circle cx="260" cy="132" r="14" className="fill-[#2D6A4F]/20 dark:fill-[#52B788]/30" />
      <path
        d="M254 132l4 4 8-8"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-[#2D6A4F] dark:stroke-[#52B788]"
      />
      <rect
        x="28"
        y="184"
        width="264"
        height="64"
        rx="12"
        strokeWidth="1"
        className="fill-[#F2F0E8] stroke-[#E2DDD5] dark:fill-[#1A2E1A] dark:stroke-[#2D3E2D]"
      />
      <rect x="48" y="204" width="56" height="6" rx="2" className="fill-[#CBD5C8] dark:fill-[#2D3E2D]" />
      <rect x="48" y="218" width="120" height="6" rx="2" className="fill-[#E2DDD5] dark:fill-[#2D3E2D]" />
      <rect x="220" y="208" width="56" height="28" rx="6" className="fill-[#2D6A4F] dark:fill-[#52B788]" />
    </svg>
  );
}

function SocialIconTwitter({ className }: { className?: string }) {
  return (
    <a href="#" className={className} aria-label="X (Twitter)" rel="noopener noreferrer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    </a>
  );
}

function SocialIconLinkedIn({ className }: { className?: string }) {
  return (
    <a href="#" className={className} aria-label="LinkedIn" rel="noopener noreferrer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </a>
  );
}

function SocialIconGitHub({ className }: { className?: string }) {
  return (
    <a href="#" className={className} aria-label="GitHub" rel="noopener noreferrer">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    </a>
  );
}

export function LandingPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrollTop = window.scrollY ?? el.scrollTop;
      const scrollable = el.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, ratio)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFAF7] antialiased text-[#4A5568] dark:bg-[#141A14] dark:text-[#A8B2A8]">
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-[100] h-1 w-full" aria-hidden>
        <div
          className="h-full bg-[#2D6A4F] transition-all duration-75 ease-out dark:bg-[#52B788]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className="mt-1 border-b border-[#E2DDD5] bg-[#FAFAF7] dark:border-[#2D3E2D] dark:bg-[#0F1A0F]">
        <nav className={`${t.max} flex flex-col gap-4 py-3 md:flex-row md:items-center md:justify-between`}>
          <Link to="/" className="self-center md:self-auto">
            <div className="flex items-center gap-2.5">
              <Logo className="shrink-0" />
              <span className="text-2xl font-bold leading-none text-[#2D6A4F] dark:text-[#52B788]">VolunteerFlow</span>
            </div>
          </Link>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <ThemeToggle />
            <Link
              to="/login"
              className="border-2 border-stone-300 dark:border-stone-600 text-stone-700 dark:text-stone-300 hover:border-green-700 hover:text-green-700 dark:hover:border-green-400 dark:hover:text-green-400 rounded-xl px-5 py-2 font-semibold transition-all duration-200"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-[#2D6A4F] dark:bg-[#52B788] border-2 border-[#1B4332] dark:border-[#74C69D] text-white dark:text-[#141A14] hover:bg-[#1B4332] dark:hover:bg-[#74C69D] rounded-xl px-5 py-2 font-semibold transition-all duration-200"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section
        className="flex min-h-[80vh] flex-col justify-center border-b border-[#E2DDD5] bg-gradient-to-br from-[#D8F3DC]/50 via-[#FAFAF7] to-[#F2F0E8] py-16 dark:border-[#2D3E2D] dark:from-[#1A2E1A] dark:via-[#141A14] dark:to-[#1A2E1A]"
        aria-labelledby="hero-heading"
      >
        <div className={`${t.max} flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-12`}>
          <div className="w-full lg:w-[58%] lg:max-w-none">
            <h1
              id="hero-heading"
              className="text-3xl font-extrabold leading-tight tracking-tight text-[#1A1A1A] dark:text-[#F0EDE4] sm:text-4xl lg:text-6xl lg:leading-[1.05]"
            >
              The volunteer platform your <span className="text-[#2D6A4F] dark:text-[#52B788]">nonprofit</span>{' '}
              <span className="text-[#2D6A4F] dark:text-[#52B788]">actually needs</span>
            </h1>
            <p className={`mt-6 max-w-xl ${t.body}`}>
              One place for applications, events, hour approvals, and document review—so program staff spend less time in inboxes and more time with volunteers.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <a
                href="#features"
                className={`inline-flex items-center justify-center rounded-xl bg-[#2D6A4F] px-6 py-3 text-center text-base font-semibold text-white shadow-lg shadow-green-200 hover:bg-[#1B4332] dark:bg-[#52B788] dark:text-[#141A14] dark:shadow-green-900/40 dark:hover:bg-[#74C69D] ${t.transition} hover:scale-[1.02] active:scale-[0.98]`}
              >
                Get started
              </a>
              <Link
                to="/login"
                className={`inline-flex items-center justify-center rounded-xl border-2 border-[#E2DDD5] bg-[#FAFAF7] px-6 py-3 text-center text-base font-semibold text-[#1A1A1A] hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:text-[#F0EDE4] dark:hover:border-[#52B788] ${t.transition} hover:scale-[1.02] active:scale-[0.98]`}
              >
                Log in
              </Link>
            </div>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <p className="text-sm font-semibold text-[#4A5568] dark:text-[#A8B2A8]">Trusted by 500+ nonprofits</p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <AvatarFace variant="mint" className="relative z-[1] h-10 w-10 rounded-full ring-2 ring-[#FAFAF7] dark:ring-[#1E2E1E]" />
                  <AvatarFace variant="cream" className="relative z-[2] h-10 w-10 rounded-full ring-2 ring-[#FAFAF7] dark:ring-[#1E2E1E]" />
                  <AvatarFace variant="mist" className="relative z-[3] h-10 w-10 rounded-full ring-2 ring-[#FAFAF7] dark:ring-[#1E2E1E]" />
                  <AvatarFace variant="pine" className="relative z-[4] h-10 w-10 rounded-full ring-2 ring-[#FAFAF7] dark:ring-[#1E2E1E]" />
                </div>
                <StarsFive />
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center lg:w-[42%] lg:justify-end">
            <HeroMockupIllustration />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-20 border-b border-[#E2DDD5] bg-[#FAFAF7] py-16 dark:border-[#2D3E2D] dark:bg-[#141A14]"
      >
        <div className={t.max}>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#2D6A4F] dark:text-[#52B788]">Features</p>
          <h2 className={`mt-3 text-4xl ${t.heading}`}>Built for real coordination work</h2>
          <p className={`mt-4 max-w-2xl ${t.body}`}>Role-aware workflows keep volunteers, organizers, and admins aligned without duplicate data entry.</p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <article className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:border-[#2D6A4F] hover:shadow-lg hover:shadow-green-200 dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788] dark:hover:shadow-black/30">
              <div className="inline-flex rounded-xl bg-[#D8F3DC] p-3 text-[#2D6A4F] dark:bg-[#1A2E1A] dark:text-[#74C69D]">
                <IconUsers className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#1A1A1A] dark:text-[#F0EDE4]">Manage volunteers</h3>
              <p className={`mt-4 ${t.body}`}>
                Profiles, skills, and availability stay current so coordinators match people to shifts without digging through attachments.
              </p>
            </article>
            <article className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:border-[#2D6A4F] hover:shadow-lg hover:shadow-green-200 dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788] dark:hover:shadow-black/30">
              <div className="inline-flex rounded-xl bg-[#E8F5EC] p-3 text-[#1B4332] dark:bg-[#1A2E1A] dark:text-[#52B788]">
                <IconClock className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#1A1A1A] dark:text-[#F0EDE4]">Track hours</h3>
              <p className={`mt-4 ${t.body}`}>
                Volunteers submit hours tied to events; admins approve in bulk for finance and grant reporting with a clear history.
              </p>
            </article>
            <article className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-1.5 hover:border-[#2D6A4F] hover:shadow-lg hover:shadow-green-200 dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788] dark:hover:shadow-black/30">
              <div className="inline-flex rounded-xl bg-[#CFE8D5] p-3 text-[#1B4332] dark:bg-[#243524] dark:text-[#A8D8B9]">
                <IconDocCheck className="h-8 w-8" />
              </div>
              <h3 className="mt-6 text-xl font-bold text-[#1A1A1A] dark:text-[#F0EDE4]">Approve documents</h3>
              <p className={`mt-4 ${t.body}`}>
                IDs and certifications land in one review queue with statuses and reasons—so nothing falls through email cracks.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative border-b border-[#E2DDD5] bg-[#F2F0E8] py-16 dark:border-[#2D3E2D] dark:bg-[#1A2E1A]">
        <div className={t.max}>
          <h2 className={`text-4xl ${t.heading}`}>How it works</h2>
          <p className={`mt-4 max-w-2xl ${t.body}`}>Three steps from signup to approved hours—no custom spreadsheets required.</p>

          <div className="relative mt-12 hidden md:block">
            <div
              className="absolute left-[8%] right-[8%] top-8 border-t-2 border-dashed border-[#95C9A8] dark:border-[#2D3E2D]"
              aria-hidden
            />
          </div>

          <div className="relative z-10 mt-8 grid grid-cols-1 gap-12 md:mt-0 md:grid-cols-3 md:gap-8">
            {[
              {
                n: '01',
                title: 'Create an account',
                body: 'Admins, organizers, and volunteers each onboard with the right permissions from day one.',
                Icon: IconUsers,
              },
              {
                n: '02',
                title: 'Join or post events',
                body: 'Publish shifts and programs, collect applications, and keep everyone on the same timeline.',
                Icon: IconCalendar,
              },
              {
                n: '03',
                title: 'Track and approve hours',
                body: 'Submit time against events; staff review and lock in totals for leadership and auditors.',
                Icon: IconClipboard,
              },
            ].map((step) => (
              <div
                key={step.n}
                className="relative rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]"
              >
                <span className="pointer-events-none absolute left-6 top-4 z-0 select-none text-5xl font-black leading-none text-[#D8F3DC] dark:text-[#2D3E2D]">
                  {step.n}
                </span>
                <div className="relative z-10 pt-10">
                  <div className="inline-flex rounded-xl bg-[#2D6A4F] p-3 text-white dark:bg-[#52B788] dark:text-[#141A14]">
                    <step.Icon className="h-8 w-8" />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-[#1A1A1A] dark:text-[#F0EDE4]">{step.title}</h3>
                  <p className={`mt-3 ${t.body}`}>{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-[#E2DDD5] border-t-2 border-[#2D6A4F] bg-[#1A2E1A] py-16 text-[#F0EDE4] dark:border-b-[#2D3E2D] dark:border-t-[#52B788] dark:bg-[#0F1A0F]">
        <div className={`${t.max} grid grid-cols-1 gap-10 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-8`}>
          {[
            { v: '500+', l: 'Volunteers' },
            { v: '1,200+', l: 'Hours logged' },
            { v: '50+', l: 'Events' },
            { v: '500+', l: 'Nonprofits' },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-5xl font-extrabold text-[#74C69D] dark:text-[#52B788]">{s.v}</p>
              <p className="mt-3 text-sm font-medium uppercase tracking-wide text-[#A8B2A8]">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-[#E2DDD5] bg-[#FAFAF7] py-16 dark:border-[#2D3E2D] dark:bg-[#141A14]">
        <div className={t.max}>
          <h2 className={`text-4xl ${t.heading}`}>What teams say</h2>
          <p className={`mt-4 max-w-2xl ${t.body}`}>Real coordination wins from organizations running busy volunteer programs.</p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                accent: 'forest' as const,
                quote:
                  'Managing 200 volunteers across 12 events used to mean spreadsheets and constant email. VolunteerFlow cut our coordination time in half.',
                name: 'Jordan Ellis',
                role: 'Director of Programs',
                org: 'Community Food Network',
              },
              {
                accent: 'grove' as const,
                quote:
                  'Approvals and hour logs finally live in one system our board can trust. Grant season is less painful every year.',
                name: 'Sam Rivera',
                role: 'Volunteer Coordinator',
                org: 'Riverfront Arts Alliance',
              },
              {
                accent: 'ridge' as const,
                quote:
                  'We onboard seasonal help in days instead of weeks. Organizers see applications without me forwarding PDFs.',
                name: 'Morgan Chen',
                role: 'Operations Lead',
                org: 'Urban Green Initiative',
              },
            ].map((c) => (
              <blockquote
                key={c.name}
                className={`rounded-2xl border border-[#E2DDD5] border-l-4 p-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md dark:border-[#2D3E2D] ${
                  c.accent === 'forest'
                    ? 'border-l-[#2D6A4F] bg-[#D8F3DC]/40 hover:border-l-[#1B4332] dark:border-l-[#52B788] dark:bg-[#1E2E1E]/90 dark:hover:border-l-[#74C69D]'
                    : c.accent === 'grove'
                      ? 'border-l-[#1B4332] bg-[#E8F5EC]/60 hover:border-l-[#2D6A4F] dark:border-l-[#74C69D] dark:bg-[#1E2E1E]/90 dark:hover:border-l-[#52B788]'
                      : 'border-l-[#40916C] bg-[#CFE8D5]/50 hover:border-l-[#1B4332] dark:border-l-[#95C9A8] dark:bg-[#1E2E1E]/90 dark:hover:border-l-[#52B788]'
                }`}
              >
                <p className="text-base leading-relaxed text-[#4A5568] dark:text-[#A8B2A8]">&ldquo;{c.quote}&rdquo;</p>
                <footer className="mt-6 border-t border-[#E2DDD5] pt-4 dark:border-[#2D3E2D]">
                  <p className="font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{c.name}</p>
                  <p className="text-sm text-[#4A5568] dark:text-[#A8B2A8]">
                    {c.role}, {c.org}
                  </p>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="relative overflow-hidden bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#40916C] py-16 dark:from-[#0F1A0F] dark:via-[#1A2E1A] dark:to-[#2D6A4F]"
        aria-labelledby="cta-heading"
      >
        <svg
          className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-10"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <defs>
            <pattern id="ctaGrid" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" fill="white" />
              <circle cx="15" cy="15" r="1.5" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ctaGrid)" />
        </svg>
        <div className={`${t.max} relative z-10 text-center`}>
          <h2 id="cta-heading" className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
            Bring every volunteer touchpoint into one workflow
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-[#F0EDE4]/90 dark:text-[#A8B2A8]">
            Start in minutes, invite your team when you are ready. No credit card required to explore the basics.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className={`inline-flex min-w-[200px] items-center justify-center rounded-xl bg-[#FAFAF7] px-8 py-3 text-base font-semibold text-[#1B4332] shadow-lg shadow-green-200 dark:bg-[#F0EDE4] dark:text-[#141A14] dark:shadow-black/30 ${t.transition} hover:scale-[1.02] active:scale-[0.98]`}
            >
              Create free account
            </Link>
            <Link
              to="/login"
              className={`inline-flex min-w-[200px] items-center justify-center rounded-xl border-2 border-white px-8 py-3 text-base font-semibold text-white dark:border-[#F0EDE4] dark:text-[#F0EDE4] ${t.transition} hover:scale-[1.02] hover:bg-white/10 active:scale-[0.98]`}
            >
              Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2D3E2D] bg-[#1A2E1A] pb-10 pt-16 text-[#A8B2A8] dark:bg-[#0F1A0F]">
        <div className={`${t.max} grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4`}>
          <div>
            <div className="flex items-center gap-2.5">
              <Logo className="shrink-0" />
              <span className="text-xl font-bold text-[#74C69D] dark:text-[#52B788]">VolunteerFlow</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#A8B2A8] dark:text-[#A8B2A8]">
              Operations software for nonprofits that run on volunteers—events, hours, and documents in one place.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#A8B2A8] dark:text-[#A8B2A8]">Product</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#features" className="text-[#F0EDE4]/90 transition-colors hover:text-[#FAFAF7] dark:text-[#F0EDE4]/90">
                  Features
                </a>
              </li>
              <li>
                <Link to="/register" className="text-[#F0EDE4]/90 transition-colors hover:text-[#FAFAF7] dark:text-[#F0EDE4]/90">
                  Pricing / Sign up
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#F0EDE4]/90 transition-colors hover:text-[#FAFAF7] dark:text-[#F0EDE4]/90">
                  Log in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#A8B2A8] dark:text-[#A8B2A8]">Company</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#" className="text-[#F0EDE4]/90 transition-colors hover:text-[#FAFAF7] dark:text-[#F0EDE4]/90">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-[#F0EDE4]/90 transition-colors hover:text-[#FAFAF7] dark:text-[#F0EDE4]/90">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-[#F0EDE4]/90 transition-colors hover:text-[#FAFAF7] dark:text-[#F0EDE4]/90">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#A8B2A8] dark:text-[#A8B2A8]">Legal</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#" className="text-[#F0EDE4]/90 transition-colors hover:text-[#FAFAF7] dark:text-[#F0EDE4]/90">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-[#F0EDE4]/90 transition-colors hover:text-[#FAFAF7] dark:text-[#F0EDE4]/90">
                  Terms
                </a>
              </li>
              <li>
                <a href="#" className="text-[#F0EDE4]/90 transition-colors hover:text-[#FAFAF7] dark:text-[#F0EDE4]/90">
                  Security
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          className={`${t.max} mt-12 flex flex-col items-start justify-between gap-6 border-t border-[#2D3E2D] pt-8 sm:flex-row sm:items-center dark:border-[#2D3E2D]`}
        >
          <p className="text-sm text-[#A8B2A8] dark:text-[#A8B2A8]">© {new Date().getFullYear()} VolunteerFlow. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[#A8B2A8]">
            <SocialIconTwitter className="text-[#A8B2A8] transition-colors hover:text-[#74C69D] dark:hover:text-[#52B788]" />
            <SocialIconLinkedIn className="text-[#A8B2A8] transition-colors hover:text-[#74C69D] dark:hover:text-[#52B788]" />
            <SocialIconGitHub className="text-[#A8B2A8] transition-colors hover:text-[#74C69D] dark:hover:text-[#52B788]" />
          </div>
        </div>
      </footer>
    </div>
  );
}

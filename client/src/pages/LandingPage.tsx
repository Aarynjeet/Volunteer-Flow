import { Link } from 'react-router-dom';

/**
 * Landing-only design tokens (8pt spacing scale, single accent, one radius, one shadow family).
 * Spacing: Tailwind 2→8px, 4→16px, 6→24px, 8→32px, 12→48px, 16→64px, 24→96px.
 */
const tw = {
  transition: 'transition-all duration-200 ease-in-out',
  maxContent: 'mx-auto max-w-6xl px-4 sm:px-6',
  sectionY: 'py-16 md:py-24',
  headingHero:
    'font-sans text-4xl font-bold leading-[1.1] tracking-tight text-[#0F1117] sm:text-5xl md:text-[56px]',
  headingSection: 'font-sans text-4xl font-semibold leading-tight tracking-tight text-[#0F1117]',
  headingCard: 'font-sans text-xl font-semibold leading-snug text-[#0F1117]',
  body: 'font-sans text-base font-normal leading-relaxed text-[#6B7280]',
  caption: 'font-sans text-sm font-medium leading-normal text-[#6B7280]',
  navLink:
    'group relative font-sans text-sm font-medium text-[#0F1117] transition-all duration-200 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#2563EB] after:transition-all after:duration-200 after:ease-in-out hover:after:scale-x-100',
  footerLink:
    'group relative font-sans text-sm font-medium text-[#6B7280] transition-all duration-200 ease-in-out after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-[#2563EB] after:transition-all after:duration-200 after:ease-in-out hover:text-[#0F1117] hover:after:scale-x-100',
  primaryBtn:
    'inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-6 py-4 font-sans text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-[#1D4ED8] active:scale-[0.98]',
  ghostBtn:
    'inline-flex items-center justify-center rounded-lg border border-neutral-200 bg-white px-6 py-4 font-sans text-sm font-semibold text-[#0F1117] transition-all duration-200 ease-in-out hover:scale-[1.02] hover:bg-neutral-50 active:scale-[0.98]',
  featureCard:
    'rounded-lg border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-md md:p-8',
  stepCard:
    'rounded-lg border border-neutral-200 bg-white p-6 transition-all duration-200 ease-in-out hover:border-[#2563EB] md:p-8',
} as const;

function IconUsers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.433-2.054A4.125 4.125 0 0012 19.128z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-2.485 0-4.5-2.015-4.5-4.5S9.515 5.25 12 5.25s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function IconDocCheck() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] font-sans antialiased">
      <header className={`border-b border-neutral-200 bg-[#FFFFFF] ${tw.transition}`}>
        <nav className={`${tw.maxContent} flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between`}>
          <div className="text-xl font-semibold text-[#0F1117]">VolunteerFlow</div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <Link to="/login" className={`${tw.navLink} py-2 text-center sm:text-left`}>
              Login
            </Link>
            <Link
              to="/register"
              className={`rounded-lg bg-[#2563EB] px-6 py-4 text-center font-sans text-sm font-semibold text-white ${tw.transition} hover:scale-[1.02] hover:bg-[#1D4ED8] active:scale-[0.98] sm:w-auto`}
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      <section
        className={`flex min-h-screen flex-col justify-center ${tw.sectionY} ${tw.maxContent}`}
        aria-labelledby="hero-heading"
      >
        <div className="max-w-4xl">
          <h1 id="hero-heading" className={tw.headingHero}>
            Coordinate volunteers, events, and hours for your nonprofit—in one place.
          </h1>
          <p className={`mt-6 max-w-2xl ${tw.body}`}>
            VolunteerFlow gives staff and organizers a single workflow to onboard volunteers, run programs, and approve time and documents without spreadsheets.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <a href="#features" className={`${tw.primaryBtn} w-full text-center sm:w-auto`}>
              Get Started
            </a>
            <Link to="/login" className={`${tw.ghostBtn} w-full text-center sm:w-auto`}>
              Login
            </Link>
          </div>
          <p className={`mt-6 ${tw.caption}`}>
            New to VolunteerFlow?{' '}
            <Link to="/register" className="font-semibold text-[#2563EB] underline-offset-4 transition-all duration-200 ease-in-out hover:text-[#1D4ED8] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </section>

      <section id="features" className={`${tw.sectionY} scroll-mt-24 bg-[#FFFFFF]`}>
        <div className={tw.maxContent}>
          <h2 className={tw.headingSection}>What you can do</h2>
          <p className={`mt-4 max-w-2xl ${tw.body}`}>Core capabilities teams use week after week to stay compliant and organized.</p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
            <article className={tw.featureCard}>
              <div className="text-neutral-700" aria-hidden>
                <IconUsers />
              </div>
              <h3 className={`mt-6 ${tw.headingCard}`}>Manage Volunteers</h3>
              <p className={`mt-4 ${tw.body}`}>
                Centralize contact details, skills, availability, and emergency contacts so coordinators assign shifts without chasing threads.
              </p>
            </article>
            <article className={tw.featureCard}>
              <div className="text-neutral-700" aria-hidden>
                <IconClock />
              </div>
              <h3 className={`mt-6 ${tw.headingCard}`}>Track Hours</h3>
              <p className={`mt-4 ${tw.body}`}>
                Volunteers log hours against specific events; admins review and approve submissions for grants and board reporting.
              </p>
            </article>
            <article className={tw.featureCard}>
              <div className="text-neutral-700" aria-hidden>
                <IconDocCheck />
              </div>
              <h3 className={`mt-6 ${tw.headingCard}`}>Approve Documents</h3>
              <p className={`mt-4 ${tw.body}`}>
                Collect PDFs and images for IDs and certifications in one queue. Reviewers record outcomes and reasons in a clear audit trail.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className={`${tw.sectionY} bg-neutral-50`}>
        <div className={tw.maxContent}>
          <h2 className={tw.headingSection}>How it works</h2>
          <p className={`mt-4 max-w-2xl ${tw.body}`}>From signup to signed-off hours in three straightforward steps.</p>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
            <div className={tw.stepCard}>
              <span className="font-sans text-sm font-semibold text-[#2563EB]">01</span>
              <h3 className={`mt-4 ${tw.headingCard}`}>Create an account</h3>
              <p className={`mt-4 ${tw.body}`}>Staff and volunteers sign up with a role-based profile so permissions match responsibility from day one.</p>
            </div>
            <div className={tw.stepCard}>
              <span className="font-sans text-sm font-semibold text-[#2563EB]">02</span>
              <h3 className={`mt-4 ${tw.headingCard}`}>Join or post events</h3>
              <p className={`mt-4 ${tw.body}`}>Organizers publish opportunities; volunteers apply and receive status updates without manual email triage.</p>
            </div>
            <div className={tw.stepCard}>
              <span className="font-sans text-sm font-semibold text-[#2563EB]">03</span>
              <h3 className={`mt-4 ${tw.headingCard}`}>Track and approve hours</h3>
              <p className={`mt-4 ${tw.body}`}>Hours roll up to events and volunteers; admins approve batches so finance and program leads see one source of truth.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${tw.sectionY} bg-[#FFFFFF]`}>
        <div className={`${tw.maxContent} grid grid-cols-1 gap-12 text-center md:grid-cols-3 md:gap-8`}>
          <div>
            <p className="font-sans text-5xl font-bold tracking-tight text-[#0F1117] md:text-6xl">500+</p>
            <p className={`mt-4 ${tw.caption} text-[#6B7280]`}>Volunteers</p>
          </div>
          <div>
            <p className="font-sans text-5xl font-bold tracking-tight text-[#0F1117] md:text-6xl">1,200+</p>
            <p className={`mt-4 ${tw.caption} text-[#6B7280]`}>Hours Logged</p>
          </div>
          <div>
            <p className="font-sans text-5xl font-bold tracking-tight text-[#0F1117] md:text-6xl">50+</p>
            <p className={`mt-4 ${tw.caption} text-[#6B7280]`}>Events Coordinated</p>
          </div>
        </div>
      </section>

      <section className="bg-[#0F1117] py-16 md:py-24" aria-labelledby="cta-heading">
        <div className={`${tw.maxContent} text-center`}>
          <h2 id="cta-heading" className="font-sans text-4xl font-semibold leading-tight text-white">
            Ready to run volunteer programs with less overhead?
          </h2>
          <p className={`mx-auto mt-6 max-w-2xl font-sans text-base leading-relaxed text-neutral-300`}>
            Start free and invite your team when you are ready. No credit card required to explore the basics.
          </p>
          <div className="mt-8">
            <Link
              to="/register"
              className={`inline-flex items-center justify-center rounded-lg bg-[#2563EB] px-6 py-4 font-sans text-sm font-semibold text-white ${tw.transition} hover:scale-[1.02] hover:bg-[#1D4ED8] active:scale-[0.98]`}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-neutral-200 bg-[#FFFFFF] py-8">
        <div className={`${tw.maxContent} flex flex-col gap-4 md:flex-row md:items-center md:justify-between`}>
          <p className={`${tw.caption} text-[#6B7280]`}>© {new Date().getFullYear()} VolunteerFlow</p>
          <div className="flex flex-wrap gap-8">
            <Link to="/login" className={`${tw.footerLink} py-2`}>
              Login
            </Link>
            <Link to="/register" className={`${tw.footerLink} py-2`}>
              Register
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

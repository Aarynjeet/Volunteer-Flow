import { Link } from 'react-router-dom';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="text-xl font-semibold text-slate-900">VolunteerFlow</div>
        <div className="flex w-full gap-3 sm:w-auto">
          <Link
            to="/login"
            className="w-full rounded-md px-4 py-2 text-center text-sm font-medium text-indigo-700 hover:bg-indigo-50 sm:w-auto"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-indigo-700 sm:w-auto"
          >
            Register
          </Link>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Volunteer management built for nonprofits
          </h1>
          <p className="mt-4 text-base text-slate-600 sm:text-lg">
            Coordinate events, track hours, and keep volunteer onboarding organized — all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/register"
              className="rounded-md bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="rounded-md border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.433-2.054A4.125 4.125 0 0012 19.128z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-2.485 0-4.5-2.015-4.5-4.5S9.515 5.25 12 5.25s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Manage Volunteers</h3>
            <p className="mt-2 text-sm text-slate-600">
              Keep profiles, skills, and availability organized so coordinators can match the right people fast.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l3 3" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Track Hours</h3>
            <p className="mt-2 text-sm text-slate-600">
              Log and approve volunteer time tied to events with a clear audit trail for reporting.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h.008v.008H7.5V7.5z" />
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">Approve Documents</h3>
            <p className="mt-2 text-sm text-slate-600">
              Review certifications and background checks with statuses and reasons in one workflow.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-10 text-center text-sm text-slate-600">
        © 2025 VolunteerFlow
      </footer>
    </div>
  );
}

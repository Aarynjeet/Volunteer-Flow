import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">Welcome back to VolunteerFlow.</p>

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            try {
              await login(email, password);
            } catch {
              setError('Invalid email or password');
            }
          }}
        >
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-600 focus:border-indigo-600 focus:ring-2"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-600 focus:border-indigo-600 focus:ring-2"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
            />
          </div>

          {error ? <div className="break-words text-sm text-red-600">{error}</div> : null}

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Sign in
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Need an account?{' '}
          <Link className="font-medium text-indigo-700 hover:text-indigo-800" to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

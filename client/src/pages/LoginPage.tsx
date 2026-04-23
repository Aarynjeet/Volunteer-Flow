import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
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
    <div className="vf-page flex min-h-screen items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-6 flex cursor-pointer flex-col items-center gap-2.5 no-underline">
          <Logo className="shrink-0" />
          <span className="text-xl font-bold text-[#2D6A4F] dark:text-[#52B788]">VolunteerFlow</span>
        </Link>
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 shadow-sm dark:border-[#2D3E2D] dark:bg-[#1E2E1E]">
          <h1 className="vf-h1">Sign in</h1>
          <p className="mt-2 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Welcome back to VolunteerFlow.</p>

          <form
            className="mt-6 grid gap-4"
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
              <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" autoComplete="email" className="vf-input" value={email} onChange={(ev) => setEmail(ev.target.value)} required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]" htmlFor="password">
                Password
              </label>
              <input id="password" type="password" autoComplete="current-password" className="vf-input" value={password} onChange={(ev) => setPassword(ev.target.value)} required />
            </div>

            {error ? <div className="break-words text-sm text-red-600 dark:text-red-400">{error}</div> : null}

            <button type="submit" className="vf-btn-primary w-full">
              Sign in
            </button>
          </form>

          <div className="mt-6 border-t border-[#E2DDD5] pt-4 text-center text-sm text-[#4A5568] dark:border-[#2D3E2D] dark:text-[#A8B2A8]">
            Need an account?{' '}
            <Link className="font-semibold text-[#2D6A4F] hover:underline dark:text-[#52B788]" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

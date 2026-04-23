import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/Logo';
import { useAuth } from '../context/AuthContext';

export function RegisterPage() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'volunteer' | 'organizer'>('volunteer');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}/dashboard`, { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="vf-page flex min-h-screen items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2.5">
          <Logo className="shrink-0" />
          <span className="text-xl font-bold text-[#2D6A4F] dark:text-[#52B788]">VolunteerFlow</span>
        </div>
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-8 shadow-sm dark:border-[#2D3E2D] dark:bg-[#1E2E1E]">
          <h1 className="vf-h1">Create your account</h1>
          <p className="mt-2 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Join VolunteerFlow in a few steps.</p>

          <form
            className="mt-6 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              setIsSubmitting(true);
              try {
                await register(name, email, password, role);
              } catch (err: any) {
                const message =
                  err?.response?.data?.message ??
                  (err?.response?.data?.errors
                    ? Object.values(err.response.data.errors).flat().join(' ')
                    : 'Registration failed. Please check your inputs and try again.');
                setError(String(message));
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]" htmlFor="name">
                Name
              </label>
              <input id="name" className="vf-input" value={name} onChange={(ev) => setName(ev.target.value)} required />
            </div>
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
              <input id="password" type="password" autoComplete="new-password" className="vf-input" value={password} onChange={(ev) => setPassword(ev.target.value)} required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]" htmlFor="role">
                Role
              </label>
              <select id="role" className="vf-input" value={role} onChange={(ev) => setRole(ev.target.value as 'volunteer' | 'organizer')}>
                <option value="volunteer">volunteer</option>
                <option value="organizer">organizer</option>
              </select>
            </div>

            <button type="submit" className="vf-btn-primary w-full disabled:opacity-50" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Register'}
            </button>
            {error ? <div className="break-words text-sm text-red-600 dark:text-red-400">{error}</div> : null}
          </form>

          <div className="mt-6 border-t border-[#E2DDD5] pt-4 text-center text-sm text-[#4A5568] dark:border-[#2D3E2D] dark:text-[#A8B2A8]">
            Already have an account?{' '}
            <Link className="font-semibold text-[#2D6A4F] hover:underline dark:text-[#52B788]" to="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Create your account</h1>
        <p className="mt-2 text-sm text-slate-600">Join VolunteerFlow in a few steps.</p>

        <form
          className="mt-6 space-y-4"
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
            <label className="block text-sm font-medium text-slate-700" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-600 focus:border-indigo-600 focus:ring-2"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
              required
            />
          </div>
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
              autoComplete="new-password"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-600 focus:border-indigo-600 focus:ring-2"
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-indigo-600 focus:border-indigo-600 focus:ring-2"
              value={role}
              onChange={(ev) => setRole(ev.target.value as 'volunteer' | 'organizer')}
            >
              <option value="volunteer">volunteer</option>
              <option value="organizer">organizer</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
          {error ? <div className="break-words text-sm text-red-600">{error}</div> : null}
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link className="font-medium text-indigo-700 hover:text-indigo-800" to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

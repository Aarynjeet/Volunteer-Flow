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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'volunteer' | 'organizer'>('volunteer');
  const [error, setError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRules = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'At least one uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'At least one lowercase letter', met: /[a-z]/.test(password) },
    { label: 'At least one number', met: /[0-9]/.test(password) },
    { label: 'At least one special character', met: /[^A-Za-z0-9]/.test(password) },
  ];
  const metRuleCount = passwordRules.filter((rule) => rule.met).length;
  const filledSegments = Math.min(4, Math.max(0, metRuleCount));

  const strengthMeta =
    metRuleCount <= 1
      ? { label: 'Weak', barClass: 'bg-red-500', textClass: 'text-red-500' }
      : metRuleCount === 2
        ? { label: 'Fair', barClass: 'bg-orange-500', textClass: 'text-orange-500' }
        : metRuleCount === 3
          ? { label: 'Good', barClass: 'bg-amber-500', textClass: 'text-amber-500' }
          : {
              label: 'Strong',
              barClass: 'bg-[#2D6A4F] dark:bg-[#52B788]',
              textClass: 'text-[#2D6A4F] dark:text-[#52B788]',
            };

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
          <h1 className="vf-h1">Create your account</h1>
          <p className="mt-2 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Join VolunteerFlow in a few steps.</p>

          <form
            className="mt-6 grid gap-4"
            onSubmit={async (e) => {
              e.preventDefault();
              setError(null);
              if (password !== confirmPassword) {
                setConfirmPasswordError('Passwords do not match');
                return;
              }
              setConfirmPasswordError(null);
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
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                className="vf-input"
                value={password}
                onChange={(ev) => {
                  const next = ev.target.value;
                  setPassword(next);
                  if (confirmPassword && next === confirmPassword) {
                    setConfirmPasswordError(null);
                  }
                }}
                required
              />
              <div className="mt-3 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="grid flex-1 grid-cols-4 gap-1">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          index < filledSegments ? strengthMeta.barClass : 'bg-[#E2DDD5] dark:bg-[#2D3E2D]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs font-semibold transition-colors duration-200 ${strengthMeta.textClass}`}>
                    {strengthMeta.label}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {passwordRules.map((rule) => (
                    <div
                      key={rule.label}
                      className={`flex items-center gap-2 text-sm transition-colors duration-200 ${
                        rule.met ? 'text-[#2D6A4F] dark:text-[#52B788]' : 'text-[#6B7280] dark:text-[#94A398]'
                      }`}
                    >
                      <span className="inline-flex w-4 justify-center">{rule.met ? '✓' : '○'}</span>
                      <span>{rule.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]" htmlFor="confirm-password">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                className="vf-input"
                value={confirmPassword}
                onChange={(ev) => {
                  const next = ev.target.value;
                  setConfirmPassword(next);
                  if (next === password) {
                    setConfirmPasswordError(null);
                  }
                }}
                onBlur={() => {
                  if (confirmPassword && confirmPassword !== password) {
                    setConfirmPasswordError('Passwords do not match');
                    return;
                  }
                  setConfirmPasswordError(null);
                }}
                required
              />
              {confirmPasswordError ? <p className="mt-1 text-sm text-red-500">{confirmPasswordError}</p> : null}
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

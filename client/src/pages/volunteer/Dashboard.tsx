import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
import type { Application, Notification } from '../../types';

type VolunteerDashboardPayload = {
  summary: {
    total_applications: number;
    approved_applications: number;
    submitted_documents: number;
    approved_hours: number;
  };
  recent_applications: Application[];
  recent_notifications: Notification[];
};

export function VolunteerDashboard() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['dashboard-volunteer'],
    queryFn: async () => {
      const res = await api.get<VolunteerDashboardPayload>('/dashboard/volunteer');
      return res.data;
    },
  });

  if (query.isLoading) {
    return <div className="text-sm text-[#4A5568] dark:text-[#A8B2A8]">Loading dashboard...</div>;
  }

  if (query.isError || !query.data) {
    return <div className="text-sm text-red-600">Failed to load dashboard.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#F0EDE4]">Good morning, {user?.name ?? 'Volunteer'}</p>
        <h1 className="vf-h1 mt-2">Volunteer dashboard</h1>
        <p className="mt-1 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Your real-time overview.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total applications" value={query.data.summary.total_applications} />
        <Metric label="Approved applications" value={query.data.summary.approved_applications} />
        <Metric label="Submitted documents" value={query.data.summary.submitted_documents} />
        <Metric label="Approved hours" value={query.data.summary.approved_hours} />
      </div>
      <div className="my-8 border-t border-[#E2DDD5] dark:border-[#2D3E2D]" />
      <section className="vf-card">
        <h2 className="vf-h2">Recent applications</h2>
        <div className="mt-3 space-y-2">
          {query.data.recent_applications.map((app) => (
            <div key={app.id} className="rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm transition-all duration-200 hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]">
              <div className="break-words font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{app.event?.title ?? `Event #${app.event_id}`}</div>
              <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">{app.status}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="vf-card">
        <h2 className="vf-h2">Recent notifications</h2>
        <div className="mt-3 space-y-2">
          {query.data.recent_notifications.map((item) => (
            <div key={item.id} className="break-words rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm text-[#4A5568] transition-all duration-200 hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:text-[#A8B2A8] dark:hover:border-[#52B788]">
              {item.message}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="vf-card">
      <div className="inline-flex rounded-xl bg-[#D8F3DC] p-3 text-[#2D6A4F] dark:bg-green-900 dark:text-[#52B788]">
        <span className="text-lg">#</span>
      </div>
      <div className="mt-3 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">{label}</div>
      <div className="mt-1 text-2xl font-bold text-[#2D6A4F] dark:text-[#52B788]">{value}</div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
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
  const query = useQuery({
    queryKey: ['dashboard-volunteer'],
    queryFn: async () => {
      const res = await api.get<VolunteerDashboardPayload>('/dashboard/volunteer');
      return res.data;
    },
  });

  if (query.isLoading) {
    return <div className="text-sm text-slate-600">Loading dashboard...</div>;
  }

  if (query.isError || !query.data) {
    return <div className="text-sm text-red-600">Failed to load dashboard.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Volunteer dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Your real-time overview.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Total applications" value={query.data.summary.total_applications} />
        <Metric label="Approved applications" value={query.data.summary.approved_applications} />
        <Metric label="Submitted documents" value={query.data.summary.submitted_documents} />
        <Metric label="Approved hours" value={query.data.summary.approved_hours} />
      </div>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent applications</h2>
        <div className="mt-3 space-y-2">
          {query.data.recent_applications.map((app) => (
            <div key={app.id} className="rounded border border-slate-200 p-3 text-sm">
              <div className="break-words font-medium text-slate-900">{app.event?.title ?? `Event #${app.event_id}`}</div>
              <div className="text-slate-600">{app.status}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Recent notifications</h2>
        <div className="mt-3 space-y-2">
          {query.data.recent_notifications.map((item) => (
            <div key={item.id} className="break-words rounded border border-slate-200 p-3 text-sm text-slate-700">
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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}

import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Application, Event } from '../../types';

type OrganizerDashboardPayload = {
  summary: {
    owned_events: number;
    total_applications: number;
    pending_applications: number;
    approved_hours_submissions: number;
  };
  events: Event[];
  recent_applications: Application[];
};

export function OrganizerDashboard() {
  const query = useQuery({
    queryKey: ['dashboard-organizer'],
    queryFn: async () => (await api.get<OrganizerDashboardPayload>('/dashboard/organizer')).data,
  });

  if (query.isLoading) return <div className="text-sm text-slate-600">Loading dashboard...</div>;
  if (query.isError || !query.data) return <div className="text-sm text-red-600">Failed to load dashboard.</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Organizer dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Owned events" value={query.data.summary.owned_events} />
        <Metric label="Total applications" value={query.data.summary.total_applications} />
        <Metric label="Pending applications" value={query.data.summary.pending_applications} />
        <Metric label="Approved hour submissions" value={query.data.summary.approved_hours_submissions} />
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">My events</h2>
        <div className="mt-3 space-y-2">
          {query.data.events.map((event) => (
            <div key={event.id} className="rounded border border-slate-200 p-3 text-sm">
              <div className="break-words font-medium text-slate-900">{event.title}</div>
              <div className="break-words text-slate-600">
                {new Date(event.date).toLocaleDateString()} • applications: {event.applications_count ?? 0}
              </div>
            </div>
          ))}
        </div>
      </div>
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

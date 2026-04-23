import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['dashboard-organizer'],
    queryFn: async () => (await api.get<OrganizerDashboardPayload>('/dashboard/organizer')).data,
  });

  if (query.isLoading) return <div className="text-sm text-[#4A5568] dark:text-[#A8B2A8]">Loading dashboard...</div>;
  if (query.isError || !query.data) return <div className="text-sm text-red-600">Failed to load dashboard.</div>;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#F0EDE4]">Good morning, {user?.name ?? 'Organizer'}</p>
        <h1 className="vf-h1 mt-2">Organizer dashboard</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Metric label="Owned events" value={query.data.summary.owned_events} />
        <Metric label="Total applications" value={query.data.summary.total_applications} />
        <Metric label="Pending applications" value={query.data.summary.pending_applications} />
        <Metric label="Approved hour submissions" value={query.data.summary.approved_hours_submissions} />
      </div>
      <div className="my-8 border-t border-[#E2DDD5] dark:border-[#2D3E2D]" />
      <div className="vf-card">
        <h2 className="vf-h2">My events</h2>
        <div className="mt-3 space-y-2">
          {query.data.events.map((event) => (
            <div key={event.id} className="rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm transition-all duration-200 hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]">
              <div className="break-words font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{event.title}</div>
              <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">
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
    <div className="vf-card">
      <div className="inline-flex rounded-xl bg-[#D8F3DC] p-3 text-[#2D6A4F] dark:bg-green-900 dark:text-[#52B788]">
        <span className="text-lg">#</span>
      </div>
      <div className="mt-3 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">{label}</div>
      <div className="mt-1 text-2xl font-bold text-[#2D6A4F] dark:text-[#52B788]">{value}</div>
    </div>
  );
}

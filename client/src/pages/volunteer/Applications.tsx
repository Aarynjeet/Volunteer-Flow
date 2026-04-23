import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Application, PaginatedResponse } from '../../types';

export function VolunteerApplications() {
  const applicationsQuery = useQuery({
    queryKey: ['volunteer-applications'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Application>>('/applications');
      return res.data.data;
    },
  });

  if (applicationsQuery.isLoading) return <div className="text-sm text-[#4A5568] dark:text-[#A8B2A8]">Loading applications...</div>;

  if (applicationsQuery.isError) {
    return <div className="text-sm text-red-600">Failed to load applications.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="vf-h1">My Applications</h1>
        <p className="mt-1 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Track your submitted event applications.</p>
      </div>
      <div className="vf-card">
        <div className="space-y-2">
          {(applicationsQuery.data ?? []).map((app) => (
            <div key={app.id} className="rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm transition-all duration-200 hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]">
              <div className="break-words font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{app.event?.title ?? `Event #${app.event_id}`}</div>
              <div className="mt-1">
                <span className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">Status: {app.status}</span>
              </div>
              <div className="mt-2 text-[#4A5568] dark:text-[#A8B2A8]">
                Applied: {app.created_at ? new Date(app.created_at).toLocaleString() : '-'}
              </div>
            </div>
          ))}
          {(applicationsQuery.data ?? []).length === 0 ? (
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm text-[#4A5568] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:text-[#A8B2A8]">
              No applications yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}


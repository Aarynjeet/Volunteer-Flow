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

  if (applicationsQuery.isLoading) {
    return <div className="text-sm text-slate-600">Loading applications...</div>;
  }

  if (applicationsQuery.isError) {
    return <div className="text-sm text-red-600">Failed to load applications.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">My Applications</h1>
        <p className="mt-1 text-sm text-slate-600">Track your submitted event applications.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-2">
          {(applicationsQuery.data ?? []).map((app) => (
            <div key={app.id} className="rounded border border-slate-200 p-3 text-sm">
              <div className="break-words font-medium text-slate-900">{app.event?.title ?? `Event #${app.event_id}`}</div>
              <div className="text-slate-600">Status: {app.status}</div>
              <div className="text-slate-500">
                Applied: {app.created_at ? new Date(app.created_at).toLocaleString() : '-'}
              </div>
            </div>
          ))}
          {(applicationsQuery.data ?? []).length === 0 ? (
            <div className="rounded border border-slate-200 p-3 text-sm text-slate-600">
              No applications yet.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}


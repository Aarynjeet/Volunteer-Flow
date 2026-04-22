import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Application, Document, Hour, Notification, User } from '../../types';

type AdminDashboardPayload = {
  summary: {
    total_users: number;
    total_volunteers: number;
    total_organizers: number;
    total_events: number;
    pending_documents: number;
    pending_applications: number;
    pending_hours: number;
  };
  recent_users: User[];
  recent_applications: Application[];
  recent_documents: Document[];
  recent_hours: Hour[];
  recent_notifications: Notification[];
};

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ['dashboard-admin'],
    queryFn: async () => (await api.get<AdminDashboardPayload>('/dashboard/admin')).data,
  });
  const approveHourMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/hours/${id}/approve`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['dashboard-admin'] });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Admin dashboard</h1>
        <p className="mt-1 text-sm text-slate-600">Operational overview from live backend data.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-600">Total Users</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{data?.summary.total_users ?? 0}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-600">Total Events</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">{data?.summary.total_events ?? 0}</div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-slate-600">Pending Approvals</div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {(data?.summary.pending_applications ?? 0) + (data?.summary.pending_documents ?? 0) + (data?.summary.pending_hours ?? 0)}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="text-lg font-semibold text-slate-900">Recent users</div>
        <div className="mt-3 space-y-2 md:hidden">
          {(data?.recent_users ?? []).map((user) => (
            <div key={user.id} className="rounded border border-slate-200 p-3 text-sm">
              <div className="font-medium text-slate-900">{user.name}</div>
              <div className="break-words text-slate-600">{user.email}</div>
              <div className="text-slate-600">{user.role}</div>
              <div className="text-slate-500">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 hidden overflow-x-auto md:block">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-600">
              <tr>
                <th className="py-2 pr-4 font-medium">Name</th>
                <th className="py-2 pr-4 font-medium">Email</th>
                <th className="py-2 pr-4 font-medium">Role</th>
                <th className="py-2 pr-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody className="text-slate-900">
              {(data?.recent_users ?? []).map((user) => (
                <tr className="border-b border-slate-100" key={user.id}>
                  <td className="py-3 pr-4">{user.name}</td>
                  <td className="py-3 pr-4">{user.email}</td>
                  <td className="py-3 pr-4">{user.role}</td>
                  <td className="py-3 pr-4">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="text-lg font-semibold text-slate-900">Pending hour submissions</div>
        <div className="mt-3 space-y-2">
          {(data?.recent_hours ?? [])
            .filter((hour) => hour.status === 'pending')
            .map((hour) => (
              <div key={hour.id} className="flex flex-col gap-2 rounded border border-slate-200 p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 break-words">
                  {hour.volunteer?.name ?? 'Volunteer'} • {hour.event?.title ?? `Event #${hour.event_id}`} • {hour.hours}h
                </div>
                <button
                  className="w-full rounded bg-emerald-600 px-2 py-1 text-xs text-white sm:w-auto"
                  onClick={() => approveHourMutation.mutate(hour.id)}
                  disabled={approveHourMutation.isPending}
                >
                  Approve
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

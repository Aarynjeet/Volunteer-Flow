import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import { useAuth } from '../../context/AuthContext';
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
  const { user } = useAuth();
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
        <p className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#F0EDE4]">Good morning, {user?.name ?? 'Admin'}</p>
        <h1 className="vf-h1 mt-2">Admin dashboard</h1>
        <p className="mt-1 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Operational overview from live backend data.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="vf-card">
          <div className="inline-flex rounded-xl bg-[#D8F3DC] p-3 text-[#2D6A4F] dark:bg-green-900 dark:text-[#52B788]">
            <span className="text-lg">U</span>
          </div>
          <div className="mt-3 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Total Users</div>
          <div className="mt-2 text-3xl font-bold text-[#2D6A4F] dark:text-[#52B788]">{data?.summary.total_users ?? 0}</div>
        </div>
        <div className="vf-card">
          <div className="inline-flex rounded-xl bg-[#D8F3DC] p-3 text-[#2D6A4F] dark:bg-green-900 dark:text-[#52B788]">
            <span className="text-lg">E</span>
          </div>
          <div className="mt-3 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Total Events</div>
          <div className="mt-2 text-3xl font-bold text-[#2D6A4F] dark:text-[#52B788]">{data?.summary.total_events ?? 0}</div>
        </div>
        <div className="vf-card">
          <div className="inline-flex rounded-xl bg-[#D8F3DC] p-3 text-[#2D6A4F] dark:bg-green-900 dark:text-[#52B788]">
            <span className="text-lg">P</span>
          </div>
          <div className="mt-3 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Pending Approvals</div>
          <div className="mt-2 text-3xl font-bold text-[#2D6A4F] dark:text-[#52B788]">
            {(data?.summary.pending_applications ?? 0) + (data?.summary.pending_documents ?? 0) + (data?.summary.pending_hours ?? 0)}
          </div>
        </div>
      </div>

      <div className="my-8 border-t border-[#E2DDD5] dark:border-[#2D3E2D]" />

      <div className="vf-card">
        <h2 className="vf-h2">Recent users</h2>
        <div className="mt-3 space-y-2 md:hidden">
          {(data?.recent_users ?? []).map((user) => (
            <div key={user.id} className="rounded-2xl border border-[#E2DDD5] bg-white px-5 py-4 text-sm dark:border-[#2D3E2D] dark:bg-[#1E2E1E]">
              <div className="font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{user.name}</div>
              <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">{user.email}</div>
              <div className="text-[#4A5568] dark:text-[#A8B2A8]">{user.role}</div>
              <div className="text-[#4A5568] dark:text-[#A8B2A8]">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 hidden overflow-hidden rounded-2xl border border-[#E2DDD5] md:block dark:border-[#2D3E2D]">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#F2F0E8] text-sm font-semibold uppercase tracking-wide text-[#1A1A1A] dark:bg-[#1A2E1A] dark:text-[#F0EDE4]">
              <tr>
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Role</th>
                <th className="px-5 py-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recent_users ?? []).map((user) => (
                <tr className="border-t border-[#E2DDD5] bg-white transition-colors duration-150 hover:bg-[#F2F0E8] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:bg-[#1A2E1A]" key={user.id}>
                  <td className="px-5 py-4 text-[#1A1A1A] dark:text-[#F0EDE4]">{user.name}</td>
                  <td className="px-5 py-4 text-[#4A5568] dark:text-[#A8B2A8]">{user.email}</td>
                  <td className="px-5 py-4 text-[#4A5568] dark:text-[#A8B2A8]">{user.role}</td>
                  <td className="px-5 py-4 text-[#4A5568] dark:text-[#A8B2A8]">{user.created_at ? new Date(user.created_at).toLocaleDateString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="vf-card">
        <h2 className="vf-h2">Pending hour submissions</h2>
        <div className="mt-3 space-y-2">
          {(data?.recent_hours ?? [])
            .filter((hour) => hour.status === 'pending')
            .map((hour) => (
              <div key={hour.id} className="flex flex-col gap-2 rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm transition-all duration-200 hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788] sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 break-words text-[#4A5568] dark:text-[#A8B2A8]">
                  {hour.volunteer?.name ?? 'Volunteer'} • {hour.event?.title ?? `Event #${hour.event_id}`} • {hour.hours}h
                </div>
                <button
                  className="vf-btn-primary w-full text-xs sm:w-auto"
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

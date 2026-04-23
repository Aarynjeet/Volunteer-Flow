import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../../lib/axios';
import type { Application, PaginatedResponse } from '../../types';

export function OrganizerVolunteers() {
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getErrorMessage = (error: unknown) => {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    return message || 'Could not update application status.';
  };

  const applicationsQuery = useQuery({
    queryKey: ['organizer-applications'],
    queryFn: async () => (await api.get<PaginatedResponse<Application>>('/applications')).data.data,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'rejected' | 'completed' }) => {
      await api.patch(`/applications/${id}/status`, { status });
    },
    onMutate: async ({ id, status }) => {
      setFeedback(null);
      await queryClient.cancelQueries({ queryKey: ['organizer-applications'] });
      const previous = queryClient.getQueryData<Application[]>(['organizer-applications']);
      queryClient.setQueryData<Application[]>(['organizer-applications'], (current) =>
        (current ?? []).map((app) => (app.id === id ? { ...app, status } : app)),
      );
      return { previous };
    },
    onSuccess: async (_, variables) => {
      setFeedback({ type: 'success', message: `Application #${variables.id} marked as ${variables.status}.` });
      await queryClient.invalidateQueries({ queryKey: ['organizer-applications'] });
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Application[]>(['organizer-applications'], context.previous);
      }
      setFeedback({ type: 'error', message: getErrorMessage(error) });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="vf-h1">Volunteers</h1>
        <p className="mt-1 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Manage applications to your events.</p>
      </div>
      <div className="vf-card">
        {feedback ? (
          <div className={`mb-3 rounded-xl border px-3 py-2 text-sm ${feedback.type === 'success' ? 'border-green-200 bg-[#D8F3DC] text-[#2D6A4F] dark:border-green-800 dark:bg-green-950 dark:text-[#52B788]' : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'}`}>
            {feedback.message}
          </div>
        ) : null}
        <div className="space-y-2">
          {(applicationsQuery.data ?? []).map((app) => {
            const isUpdatingThisRow = statusMutation.isPending && statusMutation.variables?.id === app.id;
            return (
              <div key={app.id} className="rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm transition-all duration-200 hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]">
                <div className="break-words font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{app.volunteer?.name ?? `Volunteer #${app.volunteer_id}`}</div>
                <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">{app.event?.title ?? `Event #${app.event_id}`}</div>
                <div className="mt-1 text-[#4A5568] dark:text-[#A8B2A8]">Current status: {app.status}</div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button className="vf-btn-primary w-full text-xs disabled:opacity-50" onClick={() => statusMutation.mutate({ id: app.id, status: 'approved' })} disabled={isUpdatingThisRow}>
                    Approve
                  </button>
                  <button className="vf-btn-danger w-full text-xs disabled:opacity-50" onClick={() => statusMutation.mutate({ id: app.id, status: 'rejected' })} disabled={isUpdatingThisRow}>
                    Reject
                  </button>
                  <button className="vf-btn-secondary w-full text-xs disabled:opacity-50" onClick={() => statusMutation.mutate({ id: app.id, status: 'completed' })} disabled={isUpdatingThisRow}>
                    Complete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

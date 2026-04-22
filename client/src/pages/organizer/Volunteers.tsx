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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Volunteers</h1>
        <p className="mt-1 text-sm text-slate-600">Manage applications to your events.</p>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {feedback ? (
          <div className={`mb-3 rounded border px-3 py-2 text-sm ${feedback.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
            {feedback.message}
          </div>
        ) : null}
        <div className="space-y-2">
          {(applicationsQuery.data ?? []).map((app) => {
            const isUpdatingThisRow = statusMutation.isPending && statusMutation.variables?.id === app.id;
            return (
              <div key={app.id} className="rounded border border-slate-200 p-3 text-sm">
                <div className="break-words font-medium text-slate-900">{app.volunteer?.name ?? `Volunteer #${app.volunteer_id}`}</div>
                <div className="break-words text-slate-600">{app.event?.title ?? `Event #${app.event_id}`}</div>
                <div className="mt-1 text-slate-600">Current status: {app.status}</div>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button className="w-full rounded bg-emerald-600 px-2 py-1 text-xs text-white disabled:opacity-50" onClick={() => statusMutation.mutate({ id: app.id, status: 'approved' })} disabled={isUpdatingThisRow}>
                    Approve
                  </button>
                  <button className="w-full rounded bg-red-600 px-2 py-1 text-xs text-white disabled:opacity-50" onClick={() => statusMutation.mutate({ id: app.id, status: 'rejected' })} disabled={isUpdatingThisRow}>
                    Reject
                  </button>
                  <button className="w-full rounded bg-slate-700 px-2 py-1 text-xs text-white disabled:opacity-50" onClick={() => statusMutation.mutate({ id: app.id, status: 'completed' })} disabled={isUpdatingThisRow}>
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

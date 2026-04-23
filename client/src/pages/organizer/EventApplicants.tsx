import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../lib/axios';
import type { Application, PaginatedResponse } from '../../types';

export function OrganizerEventApplicants() {
  const { eventId } = useParams();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const getErrorMessage = (error: unknown) => {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    return message || 'Could not update application status.';
  };

  const applicantsQuery = useQuery({
    queryKey: ['event-applicants', eventId],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Application>>(`/events/${eventId}/applications`);
      return res.data.data;
    },
    enabled: !!eventId,
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'approved' | 'rejected' }) => {
      await api.patch(`/applications/${id}/status`, { status });
    },
    onMutate: async ({ id, status }) => {
      setFeedback(null);
      await queryClient.cancelQueries({ queryKey: ['event-applicants', eventId] });
      const previous = queryClient.getQueryData<Application[]>(['event-applicants', eventId]);
      queryClient.setQueryData<Application[]>(['event-applicants', eventId], (current) =>
        (current ?? []).map((app) => (app.id === id ? { ...app, status } : app)),
      );
      return { previous };
    },
    onSuccess: async (_, variables) => {
      setFeedback({ type: 'success', message: `Application #${variables.id} marked as ${variables.status}.` });
      await queryClient.invalidateQueries({ queryKey: ['event-applicants', eventId] });
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData<Application[]>(['event-applicants', eventId], context.previous);
      }
      setFeedback({ type: 'error', message: getErrorMessage(error) });
    },
  });

  if (!eventId) {
    return <div className="text-sm text-red-600">Missing event id.</div>;
  }

  if (applicantsQuery.isLoading) return <div className="text-sm text-[#4A5568] dark:text-[#A8B2A8]">Loading applicants...</div>;

  if (applicantsQuery.isError) {
    return <div className="text-sm text-red-600">Failed to load applicants.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="vf-h1">Event Applicants</h1>
          <p className="mt-1 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Review profiles and resumes for this event.</p>
        </div>
        <Link to="/organizer/events" className="vf-btn-secondary text-center text-sm">
          Back to Events
        </Link>
      </div>
      <div className="space-y-3">
        {feedback ? (
          <div className={`rounded-xl border px-3 py-2 text-sm ${feedback.type === 'success' ? 'border-green-200 bg-[#D8F3DC] text-[#2D6A4F] dark:border-green-800 dark:bg-green-950 dark:text-[#52B788]' : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400'}`}>
            {feedback.message}
          </div>
        ) : null}
        {(applicantsQuery.data ?? []).map((app) => {
          const profile = app.volunteer?.volunteer;
          const isUpdatingThisRow = statusMutation.isPending && statusMutation.variables?.id === app.id;
          return (
            <div key={app.id} className="vf-card">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 space-y-1 text-sm">
                  <div className="break-words text-lg font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{app.volunteer?.name ?? `Volunteer #${app.volunteer_id}`}</div>
                  <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">{app.volunteer?.email ?? '-'}</div>
                  <div className="text-[#4A5568] dark:text-[#A8B2A8]">Status: {app.status}</div>
                  <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">Event: {app.event?.title ?? `Event #${app.event_id}`}</div>
                  <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">{profile?.bio || 'No bio provided.'}</div>
                  <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">Experience: {profile?.experience || '-'}</div>
                  <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">Skills: {profile?.skills || '-'}</div>
                  <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">Phone: {profile?.phone || '-'}</div>
                  {profile?.resume_url ? (
                    <a href={profile.resume_url} target="_blank" rel="noreferrer" className="break-all text-[#2D6A4F] underline dark:text-[#52B788]">
                      View resume ({profile.resume_file_name ?? 'PDF'})
                    </a>
                  ) : (
                    <div className="text-[#4A5568] dark:text-[#A8B2A8]">No resume uploaded in volunteer profile.</div>
                  )}
                </div>
                <div className="flex flex-col gap-2 md:w-auto">
                  <button
                    className="vf-btn-primary w-full text-xs md:w-auto"
                    onClick={() => statusMutation.mutate({ id: app.id, status: 'approved' })}
                    disabled={isUpdatingThisRow}
                  >
                    Approve
                  </button>
                  <button
                    className="vf-btn-danger w-full text-xs md:w-auto"
                    onClick={() => statusMutation.mutate({ id: app.id, status: 'rejected' })}
                    disabled={isUpdatingThisRow}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


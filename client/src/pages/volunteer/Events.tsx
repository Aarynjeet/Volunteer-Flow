import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Application, Event, PaginatedResponse } from '../../types';

export function VolunteerEvents() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Event>>('/events');
      return res.data.data;
    },
  });

  const applicationsQuery = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Application>>('/applications');
      return res.data.data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (eventId: number) => {
      await api.post('/applications', { event_id: eventId });
    },
    onSuccess: async () => {
      setSuccessMessage('Application submitted successfully. Status is now pending.');
      await queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });

  const applicationMap = useMemo(() => {
    const map = new Map<number, Application>();
    for (const app of applicationsQuery.data ?? []) {
      map.set(app.event_id, app);
    }
    return map;
  }, [applicationsQuery.data]);

  if (eventsQuery.isLoading || applicationsQuery.isLoading) return <div className="text-sm text-[#4A5568] dark:text-[#A8B2A8]">Loading events...</div>;

  if (eventsQuery.isError || applicationsQuery.isError) {
    return <div className="text-sm text-red-600">Failed to load events. Please try again.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="vf-h1">Events</h1>
        <p className="mt-1 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Browse upcoming events and submit applications.</p>
      </div>

      {applyMutation.isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          Could not apply to this event. You may already have an application.
        </div>
      ) : null}
      {successMessage ? (
        <div className="rounded-xl border border-green-200 bg-[#D8F3DC] px-3 py-2 text-sm text-[#2D6A4F] dark:border-green-800 dark:bg-green-950 dark:text-[#52B788]">
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(eventsQuery.data ?? []).map((event) => {
          const app = applicationMap.get(event.id);
          return (
            <div key={event.id} className="overflow-hidden rounded-2xl border border-[#E2DDD5] bg-white shadow-sm transition-all duration-200 hover:border-[#2D6A4F] hover:shadow-md dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]">
              <div className="relative h-32 bg-[#F2F0E8] dark:bg-[#1A2E1A]">
                <span className="absolute right-3 top-3 rounded-full bg-[#D8F3DC] px-3 py-1 text-xs font-semibold text-[#2D6A4F]">{event.category}</span>
              </div>
              <div className="p-6">
                <div className="min-w-0">
                  <h2 className="break-words text-xl font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{event.title}</h2>
                  <p className="mt-1 text-sm text-[#4A5568] dark:text-[#A8B2A8]">{event.location}</p>
                  <p className="mt-1 text-sm text-[#4A5568] dark:text-[#A8B2A8]">{new Date(event.date).toLocaleString()}</p>
                  <p className="mt-2 text-sm text-[#4A5568] dark:text-[#A8B2A8]">{event.description}</p>
                </div>
                <div className="mt-4 flex w-full flex-col gap-2 sm:w-auto sm:items-start">
                  {app ? (
                    <span className="inline-flex w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                      {app.status}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="vf-btn-primary w-full text-sm disabled:opacity-50 sm:w-auto"
                      onClick={() => applyMutation.mutate(event.id)}
                      disabled={applyMutation.isPending}
                    >
                      Apply
                    </button>
                  )}
                  <button
                    type="button"
                    className="w-full text-left text-xs font-semibold text-[#2D6A4F] hover:underline dark:text-[#52B788] sm:w-auto"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View details
                  </button>
                  <div className="mt-1 flex w-full items-center justify-between text-xs">
                    <span className="text-[#4A5568] dark:text-[#A8B2A8]">{new Date(event.date).toLocaleDateString()}</span>
                    <span className="font-semibold text-[#2D6A4F] hover:underline dark:text-[#52B788]">View Details</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedEvent ? (
        <div className="vf-card">
          <h3 className="vf-h2">{selectedEvent.title}</h3>
          <p className="mt-2 text-sm text-[#4A5568] dark:text-[#A8B2A8]">{selectedEvent.description}</p>
          <p className="mt-2 text-sm text-[#4A5568] dark:text-[#A8B2A8]">Volunteers needed: {selectedEvent.required_volunteers}</p>
          <button
            type="button"
            className="vf-btn-secondary mt-4 text-sm"
            onClick={() => setSelectedEvent(null)}
          >
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}

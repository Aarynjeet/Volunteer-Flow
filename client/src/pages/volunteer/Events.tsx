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

  if (eventsQuery.isLoading || applicationsQuery.isLoading) {
    return <div className="text-sm text-slate-600">Loading events...</div>;
  }

  if (eventsQuery.isError || applicationsQuery.isError) {
    return <div className="text-sm text-red-600">Failed to load events. Please try again.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Events</h1>
        <p className="mt-1 text-sm text-slate-600">Browse upcoming events and submit applications.</p>
      </div>

      {applyMutation.isError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Could not apply to this event. You may already have an application.
        </div>
      ) : null}
      {successMessage ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </div>
      ) : null}

      <div className="grid gap-4">
        {(eventsQuery.data ?? []).map((event) => {
          const app = applicationMap.get(event.id);
          return (
            <div key={event.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="break-words text-lg font-semibold text-slate-900">{event.title}</h2>
                  <p className="break-words mt-1 text-sm text-slate-600">{event.location}</p>
                  <p className="break-words mt-1 text-sm text-slate-600">{new Date(event.date).toLocaleString()}</p>
                  <p className="break-words mt-2 text-sm text-slate-700">{event.description}</p>
                </div>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
                  <span className="rounded-full bg-slate-100 px-2 py-1 text-center text-xs text-slate-700">{event.category}</span>
                  {app ? (
                    <span className="rounded-full bg-indigo-50 px-2 py-1 text-center text-xs font-medium text-indigo-700">
                      {app.status}
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 sm:w-auto"
                      onClick={() => applyMutation.mutate(event.id)}
                      disabled={applyMutation.isPending}
                    >
                      Apply
                    </button>
                  )}
                  <button
                    type="button"
                    className="w-full text-xs text-slate-600 underline sm:w-auto"
                    onClick={() => setSelectedEvent(event)}
                  >
                    View details
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedEvent ? (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">{selectedEvent.title}</h3>
          <p className="mt-2 text-sm text-slate-700">{selectedEvent.description}</p>
          <p className="mt-2 text-sm text-slate-600">Volunteers needed: {selectedEvent.required_volunteers}</p>
          <button
            type="button"
            className="mt-4 rounded-md bg-slate-900 px-3 py-2 text-sm font-medium text-white"
            onClick={() => setSelectedEvent(null)}
          >
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}

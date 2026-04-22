import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Event, Hour, PaginatedResponse } from '../../types';

export function VolunteerHours() {
  const [eventId, setEventId] = useState<number | ''>('');
  const [hours, setHours] = useState('');
  const queryClient = useQueryClient();

  const hoursQuery = useQuery({
    queryKey: ['hours'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Hour>>('/hours');
      return res.data.data;
    },
  });

  const eventsQuery = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Event>>('/events');
      return res.data.data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      await api.post('/hours', { event_id: Number(eventId), hours: Number(hours) });
    },
    onSuccess: async () => {
      setHours('');
      await queryClient.invalidateQueries({ queryKey: ['hours'] });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Hours</h1>
        <p className="mt-1 text-sm text-slate-600">Submit and track volunteer hours.</p>
      </div>
      <form
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          submitMutation.mutate();
        }}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <select className="w-full rounded border border-slate-300 px-3 py-2 text-sm" value={eventId} onChange={(e) => setEventId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">Select event</option>
            {(eventsQuery.data ?? []).map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          <input className="w-full rounded border border-slate-300 px-3 py-2 text-sm" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Hours (e.g. 2.5)" />
          <button type="submit" className="w-full rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 md:w-auto" disabled={submitMutation.isPending || !eventId || !hours}>
            Submit
          </button>
        </div>
        {submitMutation.isError ? <div className="mt-2 text-sm text-red-600">Failed to submit hours.</div> : null}
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">My submissions</h2>
        <div className="mt-3 space-y-2">
          {(hoursQuery.data ?? []).map((item) => (
            <div key={item.id} className="rounded border border-slate-200 p-3 text-sm">
              <div className="break-words font-medium text-slate-900">{item.event?.title ?? `Event #${item.event_id}`}</div>
              <div className="text-slate-600">
                {item.hours} hours • {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
    <div className="space-y-8">
      <div>
        <h1 className="vf-h1">Hours</h1>
        <p className="mt-1 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Submit and track volunteer hours.</p>
      </div>
      <form
        className="rounded-2xl border border-[#E2DDD5] bg-white p-8 shadow-sm dark:border-[#2D3E2D] dark:bg-[#1E2E1E]"
        onSubmit={(e) => {
          e.preventDefault();
          submitMutation.mutate();
        }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <select className="vf-input" value={eventId} onChange={(e) => setEventId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">Select event</option>
            {(eventsQuery.data ?? []).map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          <input className="vf-input" value={hours} onChange={(e) => setHours(e.target.value)} placeholder="Hours (e.g. 2.5)" />
          <button type="submit" className="vf-btn-primary w-full md:w-auto disabled:opacity-50" disabled={submitMutation.isPending || !eventId || !hours}>
            Submit
          </button>
        </div>
        {submitMutation.isError ? <div className="mt-2 text-sm text-red-600 dark:text-red-400">Failed to submit hours.</div> : null}
      </form>

      <div className="vf-card">
        <h2 className="vf-h2">My submissions</h2>
        <div className="mt-3 space-y-2">
          {(hoursQuery.data ?? []).map((item, index) => (
            <div key={item.id} className={`rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm transition-all duration-200 hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788] ${index < 3 ? 'border-l-4 border-l-[#2D6A4F] dark:border-l-[#52B788]' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-[#2D6A4F] dark:text-[#52B788]">#{index + 1}</span>
                <div className="break-words font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{item.event?.title ?? `Event #${item.event_id}`}</div>
              </div>
              <div className="text-[#4A5568] dark:text-[#A8B2A8]">
                {item.hours} hours • {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

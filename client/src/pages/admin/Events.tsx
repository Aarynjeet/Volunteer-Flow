import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Event, PaginatedResponse } from '../../types';

export function AdminEvents() {
  const [editing, setEditing] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    required_volunteers: '1',
    category: 'other',
  });
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ['admin-events'],
    queryFn: async () => (await api.get<PaginatedResponse<Event>>('/events')).data.data,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = { ...form, required_volunteers: Number(form.required_volunteers) };
      if (editing) {
        await api.put(`/events/${editing.id}`, payload);
      } else {
        await api.post('/events', payload);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/events/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Events</h1>
      <form
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
      >
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-slate-300 px-3 py-2 text-sm" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} placeholder="Title" required />
          <input className="rounded border border-slate-300 px-3 py-2 text-sm" value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} placeholder="Location" required />
          <input type="datetime-local" className="rounded border border-slate-300 px-3 py-2 text-sm" value={form.date} onChange={(e) => setForm((v) => ({ ...v, date: e.target.value }))} required />
          <input type="number" min={1} className="rounded border border-slate-300 px-3 py-2 text-sm" value={form.required_volunteers} onChange={(e) => setForm((v) => ({ ...v, required_volunteers: e.target.value }))} required />
          <select className="rounded border border-slate-300 px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))}>
            <option value="food_drive">food_drive</option>
            <option value="community_cleanup">community_cleanup</option>
            <option value="fundraiser">fundraiser</option>
            <option value="workshop">workshop</option>
            <option value="other">other</option>
          </select>
          <textarea className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} placeholder="Description" required />
        </div>
        <button className="mt-3 rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">{editing ? 'Update event' : 'Create event'}</button>
      </form>
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {(eventsQuery.data ?? []).map((event) => (
          <div key={event.id} className="rounded border border-slate-200 p-3 text-sm">
            <div className="break-words font-medium text-slate-900">{event.title}</div>
            <div className="break-words text-slate-600">{new Date(event.date).toLocaleString()}</div>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <button
                className="w-full rounded bg-slate-100 px-2 py-1 text-xs sm:w-auto"
                onClick={() => {
                  setEditing(event);
                  setForm({
                    title: event.title,
                    description: event.description,
                    location: event.location,
                    date: event.date.slice(0, 16),
                    required_volunteers: String(event.required_volunteers),
                    category: event.category,
                  });
                }}
              >
                Edit
              </button>
              <button className="w-full rounded bg-red-600 px-2 py-1 text-xs text-white sm:w-auto" onClick={() => deleteMutation.mutate(event.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

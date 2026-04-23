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
    <div className="space-y-8">
      <h1 className="vf-h1">Events</h1>
      <form
        className="rounded-2xl border border-[#E2DDD5] bg-white p-8 shadow-sm dark:border-[#2D3E2D] dark:bg-[#1E2E1E]"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input className="vf-input" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} placeholder="Title" required />
          <input className="vf-input" value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} placeholder="Location" required />
          <input type="datetime-local" className="vf-input" value={form.date} onChange={(e) => setForm((v) => ({ ...v, date: e.target.value }))} required />
          <input type="number" min={1} className="vf-input" value={form.required_volunteers} onChange={(e) => setForm((v) => ({ ...v, required_volunteers: e.target.value }))} required />
          <select className="vf-input" value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))}>
            <option value="food_drive">food_drive</option>
            <option value="community_cleanup">community_cleanup</option>
            <option value="fundraiser">fundraiser</option>
            <option value="workshop">workshop</option>
            <option value="other">other</option>
          </select>
          <textarea className="vf-input md:col-span-2" value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} placeholder="Description" required />
        </div>
        <button className="vf-btn-primary mt-4">{editing ? 'Update event' : 'Create event'}</button>
      </form>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {(eventsQuery.data ?? []).map((event) => (
          <div key={event.id} className="overflow-hidden rounded-2xl border border-[#E2DDD5] bg-white shadow-sm transition-all duration-200 hover:border-[#2D6A4F] hover:shadow-md dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]">
            <div className="relative h-32 bg-[#F2F0E8] dark:bg-[#1A2E1A]">
              <span className="absolute right-3 top-3 rounded-full bg-[#D8F3DC] px-3 py-1 text-xs font-semibold text-[#2D6A4F]">{event.category}</span>
            </div>
            <div className="p-6 text-sm">
              <div className="break-words text-lg font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{event.title}</div>
              <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">{new Date(event.date).toLocaleString()}</div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button
                className="vf-btn-secondary w-full text-xs sm:w-auto"
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
              <button className="vf-btn-danger w-full text-xs sm:w-auto" onClick={() => deleteMutation.mutate(event.id)}>
                Delete
              </button>
            </div>
          </div>
          </div>
        ))}
      </div>
    </div>
  );
}

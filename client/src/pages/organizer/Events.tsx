import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../lib/axios';
import type { Event, PaginatedResponse } from '../../types';

type EventForm = {
  title: string;
  description: string;
  location: string;
  date: string;
  required_volunteers: string;
  category: string;
};

const initialForm: EventForm = {
  title: '',
  description: '',
  location: '',
  date: '',
  required_volunteers: '1',
  category: 'other',
};

export function OrganizerEvents() {
  const [form, setForm] = useState<EventForm>(initialForm);
  const [editing, setEditing] = useState<Event | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const eventsQuery = useQuery({
    queryKey: ['organizer-events'],
    queryFn: async () => (await api.get<PaginatedResponse<Event>>('/events?mine=1')).data.data,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        required_volunteers: Number(form.required_volunteers),
      };
      if (editing) {
        await api.put(`/events/${editing.id}`, payload);
      } else {
        await api.post('/events', payload);
      }
    },
    onSuccess: async () => {
      setForm(initialForm);
      setEditing(null);
      await queryClient.invalidateQueries({ queryKey: ['organizer-events'] });
    },
  });

  return (
    <div className="space-y-8">
      <h1 className="vf-h1">Events</h1>
      <form
        className="rounded-2xl border border-[#E2DDD5] bg-white p-8 shadow-sm dark:border-[#2D3E2D] dark:bg-[#1E2E1E]"
        onSubmit={(e) => {
          e.preventDefault();
          const year = Number(form.date.slice(0, 4));
          if (!Number.isInteger(year) || year < 1000 || year > 9999) {
            setDateError('Year must be exactly 4 digits (1000-9999).');
            return;
          }
          setDateError(null);
          saveMutation.mutate();
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <input className="vf-input" placeholder="Title" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} required />
          <input className="vf-input" placeholder="Location" value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} required />
          <input
            type="datetime-local"
            className="vf-input"
            min="1000-01-01T00:00"
            max="9999-12-31T23:59"
            value={form.date}
            onChange={(e) => {
              setDateError(null);
              setForm((v) => ({ ...v, date: e.target.value }));
            }}
            required
          />
          <input type="number" min={1} className="vf-input" value={form.required_volunteers} onChange={(e) => setForm((v) => ({ ...v, required_volunteers: e.target.value }))} required />
          <select className="vf-input" value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))}>
            <option value="food_drive">food_drive</option>
            <option value="community_cleanup">community_cleanup</option>
            <option value="fundraiser">fundraiser</option>
            <option value="workshop">workshop</option>
            <option value="other">other</option>
          </select>
          <textarea className="vf-input md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} required />
        </div>
        {dateError ? <div className="mt-2 text-sm text-red-600">{dateError}</div> : null}
        <button type="submit" className="vf-btn-primary mt-4">
          {editing ? 'Update event' : 'Create event'}
        </button>
      </form>
      <div>
        <h2 className="vf-h2 mb-4">My events</h2>
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
                  type="button"
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
                <Link
                  to={`/organizer/events/${event.id}/applicants`}
                  className="vf-btn-primary inline-block w-full text-center text-xs sm:w-auto"
                >
                  View applicants
                </Link>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

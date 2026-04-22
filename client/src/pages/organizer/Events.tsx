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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Events</h1>
      <form
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
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
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} required />
          <input className="rounded border border-slate-300 px-3 py-2 text-sm" placeholder="Location" value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} required />
          <input
            type="datetime-local"
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            min="1000-01-01T00:00"
            max="9999-12-31T23:59"
            value={form.date}
            onChange={(e) => {
              setDateError(null);
              setForm((v) => ({ ...v, date: e.target.value }));
            }}
            required
          />
          <input type="number" min={1} className="rounded border border-slate-300 px-3 py-2 text-sm" value={form.required_volunteers} onChange={(e) => setForm((v) => ({ ...v, required_volunteers: e.target.value }))} required />
          <select className="rounded border border-slate-300 px-3 py-2 text-sm" value={form.category} onChange={(e) => setForm((v) => ({ ...v, category: e.target.value }))}>
            <option value="food_drive">food_drive</option>
            <option value="community_cleanup">community_cleanup</option>
            <option value="fundraiser">fundraiser</option>
            <option value="workshop">workshop</option>
            <option value="other">other</option>
          </select>
          <textarea className="rounded border border-slate-300 px-3 py-2 text-sm md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))} required />
        </div>
        {dateError ? <div className="mt-2 text-sm text-red-600">{dateError}</div> : null}
        <button type="submit" className="mt-3 rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white">
          {editing ? 'Update event' : 'Create event'}
        </button>
      </form>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">My events</h2>
        <div className="mt-3 space-y-2">
          {(eventsQuery.data ?? []).map((event) => (
            <div key={event.id} className="rounded border border-slate-200 p-3 text-sm">
              <div className="break-words font-medium text-slate-900">{event.title}</div>
              <div className="break-words text-slate-600">{new Date(event.date).toLocaleString()}</div>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
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
                <Link
                  to={`/organizer/events/${event.id}/applicants`}
                  className="inline-block w-full rounded bg-indigo-600 px-2 py-1 text-center text-xs text-white sm:w-auto"
                >
                  View applicants
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

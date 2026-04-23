import { useMemo, useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Event } from '../../types';

type ApplyFeedback = { tone: 'success' | 'warning' | 'error'; message: string } | null;

function DetailRow({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#E2DDD5] py-3 last:border-b-0 dark:border-[#2D3E2D]">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#4A5568] dark:text-[#A8B2A8]">
        <span className="text-[#2D6A4F] dark:text-[#52B788]">{icon}</span>
        <span>{label}</span>
      </div>
      <span className="text-sm font-medium text-[#1A1A1A] dark:text-[#F0EDE4]">{value}</span>
    </div>
  );
}

function EventDetailSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 dark:border-[#2D3E2D] dark:bg-[#1E2E1E]">
      <div className="h-5 w-40 animate-pulse rounded bg-[#E2DDD5] dark:bg-[#2D3E2D]" />
      <div className="mt-4 h-10 w-2/3 animate-pulse rounded bg-[#E2DDD5] dark:bg-[#2D3E2D]" />
      <div className="mt-3 h-6 w-24 animate-pulse rounded-full bg-[#E2DDD5] dark:bg-[#2D3E2D]" />
      <div className="mt-6 space-y-3 rounded-2xl border border-[#E2DDD5] p-4 dark:border-[#2D3E2D]">
        <div className="h-6 w-full animate-pulse rounded bg-[#E2DDD5] dark:bg-[#2D3E2D]" />
        <div className="h-6 w-full animate-pulse rounded bg-[#E2DDD5] dark:bg-[#2D3E2D]" />
        <div className="h-6 w-full animate-pulse rounded bg-[#E2DDD5] dark:bg-[#2D3E2D]" />
      </div>
      <div className="mt-6 h-24 w-full animate-pulse rounded bg-[#E2DDD5] dark:bg-[#2D3E2D]" />
    </div>
  );
}

export function VolunteerEventDetailPage() {
  const { id } = useParams();
  const eventId = Number(id);
  const [applyFeedback, setApplyFeedback] = useState<ApplyFeedback>(null);

  const eventQuery = useQuery({
    queryKey: ['event', eventId],
    enabled: Number.isInteger(eventId) && eventId > 0,
    queryFn: async () => {
      const res = await api.get<Event>(`/events/${eventId}`);
      return res.data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      await api.post('/applications', { event_id: eventId });
    },
    onSuccess: () => {
      setApplyFeedback({ tone: 'success', message: 'Application submitted!' });
    },
    onError: (error: any) => {
      const responseMessage = String(error?.response?.data?.message ?? '').toLowerCase();
      const validationMessage = JSON.stringify(error?.response?.data?.errors ?? {}).toLowerCase();
      if (responseMessage.includes('already') || validationMessage.includes('already')) {
        setApplyFeedback({ tone: 'warning', message: 'You have already applied to this event' });
        return;
      }
      setApplyFeedback({ tone: 'error', message: 'Could not submit application. Please try again.' });
    },
  });

  const feedbackClass = useMemo(() => {
    if (!applyFeedback) return '';
    if (applyFeedback.tone === 'success') {
      return 'border-green-200 bg-[#D8F3DC] text-[#2D6A4F] dark:border-green-900 dark:bg-green-950 dark:text-[#52B788]';
    }
    if (applyFeedback.tone === 'warning') {
      return 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300';
    }
    return 'border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300';
  }, [applyFeedback]);

  if (!Number.isInteger(eventId) || eventId <= 0) {
    return (
      <div className="space-y-4">
        <Link to="/volunteer/events" className="inline-flex text-sm text-[#2D6A4F] hover:underline dark:text-[#52B788]">
          ← Back to Events
        </Link>
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 dark:border-[#2D3E2D] dark:bg-[#1E2E1E]">
          <p className="text-base font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">Event not found</p>
        </div>
      </div>
    );
  }

  if (eventQuery.isLoading) {
    return (
      <div className="space-y-4">
        <Link to="/volunteer/events" className="inline-flex text-sm text-[#2D6A4F] hover:underline dark:text-[#52B788]">
          ← Back to Events
        </Link>
        <EventDetailSkeleton />
      </div>
    );
  }

  if (eventQuery.isError || !eventQuery.data) {
    return (
      <div className="space-y-4">
        <Link to="/volunteer/events" className="inline-flex text-sm text-[#2D6A4F] hover:underline dark:text-[#52B788]">
          ← Back to Events
        </Link>
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 dark:border-[#2D3E2D] dark:bg-[#1E2E1E]">
          <p className="text-base font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">Event not found</p>
          <Link to="/volunteer/events" className="mt-4 inline-flex rounded-xl border border-[#E2DDD5] px-4 py-2 text-sm font-semibold text-[#2D6A4F] hover:underline dark:border-[#2D3E2D] dark:text-[#52B788]">
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  const event = eventQuery.data;

  return (
    <div className="space-y-4">
      <Link to="/volunteer/events" className="inline-flex text-sm text-[#2D6A4F] hover:underline dark:text-[#52B788]">
        ← Back to Events
      </Link>

      <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-sm dark:border-[#2D3E2D] dark:bg-[#1E2E1E]">
        <h1 className="text-3xl font-bold text-[#1A1A1A] dark:text-[#F0EDE4]">{event.title}</h1>
        <div className="mt-3">
          <span className="inline-flex rounded-full bg-[#D8F3DC] px-3 py-1 text-xs font-semibold text-[#2D6A4F]">{event.category}</span>
        </div>

        <div className="mt-6 rounded-2xl border border-[#E2DDD5] p-4 dark:border-[#2D3E2D]">
          <DetailRow
            label="Date"
            value={new Date(event.date).toLocaleString()}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" d="M6.75 3v2.25M17.25 3v2.25M3.75 8.25h16.5M5.25 5.25h13.5A1.5 1.5 0 0120.25 6.75v11.5a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V6.75a1.5 1.5 0 011.5-1.5z" />
              </svg>
            }
          />
          <DetailRow
            label="Location"
            value={event.location}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s6-5.686 6-10a6 6 0 10-12 0c0 4.314 6 10 6 10z" />
                <circle cx="12" cy="11" r="2.25" />
              </svg>
            }
          />
          <DetailRow
            label="Required Volunteers"
            value={String(event.required_volunteers)}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.433-2.054A4.125 4.125 0 0012 19.128z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 14.25c-2.485 0-4.5-2.015-4.5-4.5S9.515 5.25 12 5.25s4.5 2.015 4.5 4.5-2.015 4.5-4.5 4.5z" />
              </svg>
            }
          />
        </div>

        <div className="mt-6 border-t border-[#E2DDD5] pt-6 dark:border-[#2D3E2D]">
          <h2 className="text-lg font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">Description</h2>
          <p className="mt-2 whitespace-pre-wrap text-sm text-[#4A5568] dark:text-[#A8B2A8]">{event.description}</p>
        </div>

        <div className="mt-6 space-y-3">
          <button type="button" className="vf-btn-primary" onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
            {applyMutation.isPending ? 'Submitting...' : 'Apply to Volunteer'}
          </button>
          {applyFeedback ? <div className={`rounded-xl border px-3 py-2 text-sm ${feedbackClass}`}>{applyFeedback.message}</div> : null}
        </div>
      </div>
    </div>
  );
}

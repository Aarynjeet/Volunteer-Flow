import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import type { Notification } from '../types';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await api.get<{ data: Notification[] }>('/notifications');
      return res.data.data;
    },
  });

  const markAll = useMutation({
    mutationFn: async () => {
      await api.patch('/notifications/read-all');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const markOne = useMutation({
    mutationFn: async (id: number) => {
      await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });

  const unread = data?.filter((n) => !n.read).length ?? 0;
  const lastFive = data?.slice(0, 5) ?? [];

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) {
        return;
      }
      if (!rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        className="relative rounded-xl p-2 text-[#4A5568] transition-colors hover:bg-[#D8F3DC] dark:text-[#A8B2A8] dark:hover:bg-[#1E2E1E]"
        aria-label="Notifications"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 005.454-1.082A2.25 2.25 0 0021.75 14v-4.5c0-3.728-2.55-6.86-6-7.73V4.5A2.25 2.25 0 0013.5 2.25h-3A2.25 2.25 0 008.25 4.5v1.27c-3.45.87-6 4.002-6 7.73V14a2.25 2.25 0 001.439 2.082A23.848 23.848 0 009.143 17.082"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17.082v.75a2.25 2.25 0 002.25 2.25h0a2.25 2.25 0 002.25-2.25v-.75" />
        </svg>
        {unread > 0 ? (
          <span className="absolute right-1 top-1 inline-flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold text-white">
            {unread > 9 ? '9+' : unread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-[calc(100vw-1rem)] max-w-sm overflow-hidden rounded-2xl border border-[#E2DDD5] bg-white shadow-lg dark:border-[#2D3E2D] dark:bg-[#1E2E1E] sm:w-96">
          <div className="max-h-80 overflow-y-auto">
            {lastFive.length === 0 ? (
              <div className="p-4 text-sm text-[#4A5568] dark:text-[#A8B2A8]">No notifications yet.</div>
            ) : (
              lastFive.map((n) => (
                <div key={n.id} className="border-b border-[#E2DDD5] p-3 text-sm dark:border-[#2D3E2D]">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                    <div className="break-words text-[#1A1A1A] dark:text-[#F0EDE4]">{n.message}</div>
                    {!n.read ? (
                      <button
                        type="button"
                        className="shrink-0 rounded-xl border border-[#E2DDD5] px-2 py-1 text-xs text-[#4A5568] hover:border-[#2D6A4F] hover:text-[#2D6A4F] dark:border-[#2D3E2D] dark:text-[#A8B2A8] dark:hover:border-[#52B788] dark:hover:text-[#52B788]"
                        onClick={() => markOne.mutate(n.id)}
                        disabled={markOne.isPending}
                      >
                        Mark read
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-1 break-words text-xs text-[#4A5568] dark:text-[#A8B2A8]">
                    {new Date(n.created_at).toLocaleString()} {n.read ? '• read' : '• unread'}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="border-t border-[#E2DDD5] p-2 dark:border-[#2D3E2D]">
            <button
              type="button"
              className="vf-btn-primary w-full text-sm disabled:opacity-50"
              disabled={markAll.isPending || unread === 0}
              onClick={() => markAll.mutate()}
            >
              Mark all read
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

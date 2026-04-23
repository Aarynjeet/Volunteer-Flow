import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { PaginatedResponse, User, VolunteerProfile } from '../../types';

type VolunteerUser = User & { volunteer?: VolunteerProfile };

export function AdminVolunteers() {
  const query = useQuery({
    queryKey: ['admin-volunteers'],
    queryFn: async () => (await api.get<PaginatedResponse<VolunteerUser>>('/admin/volunteers')).data.data,
  });

  return (
    <div className="space-y-8">
      <h1 className="vf-h1">Volunteers</h1>
      <div className="vf-card">
        <div className="space-y-2">
          {(query.data ?? []).map((volunteer) => (
            <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm transition-all duration-200 hover:border-[#2D6A4F] hover:shadow-md dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]" key={volunteer.id}>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D8F3DC] text-sm font-bold text-[#2D6A4F] dark:bg-green-900 dark:text-[#52B788]">
                  {volunteer.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="break-words font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{volunteer.name}</div>
              </div>
              <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">{volunteer.email}</div>
              <div className="break-words text-[#4A5568] dark:text-[#A8B2A8]">
                <span className="block sm:inline">{volunteer.volunteer?.location ?? 'No location'}</span>
                <span className="hidden sm:inline"> • </span>
                <span className="block sm:inline">{volunteer.volunteer?.phone ?? 'No phone'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

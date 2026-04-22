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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Volunteers</h1>
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-2">
          {(query.data ?? []).map((volunteer) => (
            <div className="rounded border border-slate-200 p-3 text-sm" key={volunteer.id}>
              <div className="break-words font-medium text-slate-900">{volunteer.name}</div>
              <div className="break-words text-slate-600">{volunteer.email}</div>
              <div className="break-words text-slate-600">
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

import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';

type GroupedCount = { status?: string; month?: string; total: number };
type AnalyticsPayload = {
  analytics: {
    users_by_month: GroupedCount[];
    applications_by_status: GroupedCount[];
    documents_by_status: GroupedCount[];
    hours_by_status: GroupedCount[];
  };
};

export function AdminAnalytics() {
  const query = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => (await api.get<AnalyticsPayload>('/dashboard/admin')).data.analytics,
  });

  return (
    <div className="space-y-8">
      <h1 className="vf-h1">Analytics</h1>
      <AnalyticsCard title="Users by month" rows={query.data?.users_by_month ?? []} labelKey="month" />
      <AnalyticsCard title="Applications by status" rows={query.data?.applications_by_status ?? []} labelKey="status" />
      <AnalyticsCard title="Documents by status" rows={query.data?.documents_by_status ?? []} labelKey="status" />
      <AnalyticsCard title="Hours by status" rows={query.data?.hours_by_status ?? []} labelKey="status" />
    </div>
  );
}

function AnalyticsCard({
  title,
  rows,
  labelKey,
}: {
  title: string;
  rows: GroupedCount[];
  labelKey: 'status' | 'month';
}) {
  return (
    <div className="vf-card">
      <h2 className="vf-h2">{title}</h2>
      <div className="mt-3 space-y-2">
        {rows.map((row, i) => (
          <div key={`${labelKey}-${i}`} className="flex items-center justify-between gap-2 rounded-2xl border border-[#E2DDD5] bg-white px-5 py-4 text-sm transition-all duration-200 hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]">
            <span className="min-w-0 break-words text-[#4A5568] dark:text-[#A8B2A8]">{row[labelKey] ?? 'unknown'}</span>
            <span className="shrink-0 font-semibold text-[#2D6A4F] dark:text-[#52B788]">{row.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

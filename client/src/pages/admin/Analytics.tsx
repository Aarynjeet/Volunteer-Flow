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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Analytics</h1>
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
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <div className="mt-3 space-y-2">
        {rows.map((row, i) => (
          <div key={`${labelKey}-${i}`} className="flex items-center justify-between gap-2 rounded border border-slate-200 px-3 py-2 text-sm">
            <span className="min-w-0 break-words text-slate-700">{row[labelKey] ?? 'unknown'}</span>
            <span className="shrink-0 font-semibold">{row.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

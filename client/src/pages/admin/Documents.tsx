import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Document, PaginatedResponse } from '../../types';

export function AdminDocuments() {
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['admin-documents'],
    queryFn: async () => (await api.get<PaginatedResponse<Document>>('/documents')).data.data,
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, rejection_reason }: { id: number; status: 'approved' | 'rejected'; rejection_reason?: string }) => {
      await api.patch(`/documents/${id}/review`, { status, rejection_reason });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['admin-documents'] });
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Documents</h1>
      <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        {(query.data ?? []).map((doc) => (
          <div key={doc.id} className="rounded border border-slate-200 p-3 text-sm">
            <div className="break-words font-medium text-slate-900">{doc.file_name}</div>
            <div className="text-slate-600">
              {doc.type} • {doc.status}
            </div>
            <input
              className="mt-2 w-full rounded border border-slate-300 px-2 py-1 text-xs"
              placeholder="Rejection reason (required if rejecting)"
              value={reasons[doc.id] ?? ''}
              onChange={(e) => setReasons((v) => ({ ...v, [doc.id]: e.target.value }))}
            />
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <button className="w-full rounded bg-emerald-600 px-2 py-1 text-xs text-white sm:w-auto" onClick={() => reviewMutation.mutate({ id: doc.id, status: 'approved' })}>
                Approve
              </button>
              <button className="w-full rounded bg-red-600 px-2 py-1 text-xs text-white sm:w-auto" onClick={() => reviewMutation.mutate({ id: doc.id, status: 'rejected', rejection_reason: reasons[doc.id] })}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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
    <div className="space-y-8">
      <h1 className="vf-h1">Documents</h1>
      <div className="vf-card space-y-3">
        {(query.data ?? []).map((doc) => (
          <div key={doc.id} className="rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm transition-all duration-200 hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]">
            <div className="break-words font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{doc.file_name}</div>
            <div className="text-[#4A5568] dark:text-[#A8B2A8]">
              {doc.type} • {doc.status}
            </div>
            <input
              className="vf-input mt-3 text-xs"
              placeholder="Rejection reason (required if rejecting)"
              value={reasons[doc.id] ?? ''}
              onChange={(e) => setReasons((v) => ({ ...v, [doc.id]: e.target.value }))}
            />
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <button className="vf-btn-primary w-full text-xs sm:w-auto" onClick={() => reviewMutation.mutate({ id: doc.id, status: 'approved' })}>
                Approve
              </button>
              <button className="vf-btn-danger w-full text-xs sm:w-auto" onClick={() => reviewMutation.mutate({ id: doc.id, status: 'rejected', rejection_reason: reasons[doc.id] })}>
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

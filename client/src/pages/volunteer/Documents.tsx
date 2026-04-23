import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { Document, PaginatedResponse } from '../../types';

const types = ['id', 'background_check', 'certification', 'training'] as const;

export function VolunteerDocuments() {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<(typeof types)[number]>('id');
  const queryClient = useQueryClient();

  const docsQuery = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await api.get<PaginatedResponse<Document>>('/documents');
      return res.data.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) {
        throw new Error('No file selected');
      }
      const form = new FormData();
      form.append('file', file);
      form.append('type', type);
      await api.post('/documents', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: async () => {
      setFile(null);
      await queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="vf-h1">Documents</h1>
        <p className="mt-1 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Upload your required documents and track review status.</p>
      </div>

      <form
        className="rounded-2xl border border-[#E2DDD5] bg-white p-8 shadow-sm dark:border-[#2D3E2D] dark:bg-[#1E2E1E]"
        onSubmit={(e) => {
          e.preventDefault();
          uploadMutation.mutate();
        }}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="vf-input" />
          <select value={type} onChange={(e) => setType(e.target.value as (typeof types)[number])} className="vf-input">
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button type="submit" className="vf-btn-primary w-full md:w-auto disabled:opacity-50" disabled={uploadMutation.isPending || !file}>
            Upload
          </button>
        </div>
        {uploadMutation.isError ? <div className="mt-2 text-sm text-red-600 dark:text-red-400">Upload failed. Check file type/size.</div> : null}
        {uploadMutation.isSuccess ? <div className="mt-2 text-sm text-[#2D6A4F] dark:text-[#52B788]">Document uploaded.</div> : null}
      </form>

      <div className="vf-card">
        <h2 className="vf-h2">My documents</h2>
        {docsQuery.isLoading ? <p className="mt-2 text-sm text-[#4A5568] dark:text-[#A8B2A8]">Loading...</p> : null}
        {docsQuery.isError ? <p className="mt-2 text-sm text-red-600">Failed to load documents.</p> : null}
        <div className="mt-3 space-y-2">
          {(docsQuery.data ?? []).map((doc) => (
            <div key={doc.id} className="rounded-2xl border border-[#E2DDD5] bg-white p-6 text-sm transition-all duration-200 hover:border-[#2D6A4F] dark:border-[#2D3E2D] dark:bg-[#1E2E1E] dark:hover:border-[#52B788]">
              <div className="break-all font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">{doc.file_name}</div>
              <div className="text-[#4A5568] dark:text-[#A8B2A8]">
                {doc.type} • {doc.status}
              </div>
              {doc.rejection_reason ? <div className="break-words text-red-700 dark:text-red-400">Reason: {doc.rejection_reason}</div> : null}
              <a href={doc.file_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[#2D6A4F] underline dark:text-[#52B788]">
                View file
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

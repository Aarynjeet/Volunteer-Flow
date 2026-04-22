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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Documents</h1>
        <p className="mt-1 text-sm text-slate-600">Upload your required documents and track review status.</p>
      </div>

      <form
        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          uploadMutation.mutate();
        }}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="w-full rounded border border-slate-300 px-3 py-2 text-sm" />
          <select value={type} onChange={(e) => setType(e.target.value as (typeof types)[number])} className="w-full rounded border border-slate-300 px-3 py-2 text-sm">
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button type="submit" className="w-full rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 md:w-auto" disabled={uploadMutation.isPending || !file}>
            Upload
          </button>
        </div>
        {uploadMutation.isError ? <div className="mt-2 text-sm text-red-600">Upload failed. Check file type/size.</div> : null}
        {uploadMutation.isSuccess ? <div className="mt-2 text-sm text-emerald-700">Document uploaded.</div> : null}
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">My documents</h2>
        {docsQuery.isLoading ? <p className="mt-2 text-sm text-slate-600">Loading...</p> : null}
        {docsQuery.isError ? <p className="mt-2 text-sm text-red-600">Failed to load documents.</p> : null}
        <div className="mt-3 space-y-2">
          {(docsQuery.data ?? []).map((doc) => (
            <div key={doc.id} className="rounded border border-slate-200 p-3 text-sm">
              <div className="break-all font-medium text-slate-900">{doc.file_name}</div>
              <div className="text-slate-600">
                {doc.type} • {doc.status}
              </div>
              {doc.rejection_reason ? <div className="break-words text-red-700">Reason: {doc.rejection_reason}</div> : null}
              <a href={doc.file_url} target="_blank" rel="noreferrer" className="mt-1 inline-block text-indigo-700 underline">
                View file
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

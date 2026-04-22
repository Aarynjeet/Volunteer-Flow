import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/axios';
import type { VolunteerProfile } from '../../types';

export function VolunteerProfile() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    phone: '',
    location: '',
    bio: '',
    experience: '',
    skills: '',
    availability: '',
    emergency_contact: '',
  });
  const [resume, setResume] = useState<File | null>(null);

  const profileQuery = useQuery({
    queryKey: ['volunteer-profile'],
    queryFn: async () => {
      const res = await api.get<VolunteerProfile>('/volunteer/profile');
      return res.data;
    },
  });

  useEffect(() => {
    if (!profileQuery.data) {
      return;
    }
    setForm({
      phone: profileQuery.data.phone ?? '',
      location: profileQuery.data.location ?? '',
      bio: profileQuery.data.bio ?? '',
      experience: profileQuery.data.experience ?? '',
      skills: profileQuery.data.skills ?? '',
      availability: profileQuery.data.availability ?? '',
      emergency_contact: profileQuery.data.emergency_contact ?? '',
    });
  }, [profileQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = new FormData();
      payload.append('phone', form.phone);
      payload.append('location', form.location);
      payload.append('bio', form.bio);
      payload.append('experience', form.experience);
      payload.append('skills', form.skills);
      payload.append('availability', form.availability);
      payload.append('emergency_contact', form.emergency_contact);
      if (resume) {
        payload.append('resume', resume);
      }
      await api.post('/volunteer/profile?_method=PUT', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: async () => {
      setResume(null);
      await queryClient.invalidateQueries({ queryKey: ['volunteer-profile'] });
    },
  });

  if (profileQuery.isLoading) {
    return <div className="text-sm text-slate-600">Loading profile...</div>;
  }

  if (profileQuery.isError) {
    return <div className="text-sm text-red-600">Failed to load profile.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-1 text-sm text-slate-600">Update your volunteer profile information.</p>
      </div>

      <form
        className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm text-slate-700">
            Phone
            <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2" value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700">
            Location
            <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2" value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700 md:col-span-2">
            Bio
            <textarea className="mt-1 min-h-24 w-full resize-y rounded border border-slate-300 px-3 py-2" value={form.bio} onChange={(e) => setForm((v) => ({ ...v, bio: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700 md:col-span-2">
            Experience
            <textarea className="mt-1 min-h-24 w-full resize-y rounded border border-slate-300 px-3 py-2" value={form.experience} onChange={(e) => setForm((v) => ({ ...v, experience: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700 md:col-span-2">
            Skills
            <textarea className="mt-1 min-h-24 w-full resize-y rounded border border-slate-300 px-3 py-2" value={form.skills} onChange={(e) => setForm((v) => ({ ...v, skills: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700 md:col-span-2">
            Availability
            <textarea className="mt-1 min-h-24 w-full resize-y rounded border border-slate-300 px-3 py-2" value={form.availability} onChange={(e) => setForm((v) => ({ ...v, availability: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700 md:col-span-2">
            Emergency contact
            <input className="mt-1 w-full rounded border border-slate-300 px-3 py-2" value={form.emergency_contact} onChange={(e) => setForm((v) => ({ ...v, emergency_contact: e.target.value }))} />
          </label>
          <label className="text-sm text-slate-700 md:col-span-2">
            Resume used for organizer applications (PDF, max 5MB)
            <input
              type="file"
              accept="application/pdf"
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2"
              onChange={(e) => setResume(e.target.files?.[0] ?? null)}
            />
            {profileQuery.data?.resume_url ? (
              <a href={profileQuery.data.resume_url} target="_blank" rel="noreferrer" className="mt-2 inline-block break-all text-sm text-indigo-700 underline">
                View current resume: {profileQuery.data.resume_file_name ?? 'Resume'}
              </a>
            ) : null}
          </label>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button type="submit" className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 sm:w-auto" disabled={saveMutation.isPending}>
            Save profile
          </button>
          {saveMutation.isSuccess ? <span className="text-sm text-emerald-700">Saved.</span> : null}
          {saveMutation.isError ? <span className="text-sm text-red-600">Could not save profile.</span> : null}
        </div>
      </form>
    </div>
  );
}

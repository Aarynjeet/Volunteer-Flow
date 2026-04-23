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

  if (profileQuery.isLoading) return <div className="text-sm text-[#4A5568] dark:text-[#A8B2A8]">Loading profile...</div>;

  if (profileQuery.isError) {
    return <div className="text-sm text-red-600">Failed to load profile.</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="vf-h1">Profile</h1>
        <p className="mt-1 text-sm font-medium text-[#4A5568] dark:text-[#A8B2A8]">Update your volunteer profile information.</p>
      </div>

      <form
        className="grid gap-6 lg:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate();
        }}
      >
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-sm dark:border-[#2D3E2D] dark:bg-[#1E2E1E]">
          <h2 className="vf-h2 mb-4">Profile info</h2>
          <div className="grid gap-4">
          <label className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">
            Phone
            <input className="vf-input mt-1" value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} />
          </label>
          <label className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">
            Location
            <input className="vf-input mt-1" value={form.location} onChange={(e) => setForm((v) => ({ ...v, location: e.target.value }))} />
          </label>
          <label className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">
            Bio
            <textarea className="vf-input mt-1 min-h-24 resize-y" value={form.bio} onChange={(e) => setForm((v) => ({ ...v, bio: e.target.value }))} />
          </label>
          <label className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">
            Emergency contact
            <input className="vf-input mt-1" value={form.emergency_contact} onChange={(e) => setForm((v) => ({ ...v, emergency_contact: e.target.value }))} />
          </label>
          </div>
        </div>
        <div className="rounded-2xl border border-[#E2DDD5] bg-white p-6 shadow-sm dark:border-[#2D3E2D] dark:bg-[#1E2E1E]">
          <h2 className="vf-h2 mb-4">Resume and skills</h2>
          <div className="grid gap-4">
          <label className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">
            Experience
            <textarea className="vf-input mt-1 min-h-24 resize-y" value={form.experience} onChange={(e) => setForm((v) => ({ ...v, experience: e.target.value }))} />
          </label>
          <label className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">
            Skills
            <textarea className="vf-input mt-1 min-h-24 resize-y" value={form.skills} onChange={(e) => setForm((v) => ({ ...v, skills: e.target.value }))} />
          </label>
          <div className="flex flex-wrap gap-2">
            {form.skills
              .split(',')
              .map((skill) => skill.trim())
              .filter(Boolean)
              .map((skill) => (
                <span key={skill} className="rounded-full border border-green-200 bg-[#D8F3DC] px-3 py-1 text-sm text-[#2D6A4F] dark:border-green-800 dark:bg-green-900 dark:text-[#52B788]">
                  {skill}
                </span>
              ))}
          </div>
          <label className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">
            Availability
            <textarea className="vf-input mt-1 min-h-24 resize-y" value={form.availability} onChange={(e) => setForm((v) => ({ ...v, availability: e.target.value }))} />
          </label>
          <label className="text-sm font-semibold text-[#1A1A1A] dark:text-[#F0EDE4]">
            Resume used for organizer applications (PDF, max 5MB)
            <input
              type="file"
              accept="application/pdf"
              className="vf-input mt-1"
              onChange={(e) => setResume(e.target.files?.[0] ?? null)}
            />
            {profileQuery.data?.resume_url ? (
              <a href={profileQuery.data.resume_url} target="_blank" rel="noreferrer" className="mt-2 inline-block break-all text-sm text-[#2D6A4F] underline dark:text-[#52B788]">
                View current resume: {profileQuery.data.resume_file_name ?? 'Resume'}
              </a>
            ) : null}
          </label>
          </div>
        </div>
        <div className="lg:col-span-2 mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <button type="submit" className="vf-btn-primary w-full sm:w-auto disabled:opacity-50" disabled={saveMutation.isPending}>
            Save profile
          </button>
          {saveMutation.isSuccess ? <span className="text-sm text-[#2D6A4F] dark:text-[#52B788]">Saved.</span> : null}
          {saveMutation.isError ? <span className="text-sm text-red-600 dark:text-red-400">Could not save profile.</span> : null}
        </div>
      </form>
    </div>
  );
}

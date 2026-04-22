export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'volunteer' | 'organizer';
  created_at?: string;
  volunteer?: VolunteerProfile;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  required_volunteers: number;
  category: string;
  created_by: number;
  creator?: User;
  applications_count?: number;
  created_at?: string;
}

export interface Application {
  id: number;
  event_id: number;
  volunteer_id: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  event?: Event;
  volunteer?: User;
  created_at?: string;
}

export interface Document {
  id: number;
  volunteer_id: number;
  file_url: string;
  file_name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  volunteer?: User;
  created_at?: string;
}

export interface Hour {
  id: number;
  volunteer_id: number;
  event_id: number;
  hours: number;
  status: 'pending' | 'approved';
  event?: Event;
  volunteer?: User;
  created_at?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  read: boolean;
  created_at: string;
}

export interface VolunteerProfile {
  id: number;
  user_id: number;
  phone: string | null;
  location: string | null;
  bio: string | null;
  experience: string | null;
  skills: string | null;
  availability: string | null;
  emergency_contact: string | null;
  resume_url: string | null;
  resume_file_name: string | null;
  user?: User;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { AdminAnalytics } from './pages/admin/Analytics';
import { AdminDashboard } from './pages/admin/Dashboard';
import { AdminDocuments } from './pages/admin/Documents';
import { AdminEvents } from './pages/admin/Events';
import { AdminVolunteers } from './pages/admin/Volunteers';
import { CatchAllRedirect } from './pages/CatchAllRedirect';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OrganizerDashboard } from './pages/organizer/Dashboard';
import { OrganizerEventApplicants } from './pages/organizer/EventApplicants';
import { OrganizerEvents } from './pages/organizer/Events';
import { OrganizerVolunteers } from './pages/organizer/Volunteers';
import { VolunteerDashboard } from './pages/volunteer/Dashboard';
import { VolunteerApplications } from './pages/volunteer/Applications';
import { VolunteerDocuments } from './pages/volunteer/Documents';
import { VolunteerEvents } from './pages/volunteer/Events';
import { VolunteerHours } from './pages/volunteer/Hours';
import { VolunteerProfile } from './pages/volunteer/Profile';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/admin" element={<ProtectedRoute allowedRole="admin" />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="volunteers" element={<AdminVolunteers />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="documents" element={<AdminDocuments />} />
          <Route path="analytics" element={<AdminAnalytics />} />
        </Route>
      </Route>

      <Route path="/volunteer" element={<ProtectedRoute allowedRole="volunteer" />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<VolunteerDashboard />} />
          <Route path="profile" element={<VolunteerProfile />} />
          <Route path="events" element={<VolunteerEvents />} />
          <Route path="applications" element={<VolunteerApplications />} />
          <Route path="documents" element={<VolunteerDocuments />} />
          <Route path="hours" element={<VolunteerHours />} />
        </Route>
      </Route>

      <Route path="/organizer" element={<ProtectedRoute allowedRole="organizer" />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<OrganizerDashboard />} />
          <Route path="events" element={<OrganizerEvents />} />
          <Route path="events/:eventId/applicants" element={<OrganizerEventApplicants />} />
          <Route path="volunteers" element={<OrganizerVolunteers />} />
        </Route>
      </Route>

      <Route path="*" element={<CatchAllRedirect />} />
    </Routes>
  );
}

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from './Spinner';

type Role = 'admin' | 'volunteer' | 'organizer';

export function ProtectedRoute({ allowedRole }: { allowedRole: Role }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
}

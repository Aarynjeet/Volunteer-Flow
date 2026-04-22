import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/Spinner';

export function CatchAllRedirect() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/${user.role}/dashboard`} replace />;
}

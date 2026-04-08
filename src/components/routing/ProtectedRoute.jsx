// src/components/routing/ProtectedRoute.jsx
// BRANCH: feat/supabase-client (Gabriel B. Antonino — M3)
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { PageLoader } from '../ui/PageLoader.jsx';
import { ROUTES } from '../../utils/constants.js';

export function ProtectedRoute() {
  const { session, authLoading } = useAuth();

  if (authLoading) {
    return <PageLoader />;
  }
  if (!session) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  return <Outlet />;
}

// feat/auth-context — M1: Christian Adlawan (coordinates with M4)
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageLoader from './PageLoader';
import { ROLES, ROUTES } from '../utils/constants';

/**
 * Wraps a route so only authenticated users can access it.
 * Pass `allowedRoles` to further restrict by role.
 *
 * @param {{ children: React.ReactNode, allowedRoles?: string[] }}
 */
export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, role, loading } = useAuth();
  const location = useLocation();

  if (loading) return <PageLoader />;

  if (!currentUser) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Authenticated but wrong role — redirect to customers (safe default)
    return <Navigate to={ROUTES.CUSTOMERS} replace />;
  }

  return children;
}

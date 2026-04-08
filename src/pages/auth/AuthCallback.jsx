// src/pages/auth/AuthCallback.jsx
// BRANCH: feat/ui-auth-callback (Wayne Andy Y. Villamor — M4)
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { PageLoader } from '../../components/ui/PageLoader.jsx';
import { ROUTES } from '../../utils/constants.js';

/**
 * AuthContext already handles session detection and the login guard via
 * onAuthStateChange + getSession. This page simply waits for authLoading to
 * resolve, then routes based on whether a valid session + active profile exist.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const { authLoading, session, userProfile, authError } = useAuth();

  useEffect(() => {
    if (authLoading) return;

    if (session && userProfile) {
      navigate(ROUTES.CUSTOMERS, { replace: true });
      return;
    }
    if (authError) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }
    navigate(ROUTES.LOGIN, { replace: true });
  }, [authLoading, session, userProfile, authError, navigate]);

  return <PageLoader message="Finishing sign-in…" />;
}
